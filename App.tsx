import React, { useState, useEffect, useCallback } from 'react';
import { DrishyaMitraAgents } from './services/agentService';
import { Photo, AppState, AgentLog, MemoryAlbum } from './types';
import Sidebar from './components/Sidebar';
import Gallery from './components/Gallery';
import AgentHub from './components/AgentHub';
import StatsOverview from './components/StatsOverview';
import SearchBar from './components/SearchBar';

const MAX_STORAGE_BYTES = 100 * 1024 * 1024; // 100MB for demo purposes

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    photos: [],
    albums: [],
    logs: [],
    isOrchestrating: false,
    searchQuery: ''
  });
  const [activeTab, setActiveTab] = useState<'all' | 'memories' | 'privacy' | 'emotion'>('all');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [insights, setInsights] = useState<string[]>([]);
  const [filteredPhotoIds, setFilteredPhotoIds] = useState<string[] | null>(null);
  const [potentialSavings, setPotentialSavings] = useState<number>(0);

  // Vault Security
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [vaultModalOpen, setVaultModalOpen] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');

  const totalUsedSize = state.photos.reduce((acc, p) => acc + p.size, 0);

  const addLog = (agentName: string, message: string, type: 'info' | 'alert' | 'success' = 'info') => {
    const newLog: AgentLog = {
      id: Math.random().toString(36).substr(2, 9),
      agentName,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setState(prev => ({ ...prev, logs: [newLog, ...prev.logs].slice(0, 50) }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const filesArray = Array.from(files) as File[];

    const newPhotos: Photo[] = filesArray.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending'
    }));

    setState(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
    addLog('Orchestrator', `Detected ${newPhotos.length} items. Initializing security protocols.`, 'info');

    newPhotos.forEach((photo, index) => {
      setTimeout(() => processPhoto(photo, filesArray[index]), index * 300);
    });
  };

  const processPhoto = async (photo: Photo, file: File) => {
    setState(prev => ({
      ...prev,
      photos: prev.photos.map(p => p.id === photo.id ? { ...p, status: 'analyzing' } : p)
    }));

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        
        try {
          const metadata = await DrishyaMitraAgents.analyzePhoto(photo.url, base64);
          
          setState(prev => ({
            ...prev,
            photos: prev.photos.map(p => p.id === photo.id ? { ...p, status: 'completed', metadata } : p)
          }));

          if (metadata.isSensitive) {
            addLog('Privacy Guardian', `AUTO-SECURE: Document detected in ${photo.name}.`, 'alert');
          } else {
            addLog('Vision Agent', `Indexed ${photo.name}: ${metadata.scene}`, 'success');
          }
        } catch (error: any) {
          const isRateLimit = error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED');
          if (isRateLimit) {
            addLog('Orchestrator', `Quota reached while processing ${photo.name}. Agent is retrying.`, 'alert');
          } else {
            addLog('Orchestrator', `Processing failed for ${photo.name}.`, 'alert');
          }
          setState(prev => ({
            ...prev,
            photos: prev.photos.map(p => p.id === photo.id ? { ...p, status: 'error' } : p)
          }));
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      addLog('Orchestrator', `File read error for ${photo.name}.`, 'alert');
      setState(prev => ({
        ...prev,
        photos: prev.photos.map(p => p.id === photo.id ? { ...p, status: 'error' } : p)
      }));
    }
  };

  const toggleSecureStatus = (photoId: string) => {
    setState(prev => ({
      ...prev,
      photos: prev.photos.map(p => {
        if (p.id === photoId && p.metadata) {
          const newStatus = !p.metadata.isSensitive;
          addLog('Privacy Guardian', `${newStatus ? 'Secured' : 'Released'} ${p.name} manually.`, newStatus ? 'alert' : 'success');
          return { 
            ...p, 
            metadata: { 
              ...p.metadata, 
              isSensitive: newStatus, 
              riskClassification: newStatus ? 'User Defined' : p.metadata.riskClassification 
            } 
          };
        }
        return p;
      })
    }));
  };

  const triggerFullOrchestration = useCallback(async () => {
    const readyPhotos = state.photos.filter(p => p.status === 'completed');
    if (readyPhotos.length === 0 || state.isOrchestrating) return;
    
    setState(prev => ({ ...prev, isOrchestrating: true }));
    addLog('Planner', 'Contextual re-mapping in progress...', 'info');

    try {
      const clusterResult = await DrishyaMitraAgents.clusterMemories(readyPhotos);
      const newAlbums: MemoryAlbum[] = (clusterResult.albums || []).map((a: any) => ({
        ...a,
        id: Math.random().toString(36).substr(2, 9),
        coverPhotoUrl: state.photos.find(p => p.id === a.photoIds[0])?.url || ''
      }));

      const plannerSuggestions = await DrishyaMitraAgents.planOptimization(readyPhotos);
      const avgSize = readyPhotos.length > 0 ? totalUsedSize / readyPhotos.length : 0;
      setPotentialSavings(plannerSuggestions.length * avgSize * 0.85);

      setState(prev => ({ ...prev, albums: newAlbums, isOrchestrating: false }));
      setInsights(plannerSuggestions);
      addLog('Memory Agent', `Refined ${newAlbums.length} clusters.`, 'success');
    } catch (err: any) {
      console.error(err);
      const isRateLimit = err?.message?.includes('429') || err?.message?.includes('RESOURCE_EXHAUSTED');
      if (isRateLimit) {
        addLog('Orchestrator', 'Memory Agent throttled. Optimization delayed.', 'alert');
      }
      setState(prev => ({ ...prev, isOrchestrating: false }));
    }
  }, [state.photos, state.isOrchestrating, totalUsedSize]);

  useEffect(() => {
    const completedCount = state.photos.filter(p => p.status === 'completed').length;
    if (completedCount > 0 && completedCount === state.photos.length && state.albums.length === 0) {
      triggerFullOrchestration();
    }
  }, [state.photos, state.albums.length, triggerFullOrchestration]);

  const handleSearch = async (query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
    if (!query.trim()) {
      setFilteredPhotoIds(null);
      return;
    }

    addLog('NLI Agent', `Analyzing categorical intent: "${query}"`, 'info');
    try {
      const ids = await DrishyaMitraAgents.semanticSearch(query, state.photos);
      setFilteredPhotoIds(ids);
      addLog('NLI Agent', `Matched ${ids.length} results across categories.`, 'success');
    } catch (err: any) {
      console.error(err);
      const isRateLimit = err?.message?.includes('429') || err?.message?.includes('RESOURCE_EXHAUSTED');
      if (isRateLimit) {
        addLog('NLI Agent', 'Search service throttled. Try again in a moment.', 'alert');
      }
    }
  };

  const handleTabChange = (tab: any) => {
    if (tab === 'privacy' && !isVaultUnlocked) {
      setVaultModalOpen(true);
      return;
    }
    setActiveTab(tab);
    if (activeTab === 'privacy' && tab !== 'privacy') {
      setIsVaultUnlocked(false);
    }
  };

  const handleVaultUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput === '1234') {
      setIsVaultUnlocked(true);
      setVaultModalOpen(false);
      setActiveTab('privacy');
      setPasscodeInput('');
      addLog('Privacy Guardian', 'Vault access granted.', 'success');
    } else {
      addLog('Privacy Guardian', 'Invalid passcode attempt.', 'alert');
      setPasscodeInput('');
    }
  };

  const visiblePhotos = (() => {
    const baseSet = filteredPhotoIds 
      ? state.photos.filter(p => filteredPhotoIds.includes(p.id))
      : state.photos;

    if (activeTab === 'privacy') {
      return baseSet.filter(p => p.metadata?.isSensitive);
    } else if (activeTab === 'all') {
      return baseSet.filter(p => !p.metadata?.isSensitive);
    } else if (activeTab === 'emotion') {
      return baseSet.filter(p => p.metadata?.sentiment === 'positive' && !p.metadata?.isSensitive);
    } else {
      return baseSet.filter(p => !p.metadata?.isSensitive);
    }
  })();

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-500">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
          usedBytes={totalUsedSize} 
          maxBytes={MAX_STORAGE_BYTES}
          theme={theme}
          onThemeToggle={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
        />
        
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 border-b dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-6 shrink-0 z-10">
            <SearchBar onSearch={handleSearch} />
            
            <div className="flex items-center gap-4">
              <label className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl cursor-pointer transition-all flex items-center gap-2 font-medium shadow-sm text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                Upload
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </header>

          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex flex-col p-6 overflow-y-auto custom-scrollbar">
              <StatsOverview 
                photos={state.photos} 
                albums={state.albums} 
                insights={insights} 
                potentialSavings={potentialSavings}
              />
              
              <div className="mt-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="heading-font text-2xl font-bold text-slate-800 dark:text-slate-100">
                      {activeTab === 'all' && (filteredPhotoIds ? `Search: "${state.searchQuery}"` : 'Your Collection')}
                      {activeTab === 'memories' && 'Memory Capsules'}
                      {activeTab === 'privacy' && 'Secure Vault'}
                      {activeTab === 'emotion' && 'Positive Highlights'}
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">{visiblePhotos.length} items in this view</p>
                  </div>
                </div>
                
                <Gallery 
                  photos={visiblePhotos} 
                  albums={state.albums} 
                  viewMode={activeTab === 'memories' ? 'albums' : 'photos'} 
                  onToggleSecure={toggleSecureStatus}
                />
              </div>
            </div>

            <AgentHub logs={state.logs} isThinking={state.isOrchestrating} />
          </div>
        </main>

        {/* Vault Passcode Modal */}
        {vaultModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-xl p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-white/20 dark:border-slate-800">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
                <h3 className="text-xl font-bold heading-font text-slate-800 dark:text-slate-100">Enter Vault Passcode</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Hint: Try '1234' for MVP demo</p>
              </div>
              
              <form onSubmit={handleVaultUnlock} className="space-y-4">
                <input 
                  type="password" 
                  maxLength={4}
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  autoFocus
                  className="w-full text-center text-3xl font-bold tracking-[1em] py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-indigo-500 focus:ring-0 transition-all dark:text-white"
                  placeholder="****"
                />
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setVaultModalOpen(false)}
                    className="flex-1 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg"
                  >
                    Unlock
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;