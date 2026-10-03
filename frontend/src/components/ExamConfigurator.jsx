import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  Globe, 
  Server, 
  BrainCircuit, 
  Terminal, 
  Edit3, 
  Play, 
  Gauge, 
  Clock, 
  CheckSquare, 
  Sparkles,
  Zap,
  Info
} from 'lucide-react';

const TOPIC_CARDS = [
  {
    id: "all",
    name: "Comprehensive Full-Stack & Engineering",
    description: "Multi-domain assessment spanning algorithms, architecture, AI, and systems",
    icon: Compass,
    color: "from-blue-500/20 to-indigo-500/20 border-indigo-500/40 text-indigo-400"
  },
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    description: "Complexity analysis, dynamic programming, graphs, and tree structures",
    icon: Layers,
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-400"
  },
  {
    id: "web",
    name: "Web Development & JavaScript",
    description: "Modern JS runtime, event loop, React rendering, performance, and security",
    icon: Globe,
    color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-400"
  },
  {
    id: "sys",
    name: "System Design & Cloud",
    description: "Distributed consensus, caching, microservices, CAP theorem, and scalability",
    icon: Server,
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-400"
  },
  {
    id: "ml",
    name: "Machine Learning & AI",
    description: "Transformers, attention, RAG, alignment, loss functions, and optimization",
    icon: BrainCircuit,
    color: "from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-400"
  },
  {
    id: "py",
    name: "Python & Backend Systems",
    description: "Concurrency, asyncio, GIL, memory models, and API architectures",
    icon: Terminal,
    color: "from-yellow-500/20 to-amber-500/20 border-yellow-500/40 text-yellow-400"
  }
];

export function ExamConfigurator({ onStartExam, loading }) {
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [customTopic, setCustomTopic] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [targetQuestions, setTargetQuestions] = useState(6);
  const [initialDifficulty, setInitialDifficulty] = useState(0.0);
  const [timedMode, setTimedMode] = useState(true);
  const [immediateFeedback, setImmediateFeedback] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onStartExam({
      topic: isCustomMode ? "custom" : selectedTopic,
      customTopic: isCustomMode ? customTopic : "",
      targetQuestions,
      initialDifficulty,
      timedMode,
      immediateFeedback
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4 animate-fade-in">
          <Zap className="w-3.5 h-3.5" />
          <span>Real-time Psychometric Adaptation</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          SkillForge <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">AI Exam Engine</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Powered by Item Response Theory (IRT 2PL) and Google Gemini. Every question dynamically scales in real time based on your cognitive ability ($\theta$), eliminating boring easy questions and frustating impossible barriers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Step 1: Select Topic */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>Choose Assessment Domain</span>
            </label>
            <button
              type="button"
              onClick={() => setIsCustomMode(!isCustomMode)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isCustomMode ? "Choose from standard presets" : "Or define custom topic"}</span>
            </button>
          </div>

          {!isCustomMode ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {TOPIC_CARDS.map((card) => {
                const Icon = card.icon;
                const isSelected = selectedTopic === card.id;
                return (
                  <div
                    key={card.id}
                    onClick={() => setSelectedTopic(card.id)}
                    className={`relative p-4 rounded-2xl border cursor-pointer transition-all duration-200 text-left ${
                      isSelected
                        ? 'bg-slate-900/90 border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl border ${card.color} shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-white tracking-tight">
                          {card.name}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-indigo-500/30 space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Enter Custom Engineering or Technical Topic
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required={isCustomMode}
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g. Distributed Transactions, Kubernetes Operators, Rust Concurrency..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Gemini AI will synthesize dynamic psychometric questions calibrated specifically to this topic.
              </p>
            </div>
          )}
        </div>

        {/* Step 2: Assessment Parameters */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-6">
          <label className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">2</span>
            <span>Configure Adaptive Parameters</span>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Questions count */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">Exam Length</span>
                <span className="text-indigo-400 font-mono font-bold">{targetQuestions} Questions</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[5, 8, 10, 15].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setTargetQuestions(cnt)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      targetQuestions === cnt
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {cnt} Qs
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                IRT algorithms achieve high convergence reliability in as few as 6 to 10 questions.
              </p>
            </div>

            {/* Initial Baseline Difficulty */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">Starting Difficulty Baseline</span>
                <span className="text-purple-400 font-mono font-bold">
                  {initialDifficulty === -1.2 ? "Foundational" : initialDifficulty === 1.2 ? "Senior" : "Dynamic Neutral"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Junior", value: -1.2 },
                  { label: "Neutral", value: 0.0 },
                  { label: "Senior", value: 1.2 }
                ].map((tier) => (
                  <button
                    key={tier.label}
                    type="button"
                    onClick={() => setInitialDifficulty(tier.value)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      initialDifficulty === tier.value
                        ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-600/20'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                The engine quickly adapts up or down regardless of the chosen baseline.
              </p>
            </div>

          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={immediateFeedback}
                onChange={(e) => setImmediateFeedback(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500"
              />
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-200">Instant Explanations</div>
                <div className="text-[11px] text-slate-400">Show deep architectural breakdown after each question</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={timedMode}
                onChange={(e) => setTimedMode(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500"
              />
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-200">Timed Mode</div>
                <div className="text-[11px] text-slate-400">60-second response timer per question to simulate interview pressure</div>
              </div>
            </label>
          </div>

        </div>

        {/* Launch Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Calibrating Psychometric Item Pool...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Launch Adaptive Assessment</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
