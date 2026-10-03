import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  TrendingUp, 
  Target, 
  Brain, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Printer, 
  RefreshCw,
  BookOpen,
  AlertTriangle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

export function ExamResultsDashboard({ results, onRetake }) {
  const [openReviewIndex, setOpenReviewIndex] = useState(null);

  useEffect(() => {
    // Confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn("Confetti failed", e);
    }
  }, []);

  if (!results) return null;

  const {
    topic,
    totalQuestions,
    correctCount,
    accuracy,
    finalTheta,
    sem,
    confidenceInterval,
    scaledScore,
    percentile,
    masteryLevel,
    badgeColor,
    bloomBreakdown = [],
    radarSkills = [],
    timing = {},
    trajectory = [],
    remediation = null,
    responses = []
  } = results;

  const handlePrint = () => {
    window.print();
  };

  // Trajectory SVG coordinates calculation
  const svgWidth = 600;
  const svgHeight = 220;
  const padding = 40;

  const points = trajectory.map((item, idx) => {
    const x = padding + (idx / Math.max(1, trajectory.length - 1)) * (svgWidth - 2 * padding);
    // Map theta (-3 to +3) to y
    const normalizedY = (item.theta + 3.0) / 6.0;
    const y = svgHeight - padding - normalizedY * (svgHeight - 2 * padding);
    return { ...item, x, y };
  });

  const pathD = points.length > 1
    ? points.reduce((acc, curr, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`, '')
    : '';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Diagnostic Assessment Report</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {topic}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Evaluated via Item Response Theory (IRT 2PL) • Standard Error: ±{sem ? sem.toFixed(2) : '0.40'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Print Report</span>
          </button>
          <button
            onClick={onRetake}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retake Adaptive Exam</span>
          </button>
        </div>
      </div>

      {/* Hero Metrics Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Scaled Score Card */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 relative overflow-hidden">
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Scaled Score</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {scaledScore || 500}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ 1000</span>
          </div>
          <div className="mt-2 text-xs font-medium text-indigo-400">
            {percentile}th Percentile Rank
          </div>
        </div>

        {/* Latent Ability Theta */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 relative overflow-hidden">
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Latent Ability (θ)</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-purple-300 font-mono">
              {finalTheta !== undefined ? (finalTheta > 0 ? `+${finalTheta}` : finalTheta) : '0.00'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 font-mono">
            95% CI: [{confidenceInterval ? confidenceInterval.join(', ') : '-0.8, +1.2'}]
          </div>
        </div>

        {/* Mastery Tier */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 relative overflow-hidden">
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Mastery Classification</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <span className={`text-base sm:text-lg font-bold ${badgeColor || 'text-emerald-400'} block truncate`}>
              {masteryLevel || 'Competent'}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Accuracy: <span className="text-white font-semibold">{accuracy}%</span> ({correctCount}/{totalQuestions})
          </div>
        </div>

        {/* Time Performance */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 relative overflow-hidden">
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Time Efficiency</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white">
              {timing?.totalSeconds ? `${Math.round(timing.totalSeconds / 60)}m ${timing.totalSeconds % 60}s` : '2m 15s'}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Avg: <span className="text-amber-400 font-semibold">{timing?.avgSeconds || 25}s</span> / question
          </div>
        </div>

      </div>

      {/* Dynamic Adaptation Trajectory Graph */}
      {trajectory.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Real-Time Ability Adaptation Trajectory</h3>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Correct
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Missed
              </span>
            </div>
          </div>

          <div className="relative overflow-x-auto bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48">
              {/* Neutral baseline (theta = 0) */}
              <line
                x1={padding}
                y1={svgHeight / 2}
                x2={svgWidth - padding}
                y2={svgHeight / 2}
                stroke="#334155"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text x={padding - 5} y={svgHeight / 2 + 4} fill="#64748b" fontSize="10" textAnchor="end">
                θ = 0.0
              </text>

              {/* Grid lines for +2 and -2 */}
              <line
                x1={padding}
                y1={padding}
                x2={svgWidth - padding}
                y2={padding}
                stroke="#1e293b"
                strokeWidth="1"
              />
              <text x={padding - 5} y={padding + 4} fill="#64748b" fontSize="9" textAnchor="end">
                +2.5
              </text>
              <line
                x1={padding}
                y1={svgHeight - padding}
                x2={svgWidth - padding}
                y2={svgHeight - padding}
                stroke="#1e293b"
                strokeWidth="1"
              />
              <text x={padding - 5} y={svgHeight - padding + 4} fill="#64748b" fontSize="9" textAnchor="end">
                -2.5
              </text>

              {/* Trajectory curve */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="url(#trajectory-grad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Gradient definition */}
              <defs>
                <linearGradient id="trajectory-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>

              {/* Interactive nodes */}
              {points.map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="6"
                    fill={pt.isCorrect ? '#10b981' : '#f43f5e'}
                    stroke="#0f172a"
                    strokeWidth="2"
                  />
                  <text
                    x={pt.x}
                    y={svgHeight - 12}
                    fill="#94a3b8"
                    fontSize="10"
                    textAnchor="middle"
                  >
                    {pt.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            The curve illustrates how the psychometric engine continuously modulated item difficulty to probe your latent competence threshold. Upward steps reflect validated mastery; dips signify diagnostic boundaries.
          </p>
        </div>
      )}

      {/* Two Columns: Bloom's Taxonomy & Skill Mastery Radar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Bloom's Taxonomy Cognitive Mastery */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Cognitive Level Mastery (Bloom)</h3>
          </div>

          <div className="space-y-3.5">
            {bloomBreakdown.length > 0 ? (
              bloomBreakdown.map((item) => (
                <div key={item.level} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{item.level}</span>
                    <span className="text-indigo-400 font-mono">{item.accuracy !== null ? `${item.accuracy}%` : 'N/A'} ({item.correct}/{item.total})</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        (item.accuracy || 0) >= 75
                          ? 'bg-emerald-500'
                          : (item.accuracy || 0) >= 50
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${item.accuracy || 0}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">Comprehensive cognitive coverage across assessment levels.</p>
            )}
          </div>
        </div>

        {/* Subtopic Mastery Breakdown */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">Subtopic Proficiency Breakdown</h3>
          </div>

          <div className="space-y-3.5">
            {radarSkills.length > 0 ? (
              radarSkills.map((s) => (
                <div key={s.skill} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300 truncate max-w-[200px]" title={s.fullSkillName}>
                      {s.fullSkillName}
                    </span>
                    <span className="text-purple-400 font-mono">{s.proficiency} / 100</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${s.proficiency}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">Proficiency scores mapped to core domain modules.</p>
            )}
          </div>
        </div>

      </div>

      {/* AI Personalized Remediation & Study Roadmap */}
      {remediation && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-indigo-950/40 via-slate-900/90 to-slate-900/90 border border-indigo-500/30 space-y-6 shadow-2xl relative overflow-hidden">
          
          <div className="flex items-center gap-3 pb-4 border-b border-indigo-500/20">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Gemini AI Personalized Remediation Roadmap
              </h2>
              <p className="text-xs text-slate-400">
                Cognitive gap diagnosis and targeted high-yield mastery path
              </p>
            </div>
          </div>

          {/* Executive Diagnostic Summary */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-sm text-slate-300 leading-relaxed">
            <span className="font-bold text-white block mb-1">Diagnostic Evaluation:</span>
            {remediation.executiveSummary}
          </div>

          {/* Strengths & Critical Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Validated Strengths</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {remediation.keyStrengths?.map((st, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
                <AlertTriangle className="w-4 h-4" />
                <span>Target Remediation Areas</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {remediation.criticalGaps?.map((gap, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Actionable Remediation Steps */}
          {remediation.remediationRoadmap && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Prescribed 3-Step Remediation Plan</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {remediation.remediationRoadmap.map((step) => (
                  <div key={step.step} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                        Step {step.step}
                      </span>
                      <span className="text-xs font-semibold text-white">{step.title}</span>
                    </div>
                    <p className="text-xs font-medium text-purple-300">
                      {step.focus}
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {step.recommendedPractice}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Comprehensive Question-by-Question Review Accordion */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Question-by-Question Psychometric Audit</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {responses.length} items logged
          </span>
        </div>

        <div className="space-y-2.5">
          {responses.map((res, index) => {
            const isOpen = openReviewIndex === index;
            return (
              <div
                key={res.questionId || index}
                className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenReviewIndex(isOpen ? null : index)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="shrink-0">
                      {res.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">
                          Q{index + 1}: {res.subtopic || res.topic}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                          b = {res.difficulty}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {res.bloomLevel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {res.question}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                      {res.timeSpentSeconds}s
                    </span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="p-4 border-t border-slate-800 bg-slate-950/90 text-xs space-y-3 animate-in fade-in duration-150">
                    <div className="space-y-1 text-slate-200 font-medium">
                      <span className="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider">Full Question:</span>
                      <p className="leading-relaxed">{res.question}</p>
                    </div>

                    {res.codeSnippet && (
                      <pre className="p-3 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto">
                        <code>{res.codeSnippet}</code>
                      </pre>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      <div className={`p-2.5 rounded-xl border ${
                        res.isCorrect ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                      }`}>
                        <span className="block font-semibold text-[10px] uppercase tracking-wider text-slate-400">Your Answer:</span>
                        <span className="mt-0.5 block">{res.selectedAnswer}</span>
                      </div>

                      <div className="p-2.5 rounded-xl border bg-slate-900 border-slate-800 text-slate-200">
                        <span className="block font-semibold text-[10px] uppercase tracking-wider text-emerald-400">Correct Answer:</span>
                        <span className="mt-0.5 block">{res.correctAnswer}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-300 leading-relaxed">
                      <span className="font-semibold text-indigo-400 block mb-1">Architectural Explanation:</span>
                      {res.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
