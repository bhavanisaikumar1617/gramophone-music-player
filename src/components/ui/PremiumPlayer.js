import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ListMusic, Music2, Pause, Play, Repeat2, Shuffle, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import Equalizer from './Equalizer';
import { getTrackArtwork } from '../../utils/imageService';

const formatTime = (seconds = 0) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const minutes = Math.floor(Math.max(0, seconds) / 60);
  const remainder = Math.floor(Math.max(0, seconds) % 60).toString().padStart(2, '0');
  return `${minutes}:${remainder}`;
};

const PremiumPlayer = ({ song, isPlaying, onPlay, onPause, onPrevious, onNext, onToggleFavourite, isFavourite, onQueue, currentTime, duration, volume, onSeek, onVolumeChange }) => {
  const [speed, setSpeed] = useState(1);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const artwork = song && getTrackArtwork({ ...song, seed: song.id, albumArt: song.albumArt });
  // handleEnded/seek/volume are managed by parent via props

  return (
    <motion.div layoutId="mini-player" className="relative overflow-hidden rounded-card border border-white/[0.1] bg-gradient-to-br from-white/[0.09] via-gramophone-card/90 to-gramophone-bg/90 p-4 shadow-float backdrop-blur-2xl sm:p-5">
    {/* Audio is managed by parent MusicPlayer; controls below use callbacks passed as props */}
    <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-gramophone-accent/20 blur-3xl" />
    <div className="relative grid items-center gap-5 lg:grid-cols-[minmax(210px,0.85fr)_minmax(330px,1.55fr)_minmax(190px,0.8fr)]">
      <div className="flex min-w-0 items-center gap-4">
        {artwork ? (
          <img src={artwork} alt={`${song?.title} artwork`} className="h-20 w-20 rounded-card object-cover shadow-card sm:h-24 sm:w-24" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder-album.png'; }} />
        ) : <div className="flex h-20 w-20 items-center justify-center rounded-card bg-white/[0.06]"><Music2 /></div>}
        <div className="min-w-0"><div className="flex items-center gap-2"><Equalizer isPlaying={isPlaying} bars={4} /><p className="truncate text-base font-semibold text-white">{song?.title || 'Choose a track'}</p></div><p className="mt-1 truncate text-sm text-gramophone-text-secondary">{song?.artist || 'Your private listening suite'}</p><button type="button" onClick={onToggleFavourite} className={`mt-3 inline-flex items-center gap-1.5 text-xs font-medium transition ${isFavourite ? 'text-gramophone-accent' : 'text-gramophone-text-secondary hover:text-white'}`}><Heart className={`h-3.5 w-3.5 ${isFavourite ? 'fill-current' : ''}`} />{isFavourite ? 'Saved to favourites' : 'Add to favourites'}</button></div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-3 sm:gap-5">
          <IconButton label="Shuffle" active={shuffle} onClick={() => setShuffle((value) => !value)}><Shuffle className="h-4 w-4" /></IconButton>
          <IconButton label="Previous" onClick={onPrevious}><SkipBack className="h-5 w-5 fill-current" /></IconButton>
          <motion.button
            type="button"
            onClick={isPlaying ? onPause : onPlay}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gramophone-accent-secondary to-gramophone-accent text-white shadow-glow transition duration-200"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            whileTap={{ scale: 0.95 }}
            animate={isPlaying ? { scale: [1, 1.06, 1], boxShadow: ['0 12px 30px rgba(124,92,252,0.18)', '0 18px 48px rgba(169,112,255,0.24)', '0 12px 30px rgba(124,92,252,0.18)'] } : { scale: 1 }}
            transition={isPlaying ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
          >
            {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="ml-1 h-6 w-6 fill-current" />}
          </motion.button>
          <IconButton label="Next" onClick={() => onNext()}><SkipForward className="h-5 w-5 fill-current" /></IconButton>
          <IconButton label="Repeat" active={repeat} onClick={() => setRepeat((value) => !value)}><Repeat2 className="h-4 w-4" /></IconButton>
        </div>
        <div className="group flex items-center gap-3"><span className="w-9 text-right text-xs tabular-nums text-gramophone-muted">{formatTime(currentTime)}</span><input aria-label="Seek through song" type="range" min="0" max={duration || 0} step="0.1" value={Math.min(currentTime, duration || 0)} onChange={(event) => onSeek(Number(event.target.value))} className="premium-range h-1.5 flex-1 cursor-pointer rounded-full" style={{ '--range-progress': `${duration ? (currentTime / duration) * 100 : 0}%` }} /><span className="w-9 text-xs tabular-nums text-gramophone-muted">-{formatTime(Math.max(0, duration - currentTime))}</span></div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-end">
        <IconButton label="Lyrics" onClick={() => setShowLyrics((value) => !value)} active={showLyrics}><span className="text-xs font-bold">LYR</span></IconButton>
        <IconButton label="Open queue" onClick={onQueue}><ListMusic className="h-4 w-4" /></IconButton>
        <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-black/10 px-3 py-2"><Volume2 className="h-4 w-4 text-gramophone-text-secondary" /><input aria-label="Volume" type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => onVolumeChange(Number(event.target.value))} className="premium-range w-20" style={{ '--range-progress': `${volume * 100}%` }} /></div>
        <select value={speed} onChange={(event) => setSpeed(Number(event.target.value))} aria-label="Playback speed" className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-xs font-semibold text-gramophone-text-secondary"><option value="0.75">0.75×</option><option value="1">1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option><option value="2">2×</option></select>
      </div>
    </div>
      {showLyrics && <div className="relative mt-4 rounded-card border border-white/[0.08] bg-black/15 p-4 text-center text-sm leading-7 text-gramophone-text-secondary"><p className="font-medium text-white">Lyrics</p><p className="mt-2">Lyrics are ready for this private listening session.<br />Sing along, one beautiful line at a time.</p></div>}
    </motion.div>
  );
};

const IconButton = ({ children, label, onClick, active = false }) => <button type="button" onClick={onClick} aria-label={label} className={`flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/[0.1] ${active ? 'bg-gramophone-accent/20 text-gramophone-accent' : 'text-gramophone-text-secondary'}`}>{children}</button>;

export default PremiumPlayer;
