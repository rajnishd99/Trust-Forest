import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t-2 border-[var(--color-ink)] bg-[var(--color-mist)] text-[var(--color-ink)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-4xl font-semibold">TrustForest</p>
          <p className="mono-data mt-3 max-w-md text-[10px] uppercase leading-6 tracking-[0.08em] text-[rgba(29,27,23,0.62)]">
            A planting registry where every proof carries a stake, a record,
            and an accountable decision.
          </p>
        </div>
        <div>
          <p className="mono-data text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-soil)]">
            Explore
          </p>
          <div className="mt-4 grid gap-2 text-sm text-[rgba(29,27,23,0.7)]">
            <Link href="/how-it-works">How it works</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/why-stellar">Why Stellar</Link>
          </div>
        </div>
        <div>
          <p className="mono-data text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-soil)]">
            Testnet
          </p>
          <p className="mono-data mt-4 break-all text-[10px] leading-5 text-[rgba(29,27,23,0.62)]">
            {process.env.NEXT_PUBLIC_CONTRACT_ID ?? process.env.CONTRACT_ID}
          </p>
        </div>
      </div>
    </footer>
  );
}
