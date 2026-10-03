import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../store/inMemoryDb.js';
import { TOPICS, QUESTION_BANK } from '../services/questionBank.js';
import { AdaptiveEngine } from '../services/adaptiveEngine.js';
import { GeminiService } from '../services/geminiService.js';
import { AnalyticsService } from '../services/analyticsService.js';
import { config } from '../config.js';

export const examRouter = express.Router();

/**
 * Helper to determine appropriate Bloom level based on current ability theta
 */
function getTargetBloomLevel(theta) {
  if (theta < -1.0) return "Remember";
  if (theta < -0.2) return "Understand";
  if (theta < 0.6) return "Apply";
  if (theta < 1.4) return "Analyze";
  return "Evaluate";
}

/**
 * Sanitize question object before sending to client (strip secret answer/explanation)
 */
function sanitizeQuestion(q) {
  if (!q) return null;
  const { correctAnswer, explanation, ...sanitized } = q;
  return sanitized;
}

/**
 * GET /api/topics - List available preset topics
 */
examRouter.get('/topics', (req, res) => {
  res.json({
    topics: TOPICS,
    difficultyPresets: [
      { id: "auto", name: "Dynamic Adaptive Baseline", theta: 0.0, description: "Starts at neutral difficulty and dynamically calibrates" },
      { id: "beginner", name: "Foundational Baseline", theta: -1.2, description: "Starts with introductory concepts and scales up" },
      { id: "intermediate", name: "Intermediate Baseline", theta: 0.0, description: "Starts with standard engineering scenarios" },
      { id: "advanced", name: "Senior / Advanced Baseline", theta: 1.2, description: "Starts with complex distributed and architecture problems" }
    ]
  });
});

/**
 * POST /api/exams/start - Create new adaptive exam session
 */
examRouter.post('/exams/start', async (req, res) => {
  try {
    const {
      topic = "all",
      customTopic = "",
      targetQuestions = 6,
      initialDifficulty = 0.0,
      apiKey = null
    } = req.body;

    const resolvedTopic = customTopic.trim() ||
      (TOPICS.find(t => t.id === topic)?.name || "Comprehensive Full-Stack & Engineering");

    const startTheta = parseFloat(initialDifficulty) || 0.0;
    const sessionId = uuidv4();
    const targetBloom = getTargetBloomLevel(startTheta);

    // Generate first question targeting startTheta
    const firstQuestion = await GeminiService.generateAdaptiveQuestion({
      topic: resolvedTopic,
      targetDifficulty: startTheta,
      bloomLevel: targetBloom,
      excludeQuestions: [],
      apiKey
    });

    const session = {
      id: sessionId,
      topic: resolvedTopic,
      targetQuestions: Math.max(3, Math.min(20, parseInt(targetQuestions) || 6)),
      initialDifficulty: startTheta,
      currentTheta: startTheta,
      sem: 1.0,
      status: 'active',
      startedAt: new Date().toISOString(),
      currentQuestion: firstQuestion,
      servedQuestionIds: [firstQuestion.id],
      questionIndex: 1,
      responses: [],
      abilityHistory: [],
      apiKey: apiKey || null
    };

    db.createSession(session);

    const metrics = AdaptiveEngine.calculateScoreMetrics(startTheta);

    res.json({
      sessionId,
      topic: session.topic,
      targetQuestions: session.targetQuestions,
      currentQuestionIndex: 1,
      currentTheta: startTheta,
      sem: 1.0,
      masteryLevel: metrics.masteryLevel,
      badgeColor: metrics.badgeColor,
      question: sanitizeQuestion(firstQuestion)
    });
  } catch (err) {
    console.error("[POST /exams/start] Error:", err);
    res.status(500).json({ error: "Failed to initialize exam session." });
  }
});

/**
 * GET /api/exams/:sessionId/current - Get active question
 */
examRouter.get('/exams/:sessionId/current', (req, res) => {
  const session = db.getSession(req.params.sessionId);
  if (!session) {
    return res.status(404).json({ error: "Exam session not found." });
  }

  if (session.status === 'completed') {
    return res.json({ isFinished: true, results: session.results });
  }

  const metrics = AdaptiveEngine.calculateScoreMetrics(session.currentTheta);

  res.json({
    sessionId: session.id,
    topic: session.topic,
    targetQuestions: session.targetQuestions,
    currentQuestionIndex: session.questionIndex,
    currentTheta: session.currentTheta,
    sem: session.sem,
    masteryLevel: metrics.masteryLevel,
    badgeColor: metrics.badgeColor,
    question: sanitizeQuestion(session.currentQuestion)
  });
});

/**
 * POST /api/exams/:sessionId/answer - Submit answer and adapt
 */
examRouter.post('/exams/:sessionId/answer', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { answer, timeSpentSeconds = 30, apiKey = null } = req.body;

    const session = db.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Exam session not found." });
    }

    if (session.status === 'completed') {
      return res.json({ isFinished: true, results: session.results });
    }

    const currentQ = session.currentQuestion;
    if (!currentQ) {
      return res.status(400).json({ error: "No active question in this session." });
    }

    // Evaluate answer
    const isCorrect = String(answer).trim() === String(currentQ.correctAnswer).trim();

    // Record response item
    const responseRecord = {
      questionId: currentQ.id,
      question: currentQ.question,
      codeSnippet: currentQ.codeSnippet,
      selectedAnswer: answer,
      correctAnswer: currentQ.correctAnswer,
      isCorrect,
      explanation: currentQ.explanation,
      difficulty: currentQ.difficulty,
      discrimination: currentQ.discrimination || 1.4,
      bloomLevel: currentQ.bloomLevel,
      subtopic: currentQ.subtopic || session.topic,
      topic: session.topic,
      timeSpentSeconds: Math.max(1, parseInt(timeSpentSeconds) || 1)
    };

    session.responses.push(responseRecord);

    // Compute updated latent ability theta via IRT Bayesian update
    const abilityData = AdaptiveEngine.estimateAbility(
      session.responses.map(r => ({
        difficulty: r.difficulty,
        discrimination: r.discrimination,
        isCorrect: r.isCorrect
      })),
      session.initialDifficulty
    );

    session.currentTheta = abilityData.theta;
    session.sem = abilityData.sem;

    // Record ability trajectory point
    session.abilityHistory.push({
      questionIndex: session.questionIndex,
      theta: abilityData.theta,
      sem: abilityData.sem,
      difficulty: currentQ.difficulty,
      isCorrect
    });

    const isExamComplete = session.responses.length >= session.targetQuestions;

    if (!isExamComplete) {
      // Pick or generate next adaptive question
      const targetBloom = getTargetBloomLevel(session.currentTheta);
      const nextQ = await GeminiService.generateAdaptiveQuestion({
        topic: session.topic,
        targetDifficulty: session.currentTheta,
        bloomLevel: targetBloom,
        excludeQuestions: session.responses.map(r => r.questionId),
        apiKey: apiKey || session.apiKey
      });

      session.questionIndex += 1;
      session.currentQuestion = nextQ;
      session.servedQuestionIds.push(nextQ.id);

      db.updateSession(sessionId, session);

      const metrics = AdaptiveEngine.calculateScoreMetrics(session.currentTheta);

      return res.json({
        isFinished: false,
        isCorrect,
        correctAnswer: currentQ.correctAnswer,
        explanation: currentQ.explanation,
        hint: currentQ.hint,
        newTheta: abilityData.theta,
        sem: abilityData.sem,
        masteryLevel: metrics.masteryLevel,
        badgeColor: metrics.badgeColor,
        nextQuestionIndex: session.questionIndex,
        totalQuestions: session.targetQuestions,
        nextQuestion: sanitizeQuestion(nextQ)
      });
    }

    // Complete the exam session
    session.status = 'completed';
    session.completedAt = new Date().toISOString();

    const analyticsResults = AnalyticsService.processSessionResults(session);

    // Generate comprehensive AI remediation
    const remediation = await GeminiService.generateRemediationPlan({
      topic: session.topic,
      finalTheta: session.currentTheta,
      responses: session.responses,
      scoreMetrics: AdaptiveEngine.calculateScoreMetrics(session.currentTheta),
      apiKey: apiKey || session.apiKey
    });

    const fullResults = {
      ...analyticsResults,
      remediation,
      responses: session.responses
    };

    session.results = fullResults;
    db.updateSession(sessionId, session);

    // Store in history
    db.recordHistory({
      sessionId: session.id,
      topic: session.topic,
      totalQuestions: session.targetQuestions,
      accuracy: analyticsResults.accuracy,
      scaledScore: analyticsResults.scaledScore,
      percentile: analyticsResults.percentile,
      masteryLevel: analyticsResults.masteryLevel,
      finalTheta: analyticsResults.finalTheta,
      completedAt: session.completedAt
    });

    return res.json({
      isFinished: true,
      isCorrect,
      correctAnswer: currentQ.correctAnswer,
      explanation: currentQ.explanation,
      newTheta: abilityData.theta,
      sem: abilityData.sem,
      results: fullResults
    });

  } catch (err) {
    console.error("[POST /exams/:sessionId/answer] Error:", err);
    res.status(500).json({ error: "Failed to evaluate answer and update adaptive score." });
  }
});

/**
 * POST /api/exams/:sessionId/finish - Conclude exam early
 */
examRouter.post('/exams/:sessionId/finish', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = db.getSession(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Exam session not found." });
    }

    if (session.status === 'completed') {
      return res.json({ results: session.results });
    }

    session.status = 'completed';
    session.completedAt = new Date().toISOString();

    const analyticsResults = AnalyticsService.processSessionResults(session) || {
      topic: session.topic,
      accuracy: 0,
      scaledScore: 400,
      percentile: 20,
      masteryLevel: "Incomplete Assessment",
      finalTheta: session.currentTheta,
      bloomBreakdown: [],
      radarSkills: [],
      timing: { totalSeconds: 0, avgSeconds: 0 },
      trajectory: []
    };

    const remediation = await GeminiService.generateRemediationPlan({
      topic: session.topic,
      finalTheta: session.currentTheta,
      responses: session.responses,
      scoreMetrics: AdaptiveEngine.calculateScoreMetrics(session.currentTheta),
      apiKey: session.apiKey
    });

    const fullResults = {
      ...analyticsResults,
      remediation,
      responses: session.responses
    };

    session.results = fullResults;
    db.updateSession(sessionId, session);

    db.recordHistory({
      sessionId: session.id,
      topic: session.topic,
      totalQuestions: session.responses.length,
      accuracy: analyticsResults.accuracy,
      scaledScore: analyticsResults.scaledScore,
      percentile: analyticsResults.percentile,
      masteryLevel: analyticsResults.masteryLevel,
      finalTheta: analyticsResults.finalTheta,
      completedAt: session.completedAt
    });

    res.json({ results: fullResults });
  } catch (err) {
    console.error("[POST /exams/:sessionId/finish] Error:", err);
    res.status(500).json({ error: "Failed to finalize exam session." });
  }
});

/**
 * GET /api/exams/:sessionId/results - Fetch results
 */
examRouter.get('/exams/:sessionId/results', (req, res) => {
  const session = db.getSession(req.params.sessionId);
  if (!session || !session.results) {
    return res.status(404).json({ error: "Exam results not found for this session." });
  }
  res.json({ results: session.results });
});

/**
 * GET /api/history - Get past exam history
 */
examRouter.get('/history', (req, res) => {
  res.json({ history: db.getHistory() });
});

/**
 * POST /api/system/verify-key - Test user Gemini API key
 */
examRouter.post('/system/verify-key', async (req, res) => {
  const { apiKey } = req.body;
  const result = await GeminiService.verifyKey(apiKey);
  res.json(result);
});

/**
 * GET /api/system/status - Check backend status and Gemini availability
 */
examRouter.get('/system/status', (req, res) => {
  const hasServerKey = Boolean(config.geminiApiKey);
  res.json({
    status: "online",
    hasServerApiKey: hasServerKey,
    model: config.geminiModel,
    itemBankCount: QUESTION_BANK.length,
    activeSessions: db.sessions.size
  });
});
