import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface SparkleEffectProps {
  density?: number;
  containerHeight?: string;
  theme?: 'gold' | 'cherry-gold';
}

export const SparkleEffect: React.FC<SparkleEffectProps> = ({ 
  density = 16, 
  containerHeight = "100%", 
  theme = 'gold' 
}) => {
  /* Motion animates via JS, which the stylesheet's prefers-reduced-motion rule
     cannot stop. Ten points of light drifting forever is exactly what that
     setting is asking us not to do, so hold them still instead. */
  const shouldReduceMotion = useReducedMotion();

  const particles = useMemo(() => {
    return Array.from({ length: density }).map((_, i) => ({
      id: i,
      left: Math.random() * 96 + 2,
      top: Math.random() * 96 + 2,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 4 + 3.5,
      delay: Math.random() * 3,
      isStar: i % 4 === 0,
      /* Lamp glints: warm filament, gold, and the occasional cherry glass. */
      /* Lamp glints, in the dark room's own three lights: filament, gold,
         and the occasional cherry glass. */
      color: theme === 'gold'
        // The light rooms are wheat now: a glint has to read brighter than the
        // ground, and #E2B848 is not brighter than #E8CF96.
        ? (i % 2 === 0 ? '#FFFBEA' : '#FFF3C4')
        : (i % 3 === 0 ? '#E2B848' : i % 3 === 1 ? '#FFF3C4' : '#C1122E')
    }));
  }, [density, theme]);

  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
      style={{ height: containerHeight }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`
          }}
          animate={
            shouldReduceMotion
              ? { opacity: 0.55 }
              : { y: [0, -18, 0], opacity: [0.2, 0.9, 0.2], scale: [0.8, 1.3, 0.8] }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }
          }
        />
      ))}
    </div>
  );
};
