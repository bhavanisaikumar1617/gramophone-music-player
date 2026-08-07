import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import Equalizer from './Equalizer';
import { getTrackArtwork } from '../../utils/imageService';

const MiniPlayer = ({ song, isPlaying, onPlay, onPause, onPrevious, onNext }) => {
  const artwork = song && getTrackArtwork({ ...song, seed: song.id, albumArt: song.albumArt });
  const expand = () => document.getElementById('full-music-player')?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  return <AnimatePresence>
    {song && <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 mx-auto px-1"
    >
      <motion.div layoutId="mini-player" onClick={expand} className="group relative cursor-pointer overflow-hidden rounded-card border border-white/[0.1] bg-gramophone-bg/85 px-3 py-2.5 shadow-card backdrop-blur-2xl">
        <motion.span className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-gramophone-accent-secondary to-gramophone-accent" initial={{ width: '12%' }} animate={{ width: ['12%', '76%', '42%', '94%'] }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }} />
        <div className="flex items-center gap-3">
          <img src={artwork} alt="" className="h-11 w-11 rounded-xl object-cover shadow-card" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder-album.png'; }} />
          <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><Equalizer isPlaying={isPlaying} bars={4} /><p className="truncate text-sm font-semibold text-white">{song.title}</p></div><p className="truncate text-xs text-gramophone-text-secondary">{song.artist}</p></div>
          <div className="flex items-center gap-1" onClick={(event) => event.stopPropagation()}>
            <MiniButton label="Previous" onClick={onPrevious}><SkipBack className="h-4 w-4 fill-current" /></MiniButton>
            <MiniButton label={isPlaying ? 'Pause' : 'Play'} onClick={isPlaying ? onPause : onPlay} prominent>{isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}</MiniButton>
            <MiniButton label="Next" onClick={onNext}><SkipForward className="h-4 w-4 fill-current" /></MiniButton>
          </div>
        </div>
      </motion.div>
    </motion.div>}
  </AnimatePresence>;
};

const MiniButton = ({ children, label, onClick, prominent = false }) => <button type="button" aria-label={label} onClick={onClick} className={`flex h-9 w-9 items-center justify-center rounded-full transition hover:scale-105 ${prominent ? 'bg-gramophone-accent text-white shadow-glow-sm' : 'text-gramophone-text-secondary hover:bg-white/[0.08] hover:text-white'}`}>{children}</button>;

export default MiniPlayer;
