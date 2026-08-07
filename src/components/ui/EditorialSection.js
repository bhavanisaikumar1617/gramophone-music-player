import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import GlassCard from './GlassCard';
import SectionHeader from './SectionHeader';
import { getEditorialImage } from '../../utils/imageService';


const EditorialSection = memo(({ shelves, favorites }) => (
  <section id="editorial" className="scroll-mt-24">
    <GlassCard className="p-6 md:p-8">
      <SectionHeader
        eyebrow="Editorial shelves"
        title="Curated stories"
        subtitle="Updated every Thursday"
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {shelves.map((shelf, index) => (
          <motion.article
            key={shelf.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-card border border-white/[0.08] bg-gramophone-card"
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src={getEditorialImage(shelf.title || `editorial-${index}`)}
                alt={shelf.title || ''}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gramophone-bg via-gramophone-bg/40 to-transparent" />
            </div>
            <div className="p-5">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gramophone-accent-secondary to-gramophone-accent text-xs font-bold text-white">
                  {shelf.curator.split(' ').pop()?.[0] || 'G'}
                </span>
                <div>
                  <p className="text-xs text-gramophone-muted">{shelf.curator}</p>
                  <p className="text-caption text-gramophone-text-secondary">{shelf.count} sets</p>
                </div>
              </div>
              <h3 className="text-card-title text-gramophone-text">{shelf.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gramophone-text-secondary">
                {shelf.summary}
              </p>
              <button
                type="button"
                className="focus-ring mt-4 inline-flex items-center gap-2 text-sm font-medium text-gramophone-accent transition hover:gap-3"
              >
                Read more
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.article>
        ))}
      </div>

          {favorites.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 rounded-card border border-gramophone-accent/20 bg-gramophone-accent/5 p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-card-title text-gramophone-text">Favourites</h3>
            <span className="text-caption text-gramophone-muted">{favorites.length} selections</span>
          </div>
          <ul className="space-y-3">
            {favorites.slice(0, 5).map((song) => (
              <li
                key={song.id}
                className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3"
              >
                <div>
                  <strong className="text-sm text-gramophone-text">{song.title}</strong>
                  <p className="text-caption text-gramophone-text-secondary">{song.artist}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </GlassCard>
  </section>
));

EditorialSection.displayName = 'EditorialSection';

export default EditorialSection;
