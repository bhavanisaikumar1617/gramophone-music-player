import React, { memo } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  ListMusic,
  Mic2,
  MonitorSpeaker,
  Repeat,
  Shuffle,
  Gauge,
  Play,
  Pause,
} from 'lucide-react';
import GlassCard from './GlassCard';
import Equalizer from './Equalizer';
import ProgressBar from './ProgressBar';
import VolumeSlider from './VolumeSlider';
import { getTrackArtwork } from '../../utils/imageService';

const PlayerSection = memo(
    ({
    currentSong,
    isPlaying,
    children,
  }) => (
    <motion.div
      id="player"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="scroll-mt-24 lg:col-span-1"
    >
      <div className="fixed bottom-6 left-1/2 z-50 w-[min(1100px,92%)] -translate-x-1/2">
        <GlassCard className="premium-player overflow-hidden p-4 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-4 md:gap-6">
                <div className="relative">
                <div className="absolute -inset-1 rounded-card bg-gradient-to-br from-gramophone-accent/28 to-gramophone-accent-secondary/18 blur-lg" />
                <img
                  src={currentSong?.albumArt || getTrackArtwork({
                    title: currentSong?.title || 'Now playing',
                    artist: currentSong?.artist || 'Gramophone',
                    language: currentSong?.language || 'default',
                    seed: currentSong?.id || 'player',
                  })}
                  alt={currentSong?.title || 'Album art'}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder-album.png'; }}
                  className="relative h-20 w-20 rounded-card object-cover shadow-card md:h-28 md:w-28"
                />
                <div className="absolute right-2 top-2 rounded-full bg-white/[0.04] p-1">
                  <Heart className="h-4 w-4 text-gramophone-text-secondary" />
                </div>
              </div>

              <div className="min-w-0">
                <p className="text-caption font-semibold uppercase tracking-[0.12em] text-gramophone-accent">
                  {isPlaying ? 'Now playing' : 'Paused'}
                </p>
                <h3 className="truncate text-card-title text-gramophone-text">
                  {currentSong?.title || 'No track selected'}
                </h3>
                <p className="truncate text-sm text-gramophone-text-secondary">
                  {currentSong?.artist || '—'}
                </p>
              </div>
            </div>

              <div className="flex flex-1 flex-col items-center gap-3 md:items-start">
              <div className="flex w-full items-center justify-center gap-4 md:justify-center">
                <button
                  type="button"
                  aria-label="Shuffle"
                  className="focus-ring rounded-full p-2 text-gramophone-muted hover:bg-white/[0.04]"
                >
                  <Shuffle className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  className="focus-ring btn-ripple inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-gramophone-accent-secondary to-gramophone-accent text-white shadow-glow-sm"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
                <button
                  type="button"
                  aria-label="Repeat"
                  className="focus-ring rounded-full p-2 text-gramophone-muted hover:bg-white/[0.04]"
                >
                  <Repeat className="h-5 w-5" />
                </button>
              </div>

              <div className="w-full px-2 md:px-6">
                <ProgressBar progress={currentSong?.progress || 0} buffered={currentSong?.buffered || 0} onSeek={() => {}} />
              </div>

              <div className="mt-1 flex w-full items-center justify-between px-2 md:px-6">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="focus-ring rounded-full p-2 text-gramophone-muted hover:bg-white/[0.04]"
                    aria-label="Lyrics"
                  >
                    <Mic2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="focus-ring rounded-full p-2 text-gramophone-muted hover:bg-white/[0.04]"
                    aria-label="Queue"
                  >
                    <ListMusic className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden items-center gap-4 md:flex">
                    <VolumeSlider initial={0.8} onChange={() => {}} />
                    <MonitorSpeaker className="h-5 w-5 text-gramophone-text-secondary" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Gauge className="h-4 w-4 text-gramophone-text-secondary" />
                    <Equalizer isPlaying={isPlaying} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {children}
        </GlassCard>
      </div>
    </motion.div>
  )
);

PlayerSection.displayName = 'PlayerSection';

export default PlayerSection;
