import React, { memo } from 'react';
import { motion } from 'framer-motion';

const HeroParticles = memo(() => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    {Array.from({ length: 18 }).map((_, index) => (
      <motion.span
        key={index}
        className="absolute h-1 w-1 rounded-full bg-gramophone-accent/30"
        initial={{
          x: `${(index * 17) % 100}%`,
          y: `${(index * 23) % 100}%`,
          opacity: 0.2,
        }}
        animate={{
          y: [`${(index * 23) % 100}%`, `${((index * 23) + 15) % 100}%`],
          opacity: [0.15, 0.5, 0.15],
        }}
        transition={{
          duration: 4 + (index % 4),
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.2,
        }}
      />
    ))}
  </div>
));

HeroParticles.displayName = 'HeroParticles';

export default HeroParticles;
