import React, { memo } from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary:
    'bg-gradient-to-r from-gramophone-accent-secondary to-gramophone-accent text-white shadow-glow-sm hover:shadow-glow',
  secondary:
    'border border-white/[0.12] bg-white/[0.04] text-gramophone-text hover:border-gramophone-accent/40 hover:bg-white/[0.08]',
  ghost: 'text-gramophone-text-secondary hover:text-gramophone-text hover:bg-white/[0.06]',
  premium:
    'bg-gradient-to-r from-[#FFD60A]/90 to-[#FF9F0A]/90 text-[#090B13] font-semibold shadow-lg hover:brightness-110',
};

const PremiumButton = memo(
  ({
    children,
    variant = 'primary',
    className = '',
    icon: Icon,
    size = 'md',
    ...props
  }) => {
    const sizes = {
      sm: 'px-4 py-2 text-caption rounded-full',
      md: 'px-5 py-3 text-body rounded-full',
      lg: 'px-8 py-3.5 text-body rounded-full',
    };

    return (
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className={`focus-ring btn-ripple relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
        {children}
      </motion.button>
    );
  }
);

PremiumButton.displayName = 'PremiumButton';

export default PremiumButton;
