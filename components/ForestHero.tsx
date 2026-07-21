"use client";

import Link from "next/link";
import { ArrowRight, Leaf, PenLine } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export function ForestHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="journal-page relative overflow-hidden">
      <div className="absolute right-[8%] top-14 hidden rotate-12 text-[var(--color-forest)] opacity-40 lg:block" aria-hidden>
        <Leaf size={180} strokeWidth={0.7} />
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
        <div className="relative z-10">
          <motion.p
            className="mono-data mb-6 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-soil)]"
            initial={reduceMotion ? false : { opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="h-px w-10 bg-[var(--color-soil)]" /> Field note 01 / living registry
          </motion.p>
          <motion.h1
            className="font-display max-w-3xl text-6xl font-semibold leading-[0.9] tracking-[-0.04em] text-[var(--color-ink)] sm:text-8xl"
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            Plant proof.<br /><em className="text-[var(--color-soil)]">Keep record.</em>
          </motion.h1>
          <motion.p
            className="mt-7 max-w-xl text-lg leading-8 text-[rgba(29,27,23,0.68)]"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            TrustForest turns a planting photograph, a place, and a small stake
            into a public field record on Stellar.
          </motion.p>
          <motion.div
            className="mt-9 flex flex-col gap-3 sm:flex-row"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
          >
            <Link href="/submit" className="focus-ring inline-flex items-center justify-center gap-3 bg-[var(--color-soil)] px-6 py-4 font-bold text-[var(--color-paper)] transition hover:-translate-y-1">
              Start a field record <PenLine size={17} />
            </Link>
            <Link href="/dashboard" className="focus-ring inline-flex items-center justify-center gap-3 border border-[var(--color-ink)] px-6 py-4 font-bold text-[var(--color-ink)] transition hover:-translate-y-1">
              Read the ledger <ArrowRight size={17} />
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="tape relative mx-auto w-full max-w-md rotate-2 bg-[var(--color-paper)] p-3 shadow-[10px_14px_0_rgba(29,27,23,0.1)] sm:p-5"
          initial={reduceMotion ? false : { opacity: 0, y: 18, rotate: 6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, rotate: 2, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative aspect-[4/5] overflow-hidden border border-[var(--color-line)] bg-[#d7d0be] p-5">
            <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "linear-gradient(145deg, transparent 48%, #526b4f 49%, transparent 50%), linear-gradient(35deg, transparent 58%, #9b3f35 59%, transparent 60%)" }} />
            <div className="absolute left-[22%] top-[32%] h-36 w-px rotate-[-18deg] bg-[var(--color-forest)]" />
            <div className="absolute left-[19%] top-[31%] h-16 w-20 rotate-[-35deg] rounded-[100%_0] border border-[var(--color-forest)]" />
            <div className="absolute left-[23%] top-[37%] h-16 w-20 rotate-[25deg] rounded-[0_100%] border border-[var(--color-forest)]" />
            <div className="absolute bottom-8 left-8 right-8 border-t border-dashed border-[rgba(29,27,23,0.3)] pt-3">
              <p className="mono-data text-[9px] uppercase tracking-[0.16em] text-[rgba(29,27,23,0.58)]">Specimen / TF-0001</p>
              <p className="mt-2 font-display text-3xl italic text-[var(--color-ink)]">A record that grows.</p>
            </div>
            <span className="stamp absolute right-5 top-6 px-3 py-2 text-[10px] text-[var(--color-soil)]">verified</span>
          </div>
          <div className="flex items-center justify-between px-1 pt-4">
            <span className="mono-data text-[9px] uppercase tracking-[0.16em] text-[rgba(29,27,23,0.5)]">Coordinates retained</span>
            <span className="font-display text-lg italic text-[var(--color-forest)]">Field ledger</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
