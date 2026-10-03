import React from 'react';
import { Cpu, Key, History, Sparkles, RefreshCw } from 'lucide-react';

export function Navbar({ systemStatus, hasCustomApiKey, onOpenApiKeyModal, onOpenHistoryModal, onResetExam, isExamActive }) {
  const isAiActive = systemStatus?.hasServerApiKey || hasCustomApiKey;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div 
          onClick={onResetExam}
          className="flex items-center gap-3 cursor-pointer group"
          title="SkillForge Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                SkillForge<span className="text-indigo-400 font-extrabold">.ai</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                IRT Adaptive
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono hidden sm:block">
              Psychometric 2PL Engine
            </p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI engine badge */}
          <div 
            onClick={onOpenApiKeyModal}
            className={`hidden md:flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border cursor-pointer transition-all duration-200 ${
              isAiActive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20'
            }`}
            title="Click to configure Gemini API Key"
          >
            <span className={`w-2 h-2 rounded-full animate-pulse ${isAiActive ? 'bg-emerald-400' : 'bg-indigo-400'}`} />
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAiActive ? 'Gemini 1.5 Flash Active' : 'Adaptive Fallback Bank'}</span>
          </div>

          {/* History Button */}
          <button
            onClick={onOpenHistoryModal}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="View Past Exam History"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">History</span>
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border transition-colors ${
              hasCustomApiKey 
                ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/50'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
            title="Configure Gemini API Key"
          >
            <Key className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">API Key</span>
          </button>

          {/* Reset / New Exam Button if in progress */}
          {isExamActive && (
            <button
              onClick={onResetExam}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300 hover:bg-rose-900/60 transition-colors"
              title="Quit Exam & Return Home"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Quit</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
