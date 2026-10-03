import React from 'react';
import { Gauge, Clock, Target, Activity, Brain } from 'lucide-react';

export function ActiveExamHUD({
  currentTheta = 0.0,
  sem = 1.0,
  masteryLevel = "Competent",
  badgeColor = "text-emerald-400",
  currentQuestionIndex = 1,
  totalQuestions = 6,
  bloomLevel = "Understand",
  difficulty = 0.0,
  timeLeft = null,
  topic = "Full-Stack Assessment"
}) {
  // Map theta (-3.0 to +3.0) to percentage (0% to 100%)
  const clampedTheta = Math.max(-3.0, Math.min(3.0, currentTheta));
  const gaugePercent = ((clampedTheta + 3.0) / 6.0) * 100;

  // Bloom level color mapping
  const bloomColors = {
    Remember: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    Understand: "bg-teal-500/10 text-teal-400 border-teal-500/30",
    Apply: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    Analyze: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    Evaluate: "bg-rose-500/10 text-rose-400 border-rose-500/30"
  };

  const progressPercent = Math.round(((currentQuestionIndex - 1) / totalQuestions) * 100);

  return (
    <div className="w-full bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-16 z-30 shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-3.5 space-y-3">
        
        {/* Top row: Topic + Question count + Timer */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Exam:
            </span>
            <span className="text-xs font-semibold text-white px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 max-w-[220px] sm:max-w-none truncate">
              {topic}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Cognitive Bloom level */}
            <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${bloomColors[bloomLevel] || bloomColors.Understand}`}>
              <Brain className="w-3 h-3" />
              <span>Bloom: {bloomLevel}</span>
            </div>

            {/* Timer if active */}
            {timeLeft !== null && (
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono text-xs font-bold ${
                timeLeft <= 15 
                  ? 'bg-rose-950/60 border-rose-600 text-rose-300 animate-pulse'
                  : 'bg-slate-950 border-slate-700 text-slate-200'
              }`}>
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
              </div>
            )}

            {/* Question progress */}
            <div className="text-xs font-medium text-slate-300">
              Question <span className="text-indigo-400 font-bold">{currentQuestionIndex}</span> of <span className="font-bold">{totalQuestions}</span>
            </div>
          </div>

        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>

        {/* Real-time Dynamic IRT Difficulty Meter */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300">Dynamic Latent Ability:</span>
                <span className={`text-xs font-mono font-bold ${badgeColor}`}>
                  θ = {currentTheta >= 0 ? `+${currentTheta.toFixed(2)}` : currentTheta.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  (±{sem.toFixed(2)} SEM)
                </span>
              </div>
              <span className={`text-[11px] font-semibold ${badgeColor}`}>
                Current Tier: {masteryLevel}
              </span>
            </div>
          </div>

          {/* Interactive spectrum gauge */}
          <div className="flex-1 max-w-xs space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>Novice (-3)</span>
              <span>Mid (0)</span>
              <span>Master (+3)</span>
            </div>
            <div className="relative w-full h-2.5 rounded-full bg-slate-900 border border-slate-700/80 overflow-hidden">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-emerald-500 to-rose-500 opacity-60" />
              {/* Pin indicator */}
              <div 
                className="absolute top-0 bottom-0 w-2 bg-white rounded-full shadow-md shadow-white/50 -translate-x-1/2 transition-all duration-500"
                style={{ left: `${gaugePercent}%` }}
              />
            </div>
          </div>

          {/* Target item difficulty */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
            <Target className="w-3.5 h-3.5 text-indigo-400" />
            <span>Target b: <span className="font-mono text-slate-200 font-semibold">{difficulty.toFixed(1)}</span></span>
          </div>

        </div>

      </div>
    </div>
  );
}
