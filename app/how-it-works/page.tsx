import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

const steps = [
  {
    title: "Submit",
    text: "A planter uploads a photo hash, quantized GPS grid cell, and XLM stake.",
  },
  {
    title: "Stake",
    text: "The contract checks duplicate photo and location indexes before holding the stake.",
  },
  {
    title: "Review",
    text: "The admin reviews each claim. Accepting triggers payout; rejecting refunds stake.",
  },
  {
    title: "Close",
    text: "Expired and cancelled claims free their photo and grid slots so proofs never stay stuck.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="journal-page px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mono-data text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-soil)]">
            Registry method / four entries
          </p>
          <h1 className="font-display mt-4 text-5xl font-semibold leading-tight sm:text-7xl">
            A claim grows only when the proof takes root.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[rgba(29,27,23,0.68)]">
            From photograph to payout, each step leaves a legible mark in the
            contract record.
          </p>
        </div>
      </section>
      <section className="px-5 pb-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.08}>
              <div className="earth-panel h-full p-6">
                <p className="mono-data text-[10px] font-bold tracking-[0.18em] text-[var(--color-soil)]">
                  Entry 0{index + 1}
                </p>
                <h2 className="mt-5 font-display text-3xl font-semibold">{step.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[rgba(29,27,23,0.68)]">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-7xl">
          <Link
            href="/submit"
            className="focus-ring inline-flex items-center gap-2 bg-[var(--color-soil)] px-6 py-4 font-bold text-[var(--color-paper)]"
          >
            Submit a claim <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
