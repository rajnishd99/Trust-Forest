"use client";

import { useEffect, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

export function StatCounter({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!inView || reduceMotion) {
      return;
    }

    let frame = 0;
    const total = 36;
    const timer = window.setInterval(() => {
      frame += 1;
      setDisplay(Math.round((value * frame) / total));
      if (frame >= total) window.clearInterval(timer);
    }, 24);

    return () => window.clearInterval(timer);
  }, [inView, reduceMotion, value]);

  return (
    <motion.div
      ref={ref}
      className="earth-panel p-7"
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <p className="mono-data text-6xl font-bold text-[var(--color-ink)]">
        {display}
        <span className="text-xl text-[var(--color-soil)]">{suffix}</span>
      </p>
      <p className="mono-data mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-soil)]">
        {label}
      </p>
    </motion.div>
  );
}
