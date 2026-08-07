import React, { memo } from 'react';

const Equalizer = memo(({ isPlaying, bars = 5 }) => (
  <div className="flex h-5 items-end gap-[3px]" aria-hidden="true">
    {Array.from({ length: bars }).map((_, index) => (
      <span
        key={index}
        className={`w-[3px] rounded-full bg-gramophone-accent ${
          isPlaying ? 'animate-pulse' : 'h-1 opacity-40'
        }`}
        style={
          isPlaying
            ? {
                height: `${8 + (index % 3) * 6}px`,
                animationDelay: `${index * 0.12}s`,
                animationDuration: `${0.4 + index * 0.1}s`,
              }
            : { height: '4px' }
        }
      />
    ))}
  </div>
));

Equalizer.displayName = 'Equalizer';

export default Equalizer;
