import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Heart, Music2, TrendingUp } from 'lucide-react';
import GlassCard from './GlassCard';
import SectionHeader from './SectionHeader';
import { getTrackArtwork } from '../../utils/imageService';

const StatCard = memo(({ icon: Icon, label, value, accent }) => (
  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
    <div
      className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
      style={{ background: `${accent}22` }}
    >
      <Icon className="h-5 w-5" style={{ color: accent }} />
    </div>
    <p className="text-caption text-gramophone-muted">{label}</p>
    <p className="mt-1 text-lg font-semibold text-gramophone-text">{value}</p>
  </div>
));

StatCard.displayName = 'StatCard';

const ChartPlaceholder = memo(({ data, label }) => {
  const max = Math.max(...data, 1);
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
      <p className="mb-4 text-caption font-medium text-gramophone-text-secondary">{label}</p>
      <div className="flex h-24 items-end gap-2">
        {data.map((value, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-2">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: `${(value / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="w-full min-h-[8px] rounded-t-md bg-gradient-to-t from-gramophone-accent-secondary to-gramophone-accent"
            />
            <span className="text-[10px] text-gramophone-muted">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

ChartPlaceholder.displayName = 'ChartPlaceholder';

const WeeklyStatsSection = memo(({ mostPlayed, favorites, playCounts, library }) => {
  const stats = useMemo(() => {
    const totalPlays = Object.values(playCounts).reduce((sum, count) => sum + count, 0);
    const listeningHours = (totalPlays * 3.5) / 60;
    const topArtist =
      mostPlayed[0]?.artist ||
      favorites[0]?.artist ||
      library[0]?.artist ||
      '—';
    const genres = library.reduce((acc, song) => {
      const lang = song.language || 'other';
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {});
    const topGenre = Object.entries(genres).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

    return {
      totalPlays,
      listeningHours: listeningHours.toFixed(1),
      topArtist,
      topGenre: topGenre.charAt(0).toUpperCase() + topGenre.slice(1),
      chartData: [3, 5, 4, 7, 6, 9, Math.max(totalPlays, 2)],
    };
  }, [mostPlayed, favorites, playCounts, library]);

  const hasActivity = stats.totalPlays > 0 || mostPlayed.length > 0;

  return (
    <section id="stats" className="scroll-mt-24">
      <GlassCard className="p-6 md:p-8">
        <SectionHeader
          eyebrow="Your lounge"
          title="Weekly stats"
          subtitle="Based on recent sessions"
        />

        {hasActivity ? (
          <>
            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard icon={Clock} label="Listening hours" value={`${stats.listeningHours}h`} accent="#A970FF" />
              <StatCard icon={Heart} label="Favourite artist" value={stats.topArtist} accent="#39D98A" />
              <StatCard icon={Music2} label="Top genre" value={stats.topGenre} accent="#7C5CFC" />
              <StatCard icon={TrendingUp} label="Recent sessions" value={`${stats.totalPlays} plays`} accent="#A970FF" />
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <ChartPlaceholder data={stats.chartData} label="Weekly listening activity" />
              <div className="space-y-3">
                <p className="text-caption font-medium text-gramophone-text-secondary">Most played</p>
                {mostPlayed.map((song, index) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.06 }}
                    className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gramophone-accent/15 text-sm font-bold text-gramophone-accent">
                      {index + 1}
                    </span>
                    <img
                      src={song.albumArt || getTrackArtwork({ title: song.title, artist: song.artist, language: song.language, seed: song.id })}
                      alt=""
                      loading="lazy"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder-album.png'; }}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <strong className="block truncate text-sm text-gramophone-text">{song.title}</strong>
                      <p className="truncate text-caption text-gramophone-text-secondary">{song.artist}</p>
                    </div>
                    <span className="text-caption font-medium text-gramophone-accent">{song.plays} plays</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={Clock} label="Listening hours" value="0.0h" accent="#A970FF" />
            <StatCard icon={Heart} label="Favourite artist" value="—" accent="#39D98A" />
            <StatCard icon={Music2} label="Top genre" value="—" accent="#7C5CFC" />
            <StatCard icon={TrendingUp} label="Recent sessions" value="0 plays" accent="#A970FF" />
            <div className="col-span-full rounded-2xl border border-dashed border-white/[0.08] p-8 text-center">
              <p className="text-body text-gramophone-text-secondary">
                Play a few tracks to unlock personal stats and weekly insights.
              </p>
            </div>
          </div>
        )}
      </GlassCard>
    </section>
  );
});

WeeklyStatsSection.displayName = 'WeeklyStatsSection';

export default WeeklyStatsSection;
