import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Clock3, Heart, Play } from 'lucide-react';
import { getTrackArtwork } from '../../utils/imageService';

const AlbumCard = memo(({ song, onPlay, onToggleFav, isActive, isFavourite }) => {
  const artwork = getTrackArtwork({
    title: song.title,
    artist: song.artist,
    language: song.language,
    seed: song.id,
    albumArt: song.albumArt,
  });

  const playSong = () => onPlay?.(song);

  return (
    <motion.article
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className={`group relative overflow-hidden rounded-card border border-white/[0.06] bg-gramophone-card/80 shadow-card hover:shadow-glow-sm transition-all duration-300 ${
        isActive ? 'ring-1 ring-gramophone-accent/30' : ''
      }`}
      role="button"
      tabIndex={0}
      onClick={playSong}
      onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && playSong()}
    >
      <div className="relative m-3 overflow-hidden rounded-card">
        <div className="relative aspect-[1/1] w-full overflow-hidden rounded-card">
          <img
            src={artwork}
            alt={`${song.title} artwork`}
            loading="lazy"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder-album.png'; }}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-90 transition-opacity duration-300" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-gramophone-bg/70 via-gramophone-bg/20 to-transparent" />
        </div>

        <div className="absolute left-3 top-3 z-10">
          <button type="button" onClick={(event) => { event.stopPropagation(); onToggleFav?.(song); }} aria-label={`Favourite ${song.title}`} className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-black/30 shadow-sm backdrop-blur-md transition hover:scale-105 ${isFavourite ? 'text-gramophone-accent' : 'text-white/80 hover:text-gramophone-accent'}`}>
            <Heart className={`h-4 w-4 ${isFavourite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="absolute right-3 bottom-3 z-10">
          <button type="button" onClick={(event) => { event.stopPropagation(); playSong(); }} aria-label={`Play ${song.title}`} className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gramophone-accent-secondary to-gramophone-accent text-white shadow-[0_14px_28px_rgba(124,92,252,0.32)] transition-transform duration-300 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-105">
            <Play className="ml-0.5 h-4 w-4 fill-current" />
          </button>
        </div>
      </div>

      <div className="px-4 pb-4 pt-2">
        <h4 className="truncate text-base font-semibold tracking-tight text-gramophone-text leading-5">{song.title}</h4>
        <p className="mt-1 truncate text-sm text-gramophone-text-secondary">{song.artist}</p>
        <div className="mt-3 flex items-center justify-between text-xs font-medium text-gramophone-text-secondary">
          <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{song.duration || '—'}</span>
          {isActive ? <span className="rounded-full bg-gramophone-accent/12 px-2 py-1 text-gramophone-accent text-[0.72rem]">Now playing</span> : <span className="text-xs text-gramophone-text-secondary">&nbsp;</span>}
        </div>
      </div>
    </motion.article>
  );
});

AlbumCard.displayName = 'AlbumCard';

export default AlbumCard;
