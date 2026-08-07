import React, { memo, useState } from 'react';

const VolumeSlider = memo(({ initial = 0.8, onChange }) => {
  const [value, setValue] = useState(initial);

  const handle = (v) => {
    setValue(v);
    onChange && onChange(v);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gramophone-text-secondary">Vol</span>
      <input
        aria-label="Volume"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={(e) => handle(Number(e.target.value))}
        className="h-1 w-36 appearance-none rounded-full bg-white/[0.06] focus:outline-none"
      />
    </div>
  );
});

VolumeSlider.displayName = 'VolumeSlider';

export default VolumeSlider;
