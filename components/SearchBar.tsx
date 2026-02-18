
import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const quickCategories = [
    { label: 'Documents', query: 'show sensitive documents and ids' },
    { label: 'Happiness', query: 'find happy and joyful moments' },
    { label: 'People', query: 'photos with faces and people' },
    { label: 'Nature', query: 'find outdoor and landscape photos' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleChipClick = (q: string) => {
    setQuery(q);
    onSearch(q);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl gap-2 transition-all">
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch(query)}
          className="block w-full pl-11 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium placeholder:text-slate-400 dark:text-slate-100 shadow-inner"
          placeholder="Semantic Search: 'Show my happy moments'..."
        />
        <div className="absolute inset-y-0 right-3 flex items-center">
          <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 uppercase tracking-tighter">
            NLI v3.0
          </span>
        </div>
      </form>
      
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {quickCategories.map((cat) => (
          <button
            key={cat.label}
            onClick={() => handleChipClick(cat.query)}
            className="shrink-0 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm"
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
