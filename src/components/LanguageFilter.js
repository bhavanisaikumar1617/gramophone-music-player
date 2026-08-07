import React, { memo } from 'react';
import { motion } from 'framer-motion';

const LanguageFilter = memo(({ value, onChange, options }) => (
  <div className="space-y-3">
    <p className="text-caption font-medium text-gramophone-text-secondary">Filter by language</p>
    <div
      className="inline-flex flex-wrap gap-1 rounded-[22px] border border-white/[0.08] bg-white/[0.03] p-1.5 backdrop-blur-sm"
      role="group"
      aria-label="Filter by language"
    >
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`focus-ring relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'text-gramophone-text'
                : 'text-gramophone-muted hover:text-gramophone-text-secondary'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="language-segment"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-gramophone-accent-secondary/30 to-gramophone-accent/20 shadow-glow-sm"
                style={{ border: '1px solid rgba(169,112,255,0.25)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  </div>
));

LanguageFilter.displayName = 'LanguageFilter';

export default LanguageFilter;
