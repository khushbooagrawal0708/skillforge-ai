import React, { useState } from 'react';
import { X, Key, CheckCircle2, AlertCircle, Loader2, Sparkles, ExternalLink } from 'lucide-react';
import { api } from '../services/api';

export function ApiKeyModal({ isOpen, onClose, apiKey, onSaveApiKey }) {
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [testing, setTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    if (!inputKey.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter an API key to verify.' });
      return;
    }
    setTesting(true);
    setStatusMessage(null);
    try {
      const res = await api.verifyApiKey(inputKey.trim());
      if (res.valid) {
        setStatusMessage({ type: 'success', text: 'Gemini API Key is valid and active!' });
      } else {
        setStatusMessage({ type: 'error', text: res.message || 'API key verification failed.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Verification request failed.' });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    onSaveApiKey(inputKey.trim());
    onClose();
  };

  const handleClear = () => {
    setInputKey('');
    onSaveApiKey('');
    setStatusMessage({ type: 'info', text: 'API key cleared. System will use smart offline fallback.' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Google Gemini API Settings</h3>
              <p className="text-xs text-slate-400">Enable real-time dynamic question generation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-mono"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Smart Hybrid Adaptive Architecture</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              If left empty, SkillForge uses its calibrated psychometric item bank and synthetic procedural generator. When configured, Gemini dynamically generates novel questions targeting exact IRT difficulty and Bloom levels.
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
            >
              <span>Get a free Gemini API key at Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2.5 border ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/50'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-950/50 text-rose-300 border-rose-800/50'
                  : 'bg-indigo-950/50 text-indigo-300 border-indigo-800/50'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
            >
              Clear Key
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTest}
                disabled={testing || !inputKey.trim()}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-50 transition-colors flex items-center gap-1.5"
              >
                {testing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Test Key</span>
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
