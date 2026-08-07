import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ListMusic, MoreHorizontal, Plus } from 'lucide-react';
import GlassCard from './GlassCard';
import SectionHeader from './SectionHeader';

const PlaylistSection = memo(
  ({
    userPlaylists,
    newPlaylist,
    onNewPlaylistChange,
    onPlaylistCreate,
    onAddCurrentSongToPlaylist,
  }) => (
    <section id="playlists" className="scroll-mt-24">
      <GlassCard className="p-6 md:p-8">
        <SectionHeader
          eyebrow="Your collection"
          title="Folders & playlists"
          subtitle={`${userPlaylists.length} active playlists`}
        />

        <form
          onSubmit={onPlaylistCreate}
          className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <label className="relative flex-1">
            <span className="visually-hidden">Playlist name</span>
            <input
              type="text"
              value={newPlaylist}
              onChange={onNewPlaylistChange}
              placeholder="Name a new playlist"
              className="focus-ring w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] px-5 py-3.5 text-body text-gramophone-text placeholder:text-gramophone-muted transition focus:border-gramophone-accent/40 focus:bg-white/[0.06]"
            />
          </label>
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gramophone-accent-secondary to-gramophone-accent px-6 py-3.5 text-sm font-semibold text-white shadow-glow-sm transition hover:shadow-glow"
          >
            <Plus className="h-4 w-4" />
            Create
          </motion.button>
        </form>

        <div className="grid gap-4 sm:grid-cols-2">
          {userPlaylists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -3 }}
              className="group flex items-center gap-4 rounded-[1.25rem] border border-white/[0.08] bg-white/[0.03] p-4 transition hover:border-gramophone-accent/25 hover:bg-white/[0.05] hover:shadow-card"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gramophone-accent-secondary/30 to-gramophone-accent/20">
                <ListMusic className="h-7 w-7 text-gramophone-accent" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <strong className="block truncate text-sm font-semibold text-gramophone-text">
                      {playlist.name}
                    </strong>
                    <p className="text-caption text-gramophone-muted">
                      {playlist.songs.length} songs
                    </p>
                  </div>
                  <button
                    type="button"
                    className="focus-ring rounded-full p-1.5 text-gramophone-muted opacity-0 transition hover:bg-white/[0.06] hover:text-gramophone-text group-hover:opacity-100"
                    aria-label="Playlist options"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => onAddCurrentSongToPlaylist(playlist.id)}
                  className="focus-ring mt-3 rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-1.5 text-caption font-medium text-gramophone-text-secondary transition hover:border-gramophone-accent/30 hover:text-gramophone-accent"
                >
                  Add current
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </section>
  )
);

PlaylistSection.displayName = 'PlaylistSection';

export default PlaylistSection;
