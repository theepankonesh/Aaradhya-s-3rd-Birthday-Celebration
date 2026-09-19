import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  delay: number;
  duration: number;
  shape: 'circle' | 'rect' | 'ribbon' | 'pennant';
}

interface ConfettiEffectProps {
  active: boolean;
  onComplete?: () => void;
}

export const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ active, onComplete }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  /* onComplete is rebuilt on every parent render. Held in a ref, it stops the
     effect from re-running and restarting the fall halfway down. */
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!active) {
      setPieces([]);
      return;
    }

    /* Cherry, gold and cream, plus the pennant shape cut from the bunting. */
    const colors = ['#C1122E', '#8A0F22', '#E2B848', '#C08A12', '#FFF3C4', '#F3E3BC', '#7A5606'];
    const shapes: Array<'circle' | 'rect' | 'ribbon' | 'pennant'> = [
      'circle', 'rect', 'ribbon', 'pennant'
    ];

    const newPieces: ConfettiPiece[] = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * 96 + 2,
      y: -20 - Math.random() * 50,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      delay: Math.random() * 0.5,
      duration: Math.random() * 2 + 2.2,
      shape: shapes[Math.floor(Math.random() * shapes.length)]
    }));

    setPieces(newPieces);

    const timer = setTimeout(() => {
      onCompleteRef.current?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [active]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            width: p.shape === 'ribbon' ? `${p.size * 1.8}px` : `${p.size}px`,
            height:
              p.shape === 'circle' || p.shape === 'pennant'
                ? `${p.size}px`
                : `${p.size * 0.6}px`,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '9999px' : '2px',
            clipPath: p.shape === 'pennant' ? 'polygon(0 0, 100% 0, 50% 100%)' : undefined
          }}
          initial={{ y: -30, rotate: p.rotation, opacity: 1 }}
          animate={{
            y: ['0vh', '110vh'],
            rotate: [p.rotation, p.rotation + 480],
            x: [0, (p.id % 2 === 0 ? 30 : -30), 0],
            opacity: [1, 1, 0]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};
