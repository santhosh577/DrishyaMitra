import React from 'react';

interface SidebarProps {
  activeTab: 'all' | 'memories' | 'privacy' | 'emotion';
  onTabChange: (tab: any) => void;
  usedBytes: number;
  maxBytes: number;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, usedBytes, maxBytes, theme, onThemeToggle }) => {
  const items = [
    { id: 'all', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', label: 'Gallery' },
    { id: 'memories', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', label: 'Memories' },
    { id: 'privacy', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', label: 'Privacy Vault' },
    { id: 'emotion', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Emotion Map' },
  ];

  const usagePercent = Math.min((usedBytes / maxBytes) * 100, 100);

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r dark:border-slate-800 flex flex-col shrink-0 overflow-y-auto transition-colors duration-300">
      <div className="p-6">
        <div className="flex items-center gap-3 text-indigo-600 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <span className="text-xl font-bold heading-font tracking-tight text-slate-800 dark:text-slate-100">DrishyaMitra</span>
        </div>

        <nav className="space-y-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                activeTab === item.id 
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        {/* Theme Toggle */}
        <button 
          onClick={onThemeToggle}
          className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 group transition-all"
        >
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 uppercase tracking-wider">
            {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
          </span>
          <div className="p-1.5 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
            {theme === 'light' ? (
              <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
            ) : (
              <svg className="w-4 h-4 text-indigo-300" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
            )}
          </div>
        </button>

        <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-4 text-white">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Real-time Storage</p>
          <div className="h-2 bg-slate-700 dark:bg-slate-600 rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-indigo-400 rounded-full transition-all duration-500" 
              style={{ width: `${usagePercent}%` }}
            ></div>
          </div>
          <p className="text-xs font-medium">
            <span className="text-indigo-300">{formatBytes(usedBytes)}</span> / {formatBytes(maxBytes)}
          </p>
          <p className="text-[9px] text-slate-500 mt-1 uppercase font-bold tracking-widest">
            {usagePercent.toFixed(1)}% Full
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;