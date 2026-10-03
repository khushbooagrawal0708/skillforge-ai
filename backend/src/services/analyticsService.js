import { AdaptiveEngine } from './adaptiveEngine.js';

export class AnalyticsService {
  /**
   * Process raw session data into a comprehensive analytics report
   */
  static processSessionResults(session) {
    const { responses = [], abilityHistory = [], topic } = session;
    const totalQuestions = responses.length;

    if (totalQuestions === 0) {
      return null;
    }

    const correctResponses = responses.filter(r => r.isCorrect);
    const correctCount = correctResponses.length;
    const accuracy = Math.round((correctCount / totalQuestions) * 100);

    // Final theta and metrics
    const finalAbilityData = AdaptiveEngine.estimateAbility(
      responses.map(r => ({
        difficulty: r.difficulty,
        discrimination: r.discrimination || 1.4,
        isCorrect: r.isCorrect
      })),
      session.initialDifficulty || 0.0
    );

    const scoreMetrics = AdaptiveEngine.calculateScoreMetrics(finalAbilityData.theta);

    // 1. Bloom's Taxonomy breakdown
    const bloomLevels = ["Remember", "Understand", "Apply", "Analyze", "Evaluate"];
    const bloomBreakdown = bloomLevels.map(level => {
      const levelResponses = responses.filter(r => (r.bloomLevel || "").toLowerCase() === level.toLowerCase());
      const levelTotal = levelResponses.length;
      const levelCorrect = levelResponses.filter(r => r.isCorrect).length;
      const pct = levelTotal > 0 ? Math.round((levelCorrect / levelTotal) * 100) : null;

      return {
        level,
        total: levelTotal,
        correct: levelCorrect,
        accuracy: pct
      };
    }).filter(b => b.total > 0);

    // 2. Subtopic / Category breakdown for Radar Chart
    const subtopicMap = {};
    for (const r of responses) {
      const key = r.subtopic || r.topic || "Core Knowledge";
      if (!subtopicMap[key]) {
        subtopicMap[key] = { total: 0, correct: 0, sumDiff: 0 };
      }
      subtopicMap[key].total += 1;
      if (r.isCorrect) subtopicMap[key].correct += 1;
      subtopicMap[key].sumDiff += r.difficulty;
    }

    const radarSkills = Object.entries(subtopicMap).map(([subtopic, data]) => {
      const acc = Math.round((data.correct / data.total) * 100);
      const avgDiff = parseFloat((data.sumDiff / data.total).toFixed(1));
      // Calibrated proficiency weight combines accuracy with average difficulty faced
      const proficiency = Math.min(100, Math.max(10, Math.round(acc * 0.7 + (avgDiff + 2) * 7.5)));
      return {
        skill: subtopic.length > 22 ? subtopic.slice(0, 20) + "..." : subtopic,
        fullSkillName: subtopic,
        accuracy: acc,
        proficiency,
        questionCount: data.total
      };
    });

    // 3. Time analytics
    const times = responses.map(r => r.timeSpentSeconds || 0);
    const totalTimeSeconds = times.reduce((a, b) => a + b, 0);
    const avgTimeSeconds = Math.round(totalTimeSeconds / Math.max(1, totalQuestions));
    const fastestSeconds = Math.min(...times);
    const slowestSeconds = Math.max(...times);

    // 4. Ability adaptation progression points (trajectory)
    const trajectory = abilityHistory.map((h, idx) => ({
      step: idx + 1,
      theta: h.theta,
      sem: h.sem,
      questionDifficulty: h.difficulty,
      isCorrect: h.isCorrect,
      label: `Q${idx + 1}`
    }));

    return {
      topic,
      totalQuestions,
      correctCount,
      accuracy,
      finalTheta: finalAbilityData.theta,
      sem: finalAbilityData.sem,
      confidenceInterval: finalAbilityData.confidenceInterval,
      scaledScore: scoreMetrics.scaledScore,
      percentile: scoreMetrics.percentile,
      masteryLevel: scoreMetrics.masteryLevel,
      badgeColor: scoreMetrics.badgeColor,
      bloomBreakdown,
      radarSkills,
      timing: {
        totalSeconds: totalTimeSeconds,
        avgSeconds: avgTimeSeconds,
        fastestSeconds,
        slowestSeconds
      },
      trajectory,
      completedAt: new Date().toISOString()
    };
  }
}
