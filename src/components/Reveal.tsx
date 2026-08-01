"use client";

import { motion } from "motion/react";
import { useSyncExternalStore, type ReactNode } from "react";

// Hydration-safe reduced-motion subscription (pattern proven in the first
// build: useEffect+useState here causes a hydration mismatch AND trips the
// react-hooks/set-state-in-effect lint rule; useSyncExternalStore does not).
const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }
      }
    >
      {children}
    </motion.div>
  );
}
