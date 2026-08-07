import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Play } from 'lucide-react';
import GlassCard from './GlassCard';
import SectionHeader from './SectionHeader';

const TrendingCard = memo(({ item, index, onPlay, albumArt, isFavourite, onToggleFavourite }) => (
  <motion.article
    initial={{ opacity: 0, x: 24 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08, duration: 0.4 }}
    whileHover={{ y: -6 }}
    className="group relative w-[220px] shrink-0 snap-start"
  >
    <div className="relative overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-gramophone-card shadow-card">
      <div className="relative aspect-square overflow-hidden">
        {albumArt ? (
          <img
            src={albumArt}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-gramophone-accent-secondary/40 to-gramophone-accent/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 transition group-hover:opacity-100" />
        <button
          type="button"
          onClick={onPlay}
          className="focus-ring absolute bottom-3 right-3 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-gramophone-accent text-white opacity-0 shadow-glow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          aria-label={`Play ${item.title}`}
        >
          <Play className="ml-0.5 h-5 w-5 fill-current" />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-gramophone-text">{item.title}</h3>
            <p className="truncate text-caption text-gramophone-text-secondary">{item.artist}</p>
          </div>
          <button
            type="button"
            onClick={onToggleFavourite}
            className={`focus-ring shrink-0 rounded-full p-1.5 transition ${
              isFavourite
                ? 'text-gramophone-accent'
                : 'text-gramophone-muted hover:text-gramophone-accent'
            }`}
            aria-label="Toggle favourite"
          >
            <Heart className={`h-4 w-4 ${isFavourite ? 'fill-current' : ''}`} />
          </button>
        </div>
        <p className="mt-2 line-clamp-2 text-xs text-gramophone-muted">{item.note}</p>
      </div>
    </div>
  </motion.article>
));

TrendingCard.displayName = 'TrendingCard';

const TrendingSection = memo(({ highlights, library, favouriteIds, onPlaySong, onToggleFavourite }) => (
  <section id="trending" className="scroll-mt-24">
    <GlassCard className="p-6 md:p-8">
      <SectionHeader
        eyebrow="Trending now"
        title="Chart pulse"
        subtitle="Inspired by Spotify global charts"
      />
      <div className="-mx-2 flex gap-5 overflow-x-auto px-2 pb-2 snap-x snap-mandatory scrollbar-hide">
        {highlights.map((item, index) => {
          const matchedSong = library.find(
            (song) => song.title.toLowerCase() === item.title.toLowerCase()
          );
          return (
            <TrendingCard
              key={item.title}
              item={item}
              index={index}
              albumArt={matchedSong?.albumArt}
              isFavourite={matchedSong ? favouriteIds.has(matchedSong.id) : false}
              onPlay={() => matchedSong && onPlaySong(matchedSong)}
              onToggleFavourite={() => matchedSong && onToggleFavourite(matchedSong)}
            />
          );
        })}
      </div>
    </GlassCard>
  </section>
));

TrendingSection.displayName = 'TrendingSection';

export default TrendingSection;
