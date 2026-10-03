import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Lightbulb, 
  ArrowRight, 
  Code2, 
  Sparkles, 
  Send,
  Copy,
  Check
} from 'lucide-react';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export function QuestionCard({
  question,
  selectedAnswer,
  onSelectAnswer,
  onSubmitAnswer,
  onNextQuestion,
  isSubmitted,
  evaluationResult,
  loading,
  isLastQuestion
}) {
  const [showHint, setShowHint] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!question) return null;

  const handleCopyCode = () => {
    if (question.codeSnippet) {
      navigator.clipboard.writeText(question.codeSnippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const getDifficultyBadge = (diff) => {
    if (diff < -1.0) return { label: "Foundational", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    if (diff < 0.5) return { label: "Intermediate", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
    if (diff < 1.5) return { label: "Advanced", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" };
    return { label: "Expert / Architect", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
  };

  const diffBadge = getDifficultyBadge(question.difficulty);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Question Container Card */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden space-y-6">
        
        {/* Top Badges */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
              {question.subtopic || question.topic}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${diffBadge.color}`}>
              {diffBadge.label} (b = {question.difficulty})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {question.generatedByAi && (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Sparkles className="w-3 h-3" />
                <span>Gemini Synthesized</span>
              </span>
            )}
            {question.hint && (
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1 text-xs font-medium text-amber-400/90 hover:text-amber-300 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                title="Toggle Psychometric Hint"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{showHint ? "Hide Hint" : "Hint"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Hint Box if open */}
        {showHint && question.hint && (
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-600/30 text-amber-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Guiding Hint: </span>
              <span>{question.hint}</span>
            </div>
          </div>
        )}

        {/* Question Prompt Text */}
        <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed tracking-tight">
          {question.question}
        </h2>

        {/* Code Snippet Box (if provided) */}
        {question.codeSnippet && (
          <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative group">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/50 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Code Context</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 hover:text-white transition-colors"
                title="Copy code snippet"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <pre className="p-4 text-xs sm:text-sm font-mono text-emerald-300 overflow-x-auto leading-relaxed selection:bg-indigo-500">
              <code>{question.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* 4 Options Grid */}
        <div className="space-y-3 pt-2">
          {question.options.map((optionText, idx) => {
            const letter = OPTION_LABELS[idx] || `${idx + 1}`;
            const isSelected = selectedAnswer === optionText;

            // Feedback styling
            let optionStyles = 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60 text-slate-300';
            let indicatorStyles = 'bg-slate-800 border-slate-700 text-slate-300';

            if (isSubmitted && evaluationResult) {
              const isCorrectAnswer = optionText === evaluationResult.correctAnswer;
              const isSelectedAnswer = optionText === selectedAnswer;

              if (isCorrectAnswer) {
                optionStyles = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 ring-2 ring-emerald-500/20';
                indicatorStyles = 'bg-emerald-600 border-emerald-500 text-white';
              } else if (isSelectedAnswer && !evaluationResult.isCorrect) {
                optionStyles = 'border-rose-500 bg-rose-950/40 text-rose-200 ring-2 ring-rose-500/20';
                indicatorStyles = 'bg-rose-600 border-rose-500 text-white';
              } else {
                optionStyles = 'border-slate-900 bg-slate-950/30 text-slate-500 opacity-60';
              }
            } else if (isSelected) {
              optionStyles = 'border-indigo-500 bg-indigo-950/40 text-white ring-2 ring-indigo-500/30 shadow-md shadow-indigo-500/10';
              indicatorStyles = 'bg-indigo-600 border-indigo-500 text-white font-bold';
            }

            return (
              <div
                key={idx}
                onClick={() => {
                  if (!isSubmitted && !loading) {
                    onSelectAnswer(optionText);
                  }
                }}
                className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-150 ${optionStyles} ${
                  isSubmitted ? 'cursor-default' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${indicatorStyles}`}>
                  {letter}
                </div>
                <div className="flex-1 text-sm pt-1 leading-relaxed">
                  {optionText}
                </div>
                {isSubmitted && evaluationResult && (
                  <div className="shrink-0 pt-1">
                    {optionText === evaluationResult.correctAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    )}
                    {optionText === selectedAnswer && !evaluationResult.isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Immediate Explanation Banner after submission */}
        {isSubmitted && evaluationResult && (
          <div className={`p-5 rounded-2xl border animate-in fade-in duration-300 space-y-2.5 ${
            evaluationResult.isCorrect
              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-100'
              : 'bg-rose-950/30 border-rose-500/30 text-rose-100'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              {evaluationResult.isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400">Correct! Ability calibrated upward (θ = {evaluationResult.newTheta > 0 ? `+${evaluationResult.newTheta}` : evaluationResult.newTheta})</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-400" />
                  <span className="text-rose-400">Incorrect. Calibrating difficulty (θ = {evaluationResult.newTheta > 0 ? `+${evaluationResult.newTheta}` : evaluationResult.newTheta})</span>
                </>
              )}
            </div>
            <div className="text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2">
              <span className="font-semibold text-slate-200">Architectural Rationale: </span>
              <span>{evaluationResult.explanation}</span>
            </div>
          </div>
        )}

        {/* Bottom Action Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {!isSubmitted ? "Select the most accurate option and submit" : "Review feedback and proceed"}
          </div>

          <div>
            {!isSubmitted ? (
              <button
                type="button"
                onClick={onSubmitAnswer}
                disabled={!selectedAnswer || loading}
                className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Grading & Adapting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Answer</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={onNextQuestion}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
              >
                <span>{isLastQuestion ? "View Comprehensive Analytics" : "Next Adaptive Question"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
