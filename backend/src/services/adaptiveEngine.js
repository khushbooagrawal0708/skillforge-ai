/**
 * Item Response Theory (IRT) 2-Parameter Logistic (2PL) Adaptive Testing Engine
 * Calculates:
 * - P(theta): Probability of answering correctly given student ability theta and item parameters
 * - Fisher Information: I(theta) for maximum diagnostic precision
 * - Bayesian Newton-Raphson ability updates with prior variance regularization
 * - Standard Error of Measurement (SEM)
 * - Cohort percentile approximation using standard normal CDF
 */

const D = 1.702; // Scaling factor for normal ogive metric equivalence
const PRIOR_VARIANCE = 1.0; // Standard normal prior for latent ability theta ~ N(0, 1)

export class AdaptiveEngine {
  /**
   * Probability of correct response under 2PL IRT model:
   * P_i(theta) = 1 / (1 + exp(-D * a_i * (theta - b_i)))
   */
  static probability(theta, difficulty, discrimination = 1.4) {
    const exponent = -D * discrimination * (theta - difficulty);
    // Bound exponent to prevent numerical overflow/underflow
    if (exponent > 40) return 0.0000001;
    if (exponent < -40) return 0.9999999;
    return 1 / (1 + Math.exp(exponent));
  }

  /**
   * Fisher Information provided by item i at ability level theta:
   * I_i(theta) = D^2 * a_i^2 * P_i(theta) * (1 - P_i(theta))
   */
  static itemInformation(theta, difficulty, discrimination = 1.4) {
    const p = this.probability(theta, difficulty, discrimination);
    return Math.pow(D * discrimination, 2) * p * (1 - p);
  }

  /**
   * Selects the next best item from available pool using Maximum Fisher Information (MFI)
   * with mild exploratory jitter to prevent identical tests for similar users.
   */
  static selectNextItem(availableItems, currentTheta, servedItemIds = new Set()) {
    const unserved = availableItems.filter(item => !servedItemIds.has(item.id));
    if (unserved.length === 0) return null;

    // Rank candidates by Fisher Information at currentTheta
    const scoredCandidates = unserved.map(item => {
      const info = this.itemInformation(currentTheta, item.difficulty, item.discrimination || 1.4);
      // Small stochastic perturbation (+- 5%) for item exposure control
      const jitter = (Math.random() - 0.5) * 0.1 * info;
      return {
        item,
        score: info + jitter,
        difficultyDelta: Math.abs(item.difficulty - currentTheta)
      };
    });

    // Sort descending by information score
    scoredCandidates.sort((a, b) => b.score - a.score);

    // Pick from top 2 candidates to maintain diversity while staying near-optimal
    const selectionPool = scoredCandidates.slice(0, Math.min(2, scoredCandidates.length));
    const chosen = selectionPool[Math.floor(Math.random() * selectionPool.length)];
    return chosen.item;
  }

  /**
   * Updates latent ability theta given test history using Bayesian Maximum A Posteriori (MAP)
   * history: Array of { difficulty, discrimination, isCorrect }
   */
  static estimateAbility(history, initialTheta = 0.0) {
    if (!history || history.length === 0) {
      return {
        theta: initialTheta,
        sem: 1.0,
        confidenceInterval: [initialTheta - 1.96, initialTheta + 1.96]
      };
    }

    let theta = initialTheta;
    const maxIterations = 25;
    const tolerance = 0.001;

    for (let iter = 0; iter < maxIterations; iter++) {
      let scoreSum = 0; // First derivative of log-posterior
      let infoSum = 1 / PRIOR_VARIANCE; // Second derivative (information matrix + prior)

      for (const res of history) {
        const a = res.discrimination || 1.4;
        const b = res.difficulty;
        const u = res.isCorrect ? 1 : 0;
        const p = this.probability(theta, b, a);

        scoreSum += D * a * (u - p);
        infoSum += Math.pow(D * a, 2) * p * (1 - p);
      }

      // Add prior penalty (theta / prior_variance)
      scoreSum -= theta / PRIOR_VARIANCE;

      const delta = scoreSum / infoSum;
      // Damped step to prevent oscillation
      const step = Math.max(-0.8, Math.min(0.8, delta));
      theta += step;

      // Bound theta within realistic psychometric range [-3.5, +3.5]
      theta = Math.max(-3.5, Math.min(3.5, theta));

      if (Math.abs(delta) < tolerance) break;
    }

    // Standard Error of Measurement: SEM = 1 / sqrt(Total Information)
    let totalInfo = 1 / PRIOR_VARIANCE;
    for (const res of history) {
      totalInfo += this.itemInformation(theta, res.difficulty, res.discrimination || 1.4);
    }
    const sem = 1 / Math.sqrt(totalInfo);

    return {
      theta: parseFloat(theta.toFixed(3)),
      sem: parseFloat(sem.toFixed(3)),
      confidenceInterval: [
        parseFloat((theta - 1.96 * sem).toFixed(2)),
        parseFloat((theta + 1.96 * sem).toFixed(2))
      ]
    };
  }

  /**
   * Convert IRT theta (-3.5 to +3.5) into a human-friendly scaled score (0 to 1000)
   * and standard cohort percentile.
   */
  static calculateScoreMetrics(theta) {
    // Normal cumulative distribution function (approximate)
    const percentile = this.normalCdf(theta) * 100;

    // Scaled score centered at 500, standard deviation 150 (SAT/GRE style psychometric scaling)
    const scaledScore = Math.round(Math.max(100, Math.min(990, 500 + theta * 150)));

    let masteryLevel = "Foundational";
    let badgeColor = "text-slate-400";

    if (theta < -1.2) {
      masteryLevel = "Novice (Foundational)";
      badgeColor = "text-amber-400";
    } else if (theta < -0.4) {
      masteryLevel = "Developing (Junior)";
      badgeColor = "text-blue-400";
    } else if (theta < 0.6) {
      masteryLevel = "Competent (Mid-Level)";
      badgeColor = "text-emerald-400";
    } else if (theta < 1.4) {
      masteryLevel = "Proficient (Senior)";
      badgeColor = "text-purple-400";
    } else {
      masteryLevel = "Master (Principal / Architect)";
      badgeColor = "text-rose-400";
    }

    return {
      scaledScore,
      percentile: parseFloat(percentile.toFixed(1)),
      masteryLevel,
      badgeColor
    };
  }

  /**
   * Approximation of standard normal CDF: Phi(z)
   */
  static normalCdf(z) {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = z < 0 ? -1 : 1;
    const x = Math.abs(z) / Math.sqrt(2.0);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return 0.5 * (1.0 + sign * y);
  }
}
