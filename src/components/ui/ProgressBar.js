import React, { memo } from 'react';
import { motion } from 'framer-motion';

const ProgressBar = memo(({ progress = 0, buffered = 0, onSeek }) => {
  const pct = Math.max(0, Math.min(1, progress)) * 100;
  const buf = Math.max(0, Math.min(1, buffered)) * 100;

  return (
    <div className="w-full">
      <div className="relative h-2 w-full rounded-full bg-white/[0.04]" aria-hidden>
        <div
          className="absolute left-0 top-0 h-2 rounded-full bg-white/[0.06]"
          style={{ width: `${buf}%` }}
        />
        <motion.div
          className="absolute left-0 top-0 h-2 rounded-full bg-gradient-to-r from-gramophone-accent-secondary to-gramophone-accent"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ ease: 'easeOut', duration: 0.4 }}
        />
      </div>
      <input
        aria-label="Seek"
        type="range"
        min="0"
        max="1"
        step="0.001"
        value={Math.max(0, Math.min(1, progress))}
        onChange={(e) => onSeek && onSeek(Number(e.target.value))}
        className="mt-2 w-full appearance-none bg-transparent focus:outline-none"
      />
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
