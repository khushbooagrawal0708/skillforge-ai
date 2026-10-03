import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config.js';
import { QUESTION_BANK } from './questionBank.js';
import { v4 as uuidv4 } from 'uuid';

export class GeminiService {
  /**
   * Initialize client with priority:
   * 1. Per-request explicit API key
   * 2. Server environment GEMINI_API_KEY
   */
  static getClient(overrideApiKey = null) {
    const key = overrideApiKey || config.geminiApiKey;
    if (!key) return null;
    return new GoogleGenerativeAI(key);
  }

  /**
   * Verify if an API key is functional
   */
  static async verifyKey(apiKey) {
    if (!apiKey) return { valid: false, message: "No API key provided." };
    try {
      const client = new GoogleGenerativeAI(apiKey);
      const model = client.getGenerativeModel({ model: config.geminiModel });
      const result = await model.generateContent("Respond with single word: OK");
      const text = result.response.text();
      return { valid: true, message: "Key verified successfully!", response: text.trim() };
    } catch (err) {
      return { valid: false, message: err.message || "Failed to verify Gemini API key." };
    }
  }

  /**
   * Dynamically generate an adaptive question using Gemini AI
   */
  static async generateAdaptiveQuestion({ topic, targetDifficulty, bloomLevel, excludeQuestions = [], apiKey = null }) {
    const client = this.getClient(apiKey);

    // If client is available, attempt Gemini generation
    if (client) {
      try {
        const model = client.getGenerativeModel({
          model: config.geminiModel,
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json",
          }
        });

        const prompt = `
You are an expert psychometrician and computer science professor creating an adaptive assessment question.
Topic: "${topic}"
Target IRT Difficulty Parameter b: ${targetDifficulty.toFixed(2)} (on psychometric scale from -2.5 very easy to +2.5 very hard)
Target Bloom's Taxonomy Cognitive Level: "${bloomLevel}"
Questions to avoid or not duplicate: ${JSON.stringify(excludeQuestions.slice(-5))}

Output a JSON object with this exact structure:
{
  "question": "Clear, concise, conceptually rigorous question text",
  "codeSnippet": "Optional multiline code snippet in relevant language or null if purely conceptual",
  "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
  "correctAnswer": "Exact string identical to one of the 4 options above",
  "explanation": "Detailed explanation of why the correct option is right and why common distractors fail",
  "hint": "Subtle guiding hint that nudges without giving away the direct answer",
  "bloomLevel": "${bloomLevel}",
  "subtopic": "Specific subtopic identifier",
  "difficulty": ${targetDifficulty.toFixed(2)},
  "discrimination": 1.5
}
Ensure the question specifically tests deep understanding at the ${bloomLevel} level. Do not wrap in markdown quotes.
`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const parsed = JSON.parse(responseText);

        // Sanity checks on parsed JSON
        if (
          parsed.question &&
          Array.isArray(parsed.options) &&
          parsed.options.length === 4 &&
          parsed.options.includes(parsed.correctAnswer)
        ) {
          return {
            id: `ai-${uuidv4().slice(0, 8)}`,
            topic,
            subtopic: parsed.subtopic || topic,
            difficulty: parseFloat(targetDifficulty.toFixed(2)),
            discrimination: 1.5,
            bloomLevel: parsed.bloomLevel || bloomLevel,
            question: parsed.question,
            codeSnippet: parsed.codeSnippet || null,
            options: parsed.options,
            correctAnswer: parsed.correctAnswer,
            explanation: parsed.explanation,
            hint: parsed.hint || "Carefully evaluate the constraints and architectural implications.",
            generatedByAi: true
          };
        }
      } catch (err) {
        console.warn("[GeminiService] AI generation failed, falling back to curated bank:", err.message);
      }
    }

    // Fallback: Smart selection from calibrated Question Bank or synthetic generator
    return this.fallbackSelectOrSynthesize({ topic, targetDifficulty, bloomLevel, excludeQuestions });
  }

  /**
   * High-quality fallback selection and procedural generation
   */
  static fallbackSelectOrSynthesize({ topic, targetDifficulty, bloomLevel, excludeQuestions = [] }) {
    const excludeIds = new Set(excludeQuestions.map(q => q.id || q));

    // Filter bank by topic if specific
    let pool = QUESTION_BANK.filter(q => !excludeIds.has(q.id));
    if (topic && topic !== "all" && topic !== "Comprehensive Full-Stack & Engineering") {
      const topicMatches = pool.filter(q =>
        q.topic.toLowerCase().includes(topic.toLowerCase()) ||
        topic.toLowerCase().includes(q.topic.toLowerCase())
      );
      if (topicMatches.length > 0) pool = topicMatches;
    }

    if (pool.length > 0) {
      // Find item with closest difficulty delta
      pool.sort((a, b) => Math.abs(a.difficulty - targetDifficulty) - Math.abs(b.difficulty - targetDifficulty));
      return { ...pool[0], generatedByAi: false };
    }

    // If completely exhausted or custom topic requested, procedurally synthesize calibrated question
    return this.synthesizeProceduralQuestion(topic, targetDifficulty, bloomLevel);
  }

  /**
   * Procedural question synthesizer for any arbitrary user topic
   */
  static synthesizeProceduralQuestion(topic, targetDifficulty, bloomLevel) {
    const cleanTopic = topic || "Software Architecture";
    const isHard = targetDifficulty > 0.5;
    const isEasy = targetDifficulty < -0.5;

    let question, options, correctAnswer, explanation, hint;

    if (isEasy) {
      question = `Which fundamental principle is central to maintainable design in ${cleanTopic}?`;
      options = [
        "Separation of concerns and modular encapsulation",
        "Coupling all modules directly into a global namespace",
        "Ignoring asynchronous states to reduce complexity",
        "Hardcoding configuration parameters into production code"
      ];
      correctAnswer = options[0];
      explanation = `In ${cleanTopic}, separation of concerns and modular encapsulation isolate state and minimize unintended side-effects across components.`;
      hint = "Look for the answer that promotes decoupling and isolation of responsibility.";
    } else if (isHard) {
      question = `When optimizing high-throughput workflows in ${cleanTopic}, what is the critical architectural trade-off between optimistic concurrency and pessimistic locking?`;
      options = [
        "Optimistic concurrency achieves higher throughput under low contention by detecting version collisions at commit, whereas pessimistic locking avoids rollbacks at the cost of blocking threads",
        "Pessimistic locking consumes zero memory locks because it delegates conflict resolution to the client",
        "Optimistic concurrency guarantees zero aborted transactions regardless of write contention density",
        "Both strategies exhibit identical latency distributions irrespective of resource contention"
      ];
      correctAnswer = options[0];
      explanation = `Optimistic concurrency control assumes conflicts are rare, checking row versions before commit, saving lock overhead. Under heavy contention, rollbacks spike, making pessimistic locking preferable to prevent wasted work.`;
      hint = "Compare how both approaches handle write conflicts: upfront lock vs post-execution validation.";
    } else {
      question = `What is the primary operational advantage of implementing idempotent operations within ${cleanTopic}?`;
      options = [
        "Allows safe retries upon transient network failures without duplicating side-effects",
        "Compensates for syntax errors in application business logic",
        "Guarantees that database storage size remains constant over time",
        "Automatically compresses JSON payload sizes by 50%"
      ];
      correctAnswer = options[0];
      explanation = `Idempotency ensures that performing the same operation multiple times yields the exact same state as performing it once, enabling fault-tolerant retry loops.`;
      hint = "Consider what happens when a network timeout drops a server response.";
    }

    return {
      id: `syn-${uuidv4().slice(0, 8)}`,
      topic: cleanTopic,
      subtopic: `${cleanTopic} Fundamentals`,
      difficulty: parseFloat(targetDifficulty.toFixed(2)),
      discrimination: 1.4,
      bloomLevel: bloomLevel || "Apply",
      question,
      codeSnippet: null,
      options,
      correctAnswer,
      explanation,
      hint,
      generatedByAi: false
    };
  }

  /**
   * Generate comprehensive AI remediation and diagnostic report
   */
  static async generateRemediationPlan({ topic, finalTheta, responses, scoreMetrics, apiKey = null }) {
    const client = this.getClient(apiKey);
    const missed = responses.filter(r => !r.isCorrect);
    const correct = responses.filter(r => r.isCorrect);

    const summaryPayload = {
      topic,
      finalTheta,
      scaledScore: scoreMetrics.scaledScore,
      percentile: scoreMetrics.percentile,
      masteryLevel: scoreMetrics.masteryLevel,
      accuracy: `${Math.round((correct.length / responses.length) * 100)}%`,
      missedConcepts: missed.map(m => ({ subtopic: m.subtopic, bloomLevel: m.bloomLevel, question: m.question })),
      masteredConcepts: correct.map(c => ({ subtopic: c.subtopic, bloomLevel: c.bloomLevel }))
    };

    if (client) {
      try {
        const model = client.getGenerativeModel({
          model: config.geminiModel,
          generationConfig: {
            temperature: 0.6,
            responseMimeType: "application/json"
          }
        });

        const prompt = `
Analyze this adaptive exam student performance data:
${JSON.stringify(summaryPayload, null, 2)}

Provide a comprehensive, empathetic, actionable diagnostic report in this JSON format:
{
  "executiveSummary": "2-3 sentences evaluating the student's true latent capability and consistency under adaptive pressure",
  "keyStrengths": ["Strength 1 with concept reference", "Strength 2 with concept reference"],
  "criticalGaps": ["Specific misconception identified 1", "Specific misconception identified 2"],
  "remediationRoadmap": [
    {
      "step": 1,
      "title": "Immediate Action",
      "focus": "Specific concept to review",
      "recommendedPractice": "Actionable drill or project task"
    },
    {
      "step": 2,
      "title": "Intermediate Reinforcement",
      "focus": "Conceptual bridge",
      "recommendedPractice": "Architectural or coding exercise"
    },
    {
      "step": 3,
      "title": "Mastery Challenge",
      "focus": "Advanced synthesis or stress-test",
      "recommendedPractice": "Design or production scenario"
    }
  ],
  "recommendedStudyHours": 4
}
Ensure actionable, high-quality technical feedback.
`;

        const result = await model.generateContent(prompt);
        return JSON.parse(result.response.text());
      } catch (err) {
        console.warn("[GeminiService] AI remediation failed, using rule-based diagnostic:", err.message);
      }
    }

    // High quality rule-based diagnostic fallback
    return this.generateFallbackRemediation(summaryPayload);
  }

  /**
   * Rule-based diagnostic report generator
   */
  static generateFallbackRemediation(summary) {
    const missedList = summary.missedConcepts;
    const hasMissed = missedList.length > 0;

    const strengths = summary.masteredConcepts.length > 0
      ? summary.masteredConcepts.map(c => `Solid grasp of ${c.subtopic} (${c.bloomLevel} level)`).slice(0, 3)
      : ["Demonstrated perseverance through challenging adaptive questions"];

    const gaps = hasMissed
      ? missedList.map(m => `Review needed on ${m.subtopic}: missed ${m.bloomLevel} level reasoning`).slice(0, 3)
      : ["No critical gaps identified at this difficulty threshold. Ready for advanced specialization."];

    return {
      executiveSummary: `You completed the adaptive assessment with an estimated ability rating (θ) of ${summary.finalTheta}, placing you in the ${summary.percentile}th percentile (${summary.masteryLevel}). Your diagnostic profile shows an overall accuracy of ${summary.accuracy} across dynamically scaled difficulty tiers.`,
      keyStrengths: strengths,
      criticalGaps: gaps,
      remediationRoadmap: [
        {
          step: 1,
          title: "Targeted Remediation",
          focus: hasMissed ? missedList[0].subtopic : "Deep Edge Case Analysis",
          recommendedPractice: hasMissed
            ? `Deep-dive into documentation and solve 3 focused scenario problems regarding ${missedList[0].subtopic}.`
            : "Explore distributed edge cases and high-scale concurrency tradeoffs."
        },
        {
          step: 2,
          title: "Synthesize & Implement",
          focus: "Hands-on Implementation Drill",
          recommendedPractice: "Build a miniature proof-of-concept project validating your understanding without relying on high-level abstractions."
        },
        {
          step: 3,
          title: "Re-Assessment & Calibration",
          focus: "Higher Difficulty Adaptive Retest",
          recommendedPractice: "Take another SkillForge assessment at +0.5 higher baseline difficulty to verify permanent mastery retention."
        }
      ],
      recommendedStudyHours: Math.max(2, Math.round((100 - parseFloat(summary.accuracy)) * 0.1))
    };
  }
}
