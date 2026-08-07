import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, Heart, Play, Trash2 } from 'lucide-react';
import Equalizer from './Equalizer';
import { getTrackArtwork } from '../../utils/imageService';

const QueuePanel = ({ songs = [], currentSong, favouriteIds, onPlay, onToggleFavourite, onRemove, onReorder }) => {
  const activeRef = useRef(null);
  const draggingId = useRef(null);
  const [dragOverId, setDragOverId] = useState(null);

  useEffect(() => {
    // Smoothly scroll the currently playing song into view and centre it when possible
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [currentSong?.id]);

  const moveSong = (targetId) => {
    const sourceId = draggingId.current;
    if (!sourceId || sourceId === targetId) return;
    const next = [...songs];
    const sourceIndex = next.findIndex((song) => song.id === sourceId);
    const targetIndex = next.findIndex((song) => song.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const [moved] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, moved);
    draggingId.current = null;
    setDragOverId(null);
    onReorder(next);
  };

  // Keep the queue visually capped so it never forces the page height to grow.
  return <section id="player-queue" className="glass-panel flex max-h-[620px] flex-col p-5 sm:p-6 lg:p-7">
    <div className="flex items-center justify-between gap-4"><div><p className="section-eyebrow">Queue</p><h3 className="mt-1 text-card-title text-gramophone-text">Up next</h3></div><span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-gramophone-text-secondary">{songs.length} tracks</span></div>
    {songs.length ? <div className="mt-5 flex flex-col gap-2 overflow-y-auto pr-1 scroll-smooth">
      {songs.map((song, index) => {
        const isActive = currentSong?.id === song.id;
        const artwork = getTrackArtwork({ ...song, seed: song.id, albumArt: song.albumArt });
        return <motion.div
          key={song.id}
          layout
          ref={isActive ? activeRef : null}
          draggable
          onDragStart={(e) => { draggingId.current = song.id; e.dataTransfer?.setData('text/plain', song.id); }}
          onDragOver={(event) => { event.preventDefault(); setDragOverId(song.id); }}
          onDragLeave={() => setDragOverId(null)}
          onDrop={() => moveSong(song.id)}
          onDragEnd={() => { draggingId.current = null; setDragOverId(null); }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          whileDrag={{ scale: 1.01 }}
          className={`group flex items-center gap-3 rounded-card border p-2.5 transition-all ${isActive ? 'border-gramophone-accent/40 bg-gramophone-accent/10 shadow-glow-sm' : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.05]'} ${dragOverId === song.id ? 'ring-2 ring-gramophone-accent/20 bg-white/[0.03]' : ''}`}
        >
          <button type="button" aria-label={`Reorder ${song.title}`} className="cursor-grab touch-none text-gramophone-muted active:cursor-grabbing"><GripVertical className="h-4 w-4" /></button>
          <button type="button" onClick={() => onPlay(song)} className="relative shrink-0 overflow-hidden rounded-card w-12 h-12">
            <img src={artwork} alt="" className="h-12 w-12 object-cover rounded-card shadow-card" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder-album.png'; }} />
            {isActive && <span className="absolute inset-0 flex items-center justify-center bg-black/28"><Equalizer isPlaying bars={3} /></span>}
            {!isActive && <span className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity duration-200 group-hover:opacity-100"><Play className="h-4 w-4 fill-white text-white" /></span>}
          </button>
          <button type="button" onClick={() => onPlay(song)} className="min-w-0 flex-1 text-left">
            <div className="flex items-center gap-2">
              <p className={`truncate text-sm font-semibold ${isActive ? 'text-gramophone-accent' : 'text-gramophone-text'}`}>{song.title}</p>
              {isActive && <span className="hidden text-[0.6rem] font-bold uppercase tracking-widest text-gramophone-accent sm:inline">Playing</span>}
            </div>
            <p className="mt-0.5 truncate text-xs text-gramophone-text-secondary">{song.artist}</p>
          </button>
          <span className="text-xs tabular-nums text-gramophone-muted">{song.duration || '—'}</span>
          <button type="button" onClick={() => onToggleFavourite(song)} aria-label={`Favourite ${song.title}`} className={`rounded-full p-1.5 transition ${favouriteIds.has(song.id) ? 'text-gramophone-accent' : 'text-gramophone-muted hover:text-white'}`}><Heart className={`h-4 w-4 ${favouriteIds.has(song.id) ? 'fill-current' : ''}`} /></button>
          <button type="button" onClick={() => onRemove(song.id)} aria-label={`Remove ${song.title}`} className="rounded-full p-1.5 text-rose-300 transition hover:bg-red-400/10 hover:text-red-300"><Trash2 className="h-4 w-4" /></button>
        </motion.div>;
      })}
    </div> : <div className="mt-5 items-center justify-center rounded-2xl border border-dashed border-white/[0.1] p-8 text-center text-sm text-gramophone-text-secondary">Your queue is clear. Pick a song to keep the session going.</div>}
  </section>;
};

export default QueuePanel;
