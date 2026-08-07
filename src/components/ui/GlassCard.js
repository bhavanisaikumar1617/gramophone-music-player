import React, { memo } from 'react';
import { motion } from 'framer-motion';

const GlassCard = memo(({ children, className = '', hover = false, as: Component = 'div', ...props }) => {
  const Wrapper = hover ? motion.div : Component;
  const hoverProps = hover
    ? {
        whileHover: { y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.4)' },
        transition: { duration: 0.25, ease: 'easeOut' },
      }
    : {};

  return (
    <Wrapper
      className={`glass-panel ${className}`}
      {...(hover ? hoverProps : {})}
      {...props}
    >
      {children}
    </Wrapper>
  );
});

GlassCard.displayName = 'GlassCard';

export default GlassCard;
