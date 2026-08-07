import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles } from 'lucide-react';
import GlassCard from './GlassCard';
import HeroParticles from './HeroParticles';
import PremiumButton from './PremiumButton';
import { getTrackArtwork } from '../../utils/imageService';

const HeroSection = memo(
  ({
    currentSong,
    isPlaying,
    heroSubtitle,
    filteredCount,
    favoritesCount,
    user,
    onPlayNow,
    onExploreLibrary,
    asset,
  }) => (
    <section id="hero" className="relative">
      <GlassCard className="relative overflow-hidden p-8 md:p-12 lg:p-14">
        <HeroParticles />
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gramophone-accent/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-gramophone-accent-secondary/10 blur-3xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <p className="mb-4 text-caption font-semibold uppercase tracking-[0.14em] text-gramophone-accent">
              Gramophone
            </p>
            <h1 className="mb-5 max-w-2xl text-hero font-display font-bold leading-[0.98] tracking-[-0.02em] text-gramophone-text">
              Private Listening Suite
            </h1>
            <p className="mb-8 max-w-lg text-body text-gramophone-text-secondary">
              Experience a premium, editorially curated queue that blends timeless Telugu hits with
              modern soundscapes. Crafted for launch events, lounges, and late-night focus sessions.
            </p>

            <div className="mb-10 flex flex-wrap gap-3">
              <PremiumButton variant="primary" size="lg" icon={Play} onClick={onPlayNow}>
                Play Now
              </PremiumButton>
              <PremiumButton variant="secondary" size="lg" icon={Sparkles} onClick={onExploreLibrary}>
                Explore Library
              </PremiumButton>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: 'Session status', value: isPlaying ? 'Live playback' : 'Standby' },
                { label: 'Library size', value: `${filteredCount} tracks` },
                {
                  label: 'Member tier',
                  value: user?.tier || 'Guest access',
                  note: user?.memberSince ? `Since ${user.memberSince}` : 'Login to unlock residencies',
                },
                { label: 'Favourites', value: `${favoritesCount} saved` },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-sm"
                >
                  <p className="text-caption text-gramophone-muted">{metric.label}</p>
                  <p className="mt-1 text-sm font-semibold text-gramophone-text">{metric.value}</p>
                  {metric.note && (
                    <p className="mt-0.5 text-xs text-gramophone-muted">{metric.note}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-gramophone-accent/24 to-gramophone-accent-secondary/14 blur-3xl" />
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10"
            >
              <div className="overflow-hidden rounded-[1.75rem] border border-white/[0.08] shadow-float">
                <img
                  src={currentSong?.albumArt || getTrackArtwork({
                    title: currentSong?.title || 'Featured album',
                    artist: currentSong?.artist || 'Gramophone',
                    language: currentSong?.language || 'default',
                    seed: currentSong?.id || 'hero',
                  })}
                  alt={currentSong?.title || 'Album art'}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gramophone-bg/92 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-2 left-0 right-0 p-6">
                <p className="text-caption font-semibold uppercase tracking-[0.12em] text-gramophone-accent">
                  {currentSong?.mood || 'Curated for you'}
                </p>
                <p className="mt-1 text-card-title text-gramophone-text">
                  {currentSong?.title || 'Select a track'}
                </p>
                <p className="text-sm text-gramophone-text-secondary">
                  {currentSong?.artist || heroSubtitle}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </GlassCard>
    </section>
  )
);

HeroSection.displayName = 'HeroSection';

export default HeroSection;
