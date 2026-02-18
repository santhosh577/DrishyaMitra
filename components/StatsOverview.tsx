
import React from 'react';
import { Photo, MemoryAlbum } from '../types';

interface StatsOverviewProps {
  photos: Photo[];
  albums: MemoryAlbum[];
  insights: string[];
  potentialSavings: number;
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const StatsOverview: React.FC<StatsOverviewProps> = ({ photos, albums, insights, potentialSavings }) => {
  const sensitiveCount = photos.filter(p => p.metadata?.isSensitive).length;
  const analyzedCount = photos.filter(p => p.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Total Photos</p>
              <h3 className="text-2xl font-bold heading-font text-slate-800 dark:text-slate-100">{photos.length}</h3>
            </div>
          </div>
          <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${(analyzedCount/Math.max(photos.length, 1)) * 100}%` }}></div>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 font-medium">{analyzedCount} Analyzed by AI</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Sensitive Docs</p>
              <h3 className="text-2xl font-bold heading-font text-rose-600 dark:text-rose-400">{sensitiveCount}</h3>
            </div>
          </div>
          <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
            <div className="h-full bg-rose-500 rounded-full transition-all duration-1000" style={{ width: `${(sensitiveCount/Math.max(photos.length, 1)) * 100}%` }}></div>
          </div>
          <p className="mt-2 text-[10px] text-rose-500 font-bold uppercase tracking-tighter">Proactive Protection Enabled</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z"/></svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Memory Capsules</p>
              <h3 className="text-2xl font-bold heading-font text-emerald-700 dark:text-emerald-500">{albums.length}</h3>
            </div>
          </div>
          <div className="flex -space-x-2">
            {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700"></div>)}
            <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-[10px] font-bold text-emerald-600 dark:text-emerald-300">+</div>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 font-medium">Clustered by Memory Agent</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Potential Savings</p>
              <h3 className="text-2xl font-bold heading-font text-amber-700 dark:text-amber-500">{formatBytes(potentialSavings)}</h3>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">
            {insights.length > 0 
              ? `Planner found ${insights.length} duplicate patterns.` 
              : 'Collection optimized by Planner.'}
          </p>
        </div>
      </div>

      {insights.length > 0 && (
        <div className="bg-indigo-600 rounded-3xl p-6 text-white flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-indigo-100 dark:shadow-none transition-colors">
          <div className="shrink-0 flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
            </div>
            <div>
              <h4 className="text-lg font-bold heading-font">Planner Insights</h4>
              <p className="text-indigo-100 text-sm">Autonomous storage and clutter detection results.</p>
            </div>
          </div>
          <div className="flex-1 flex flex-wrap gap-2">
            {insights.map((insight, idx) => (
              <button key={idx} className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-xs font-medium transition-all border border-white/10 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full"></span>
                {insight}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsOverview;
