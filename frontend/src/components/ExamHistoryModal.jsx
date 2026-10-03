import React, { useEffect, useState } from 'react';
import { X, History, Award, Calendar, ChevronRight, Loader2, BarChart2 } from 'lucide-react';
import { api } from '../services/api';

export function ExamHistoryModal({ isOpen, onClose, onViewPastResult }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.getHistory()
        .then(res => setHistory(res.history || []))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 relative max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Assessment History</h3>
              <p className="text-xs text-slate-400">Review your past adaptive calibration sessions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="mt-4 overflow-y-auto space-y-3 pr-1 flex-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
              <span className="text-xs">Loading history records...</span>
            </div>
          ) : history.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <BarChart2 className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-medium text-slate-300">No exam attempts recorded yet</p>
              <p className="text-xs text-slate-500 mt-1">Complete your first adaptive session to build your skill history.</p>
            </div>
          ) : (
            history.map((item, idx) => (
              <div
                key={item.sessionId || idx}
                onClick={() => {
                  if (item.sessionId) {
                    onViewPastResult(item.sessionId);
                    onClose();
                  }
                }}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-950 transition-all cursor-pointer group flex items-center justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {item.topic}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {item.masteryLevel || 'Calibrated'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.completedAt ? new Date(item.completedAt).toLocaleDateString() : 'Recent'}</span>
                    </div>
                    <div>
                      <span>Score: </span>
                      <span className="text-emerald-400 font-semibold">{item.scaledScore || 500}</span>
                      <span className="text-slate-500"> / 1000</span>
                    </div>
                    <div>
                      <span>Accuracy: </span>
                      <span className="text-indigo-400 font-semibold">{item.accuracy}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-mono text-purple-400">
                      θ = {item.finalTheta !== undefined ? item.finalTheta : '0.00'}
                    </span>
                    <p className="text-[10px] text-slate-500">{item.percentile}th percentile</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
