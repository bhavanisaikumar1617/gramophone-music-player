import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock3, Disc3, Hash, Music2, Play, Search, UserRound, X } from 'lucide-react';
import { getTrackArtwork } from '../../utils/imageService';

const recentSearches = ['Ariana Grande', 'Telugu movie hits', 'Late-night instrumental'];
const trendingSearches = ['Kesariya', 'Sabrina Carpenter', 'Feel-good pop', 'Chill Telugu'];

const unique = (items) => [...new Set(items.filter(Boolean))];

const SearchOverlay = ({ isOpen, onClose, songs = [], playlists = [], onPlay, searchQuery, setSearchQuery, onSearch }) => {
  // `searchQuery`, `setSearchQuery`, and `onSearch` are provided by the parent
  // (MusicPlayer) to reuse the same search implementation and data source.
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const timer = setTimeout(() => inputRef.current?.focus(), 80);
    const onKeyDown = (event) => {
      if (event.key === 'Escape') return onClose();
      if (event.key === 'Enter') return onSearch?.();
      return undefined;
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose, onSearch]);

  // We reuse the parent-provided `songs` (which are kept in sync by the
  // shared `onSearch` handler). The overlay shows results from that shared
  // data source rather than reimplementing search logic locally.
  const catalogue = useMemo(() => {
    const trackItems = songs.map((song) => ({ type: 'Song', title: song.title, subtitle: song.artist, song }));
    const artists = unique(songs.map((song) => song.artist)).map((name) => ({ type: 'Artist', title: name, subtitle: 'Artist' }));
    const albums = unique(songs.map((song) => song.description || `${song.title} — Single`)).map((name) => ({ type: 'Album', title: name, subtitle: 'Album' }));
    const genres = unique(songs.flatMap((song) => [song.mood, song.language])).map((name) => ({ type: 'Genre', title: name, subtitle: 'Genre & mood' }));
    const languages = unique(songs.map((song) => song.language)).map((name) => ({ type: 'Language', title: name, subtitle: 'Language' }));
    const playlistItems = playlists.map((playlist) => ({ type: 'Playlist', title: playlist.name, subtitle: `${playlist.songs.length} saved tracks` }));
    return { trackItems, artists, albums, playlistItems, genres, languages };
  }, [songs, playlists]);

  const playSong = (song) => {
    if (song) onPlay(song);
    onClose();
  };

  const typeIcon = (type) => ({ Song: Music2, Artist: UserRound, Album: Disc3, Playlist: Music2, Genre: Hash, Language: Hash }[type] || Search);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-[#050712]/70 px-4 pt-[7vh] backdrop-blur-md sm:pt-[10vh]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onMouseDown={(event) => event.target === event.currentTarget && onClose()}
          role="dialog" aria-modal="true" aria-label="Search music"
        >
          <motion.section
            initial={{ opacity: 0, y: -20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 330 }}
            className="w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/[0.1] bg-[#111526]/95 shadow-[0_28px_100px_rgba(0,0,0,0.55)]"
          >
              <div className="flex items-center gap-3 border-b border-white/[0.08] px-5 py-4 sm:px-6">
              <Search className="h-5 w-5 text-gramophone-accent" />
              <input ref={inputRef} value={searchQuery || ''} onChange={(event) => { setSearchQuery(event.target.value); }} placeholder="Search songs, artists, albums, playlists, genres or languages" className="min-w-0 flex-1 bg-transparent text-base text-white placeholder:text-gramophone-muted" />
              <kbd className="hidden rounded-md border border-white/[0.1] bg-white/[0.05] px-2 py-1 text-xs text-gramophone-muted sm:block">ESC</kbd>
              <button type="button" onClick={onClose} className="rounded-full p-2 text-gramophone-muted transition hover:bg-white/[0.08] hover:text-white" aria-label="Close search"><X className="h-5 w-5" /></button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-5 sm:p-6">
              {searchQuery ? (
                // Use the authoritative `songs` passed from the parent as the single
                // source of truth for search results. Don't apply a local filter.
                (songs && songs.length) ? <div className="space-y-2">{songs.slice(0, 18).map((song, index) => {
                  const item = { type: 'Song', title: song.title, subtitle: song.artist, song };
                  const Icon = typeIcon(item.type);
                  const artwork = song && getTrackArtwork({ ...song, seed: song.id, albumArt: song.albumArt });
                  return <motion.button key={`${item.type}-${item.title}-${index}`} type="button" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.025 }} onClick={() => playSong(song)} className="group flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition hover:bg-white/[0.07]">
                    {artwork ? <img src={artwork} alt="" className="h-12 w-12 rounded-xl object-cover shadow-card" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder-album.png'; }} /> : <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.06] text-gramophone-accent"><Icon className="h-5 w-5" /></span>}
                    <span className="min-w-0 flex-1"><strong className="block truncate text-sm text-white">{item.title}</strong><span className="block truncate text-xs text-gramophone-text-secondary">{item.subtitle}</span></span>
                    <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wider text-gramophone-muted">{item.type}</span>
                    <Play className="h-4 w-4 text-gramophone-accent opacity-0 transition group-hover:opacity-100" />
                  </motion.button>;
                })}</div> : <div className="py-16 text-center"><Search className="mx-auto h-8 w-8 text-gramophone-muted" /><h2 className="mt-4 text-lg font-semibold text-white">No Results Found</h2><p className="mt-1 text-sm text-gramophone-text-secondary">Try a song, artist, mood, genre, or language.</p></div>
              ) : <div className="grid gap-7 md:grid-cols-2">
                <SearchGroup title="Recent searches" icon={Clock3} items={recentSearches} onPick={(val) => { setSearchQuery(val); onSearch?.(); }} />
                <SearchGroup title="Trending searches" icon={Search} items={trendingSearches} onPick={(val) => { setSearchQuery(val); onSearch?.(); }} />
                <SearchGroup title="Popular artists" icon={UserRound} items={unique(songs.map((song) => song.artist)).slice(0, 5)} onPick={(val) => { setSearchQuery(val); onSearch?.(); }} />
                <SearchGroup title="Albums, genres & languages" icon={Disc3} items={unique([...songs.map((song) => song.description), ...songs.map((song) => song.language), ...songs.map((song) => song.mood)]).slice(0, 7)} onPick={(val) => { setSearchQuery(val); onSearch?.(); }} />
              </div>}
            </div>
            <div className="flex items-center justify-between border-t border-white/[0.08] px-5 py-3 text-xs text-gramophone-muted"><span>Search your entire listening library</span><span><kbd className="rounded border border-white/[0.1] px-1.5 py-0.5">↵</kbd> play a song</span></div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SearchGroup = ({ title, icon: Icon, items, onPick }) => <section><div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gramophone-muted"><Icon className="h-3.5 w-3.5 text-gramophone-accent" />{title}</div><div className="flex flex-wrap gap-2">{items.map((item) => <button key={item} type="button" onClick={() => onPick(item)} className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-gramophone-text-secondary transition hover:border-gramophone-accent/35 hover:bg-gramophone-accent/10 hover:text-white">{item}</button>)}</div></section>;

export default SearchOverlay;
