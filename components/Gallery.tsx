import React, { useState } from 'react';
import { Photo, MemoryAlbum } from '../types';

interface GalleryProps {
  photos: Photo[];
  albums: MemoryAlbum[];
  viewMode: 'photos' | 'albums';
  onToggleSecure?: (id: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ photos, albums, viewMode, onToggleSecure }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const handleSecureAction = (id: string) => {
    if (onToggleSecure) {
      onToggleSecure(id);
      setSelectedPhoto(null);
    }
  };

  if (viewMode === 'albums') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map((album) => (
          <div key={album.id} className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border border-slate-100 dark:border-slate-800">
            <div className="aspect-[4/3] overflow-hidden relative">
              <img 
                src={album.coverPhotoUrl} 
                alt={album.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[9px] uppercase font-black tracking-[0.2em] bg-indigo-500 px-2 py-1 rounded mb-2 inline-block shadow-lg">
                  {album.category}
                </span>
                <h3 className="text-xl font-bold heading-font leading-tight mb-1">{album.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed opacity-90">{album.description}</p>
              </div>
              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 flex items-center gap-1.5">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <span className="text-xs font-bold text-white">{album.photoIds.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
      {photos.map((photo) => (
        <div 
          key={photo.id} 
          onClick={() => setSelectedPhoto(photo)}
          className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-800 hover:ring-indigo-500 hover:shadow-lg transition-all ${
            photo.metadata?.isSensitive ? 'ring-2 ring-rose-500 shadow-rose-100 dark:shadow-rose-950' : ''
          }`}
        >
          <img 
            src={photo.url} 
            alt={photo.name}
            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${
              photo.metadata?.isSensitive ? 'blur-xl group-hover:blur-md scale-110' : ''
            }`}
          />
          
          {photo.status === 'analyzing' && (
            <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 border-2 border-indigo-200 dark:border-indigo-900 rounded-full"></div>
                <div className="absolute inset-0 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <span className="mt-3 text-[9px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">Scanning</span>
            </div>
          )}

          {photo.metadata?.isSensitive && (
            <div className="absolute inset-0 flex items-center justify-center bg-rose-900/20 group-hover:bg-transparent transition-colors">
              <div className="bg-rose-600 text-white p-2 rounded-full shadow-xl">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
            </div>
          )}

          <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <p className="text-[10px] text-white font-bold truncate tracking-tight">{photo.metadata?.scene || photo.name}</p>
          </div>
        </div>
      ))}

      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/95 dark:bg-black/95 backdrop-blur-lg" onClick={() => setSelectedPhoto(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden max-w-5xl w-full flex flex-col lg:flex-row shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="lg:w-2/3 bg-slate-100 dark:bg-slate-950 flex items-center justify-center relative min-h-[400px]">
              <img src={selectedPhoto.url} className="max-w-full max-h-[80vh] object-contain shadow-2xl" alt={selectedPhoto.name} />
              <button 
                onClick={() => setSelectedPhoto(null)} 
                className="absolute top-6 left-6 w-12 h-12 bg-white/20 dark:bg-slate-800/40 hover:bg-white/40 dark:hover:bg-slate-800/60 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all shadow-xl"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
              </button>
            </div>
            <div className="lg:w-1/3 p-10 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900 flex flex-col">
              <div className="mb-8 flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Intelligent Analysis</span>
                    <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                  </div>
                  <h3 className="text-2xl font-black heading-font text-slate-900 dark:text-slate-100 mb-2 truncate" title={selectedPhoto.name}>{selectedPhoto.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{selectedPhoto.metadata?.scene}</p>
                </div>
              </div>

              {selectedPhoto.metadata ? (
                <div className="space-y-6 flex-1">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100/50 dark:border-indigo-800/50">
                      <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-1">Emotion</p>
                      <p className="text-sm font-bold text-indigo-900 dark:text-indigo-300">{selectedPhoto.metadata.dominantEmotion}</p>
                    </div>
                    <div className={`p-4 rounded-2xl border ${selectedPhoto.metadata.isSensitive ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800/50' : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50'}`}>
                      <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${selectedPhoto.metadata.isSensitive ? 'text-rose-400' : 'text-emerald-400'}`}>Security</p>
                      <p className={`text-sm font-bold ${selectedPhoto.metadata.isSensitive ? 'text-rose-900 dark:text-rose-300' : 'text-emerald-900 dark:text-emerald-300'}`}>{selectedPhoto.metadata.isSensitive ? 'Secured' : 'Global'}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Key Entities</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPhoto.metadata.objects.map(tag => (
                        <span key={tag} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {selectedPhoto.metadata.text && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Extracted Content</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic line-clamp-4">"{selectedPhoto.metadata.text}"</p>
                    </div>
                  )}

                  <div className="pt-4 mt-auto space-y-3">
                    <button 
                      onClick={() => handleSecureAction(selectedPhoto.id)}
                      className={`w-full py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg ${
                        selectedPhoto.metadata.isSensitive 
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 shadow-slate-200 dark:shadow-none' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 dark:shadow-none'
                      }`}
                    >
                      {selectedPhoto.metadata.isSensitive ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg>
                          Move to Gallery
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                          Secure in Vault
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Agent reasoning in progress</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;