
import React from 'react';
import { AgentLog } from '../types';

interface AgentHubProps {
  logs: AgentLog[];
  isThinking: boolean;
}

const AgentHub: React.FC<AgentHubProps> = ({ logs, isThinking }) => {
  return (
    <div className="w-80 bg-white dark:bg-slate-900 border-l dark:border-slate-800 flex flex-col shrink-0 overflow-hidden transition-colors">
      <div className="p-6 border-b dark:border-slate-800 flex items-center justify-between">
        <h3 className="font-bold heading-font text-slate-800 dark:text-slate-100">Agent Activity</h3>
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse delay-75"></span>
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse delay-150"></span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {isThinking && (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 animate-pulse">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-6 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-800 flex items-center justify-center">
                 <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              </div>
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">Memory Agent</span>
            </div>
            <p className="text-xs text-indigo-600 dark:text-indigo-300">Generating memory clusters and detecting semantic patterns...</p>
          </div>
        )}

        {logs.map((log) => (
          <div 
            key={log.id} 
            className={`p-4 rounded-2xl border transition-all ${
              log.type === 'alert' ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/50' : 
              log.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50' : 
              'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  log.type === 'alert' ? 'text-rose-600 dark:text-rose-400' : 
                  log.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 
                  'text-slate-500 dark:text-slate-400'
                }`}>
                  {log.agentName}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">{log.timestamp}</span>
            </div>
            <p className={`text-xs font-medium leading-relaxed ${
              log.type === 'alert' ? 'text-rose-700 dark:text-rose-300' : 
              log.type === 'success' ? 'text-emerald-700 dark:text-emerald-300' : 
              'text-slate-600 dark:text-slate-300'
            }`}>
              {log.message}
            </p>
          </div>
        ))}
        
        {logs.length === 0 && !isThinking && (
          <div className="py-20 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500 italic">No agent activities logged yet.</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t dark:border-slate-800">
        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">System Health</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Vision v2.5</span>
          </div>
          <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Privacy v3.1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentHub;
