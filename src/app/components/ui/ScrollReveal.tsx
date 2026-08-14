"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** delay dalam detik sebelum animasi mulai (default 0) */
  delay?: number;
  /** arah masuk: up (default), down, left, right */
  direction?: "up" | "down" | "left" | "right";
  /** seberapa jauh elemen bergerak sebelum muncul (default 40px) */
  distance?: number;
}

const directionMap = {
  up:    { y: 40,   x: 0   },
  down:  { y: -40,  x: 0   },
  left:  { y: 0,    x: 40  },
  right: { y: 0,    x: -40 },
};

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 40,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });

  const { x, y } = directionMap[direction];
  const scaleX = x !== 0 ? (x > 0 ? distance : -distance) : 0;
  const scaleY = y !== 0 ? (y > 0 ? distance : -distance) : 0;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: scaleY, x: scaleX }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.22, 1, 0.36, 1], // custom ease — smooth morph
      }}
    >
      {children}
    </motion.div>
  );
}
