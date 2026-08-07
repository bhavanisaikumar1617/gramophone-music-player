import React, { memo } from 'react';
import { motion } from 'framer-motion';

const SectionHeader = memo(({ eyebrow, title, subtitle, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.5 }}
    className="mb-6 flex flex-wrap items-end justify-between gap-4"
  >
    <div>
      {eyebrow && (
        <p className="mb-1 text-caption font-semibold uppercase tracking-[0.14em] text-gramophone-accent">
          {eyebrow}
        </p>
      )}
      {title && <h2 className="text-section-title text-gramophone-text">{title}</h2>}
      {subtitle && <p className="mt-1 text-body text-gramophone-text-secondary">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </motion.div>
));

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;
