"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Wallet } from "lucide-react";
import { useWallet } from "@/components/WalletProvider";

const links = [
  { href: "/", label: "Forest" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/submit", label: "Submit" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/contract", label: "Contract" },
  { href: "/why-stellar", label: "Why Stellar" },
];

export function Nav() {
  const pathname = usePathname();
  const { publicKey, isConnecting, isConnected, error, connect, disconnect } = useWallet();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-[rgba(243,236,220,0.94)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 pt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[rgba(29,27,23,0.55)] sm:px-8">
        <span>Field journal · ledger 01</span>
        <span className="mono-data">Stellar / testnet</span>
      </div>
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-3 sm:px-8">
        <Link href="/" className="focus-ring flex items-center gap-3">
          <span className="grid size-10 place-items-center border-2 border-[var(--color-ink)] text-[var(--color-soil)]">
            <span className="font-display text-xl font-bold">T</span>
          </span>
          <span>
            <span className="block font-display text-2xl font-semibold leading-none">TrustForest</span>
            <span className="mono-data mt-1 block text-[9px] uppercase tracking-[0.14em] text-[rgba(29,27,23,0.55)]">Planting registry</span>
          </span>
        </Link>
        <div className="hidden items-center gap-1 border-x border-[var(--color-line)] px-3 xl:flex">
          {links.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`focus-ring border-b-2 px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "border-[var(--color-soil)] text-[var(--color-ink)]"
                    : "border-transparent text-[rgba(29,27,23,0.62)] hover:border-[var(--color-amber)] hover:text-[var(--color-ink)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <button
              type="button"
              onClick={() => void disconnect()}
              className="focus-ring mono-data inline-flex items-center gap-2 border border-[var(--color-line)] px-3 py-2 text-xs font-bold text-[rgba(29,27,23,0.78)] transition hover:border-[var(--color-soil)]"
            >
              <LogOut size={16} />
              {publicKey ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}` : "Disconnect"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void connect()}
              disabled={isConnecting}
              className="focus-ring inline-flex items-center gap-2 border border-[var(--color-soil)] bg-[var(--color-soil)] px-4 py-2.5 text-sm font-bold text-[var(--color-paper)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Wallet size={16} />
              {isConnecting ? "Connecting" : "Connect wallet"}
            </button>
          )}
          <Link
            href="/submit"
            className="focus-ring hidden border border-[var(--color-ink)] px-5 py-2.5 text-sm font-bold text-[var(--color-ink)] transition hover:-translate-y-0.5 sm:inline-flex"
          >
            Plant claim
          </Link>
        </div>
      </nav>
      {error ? (
        <div className="border-t border-[var(--color-line)] bg-[rgba(155,63,53,0.1)] px-5 py-3 text-center text-sm font-semibold text-[var(--color-soil)] sm:px-8">
          Wallet error: {error}
        </div>
      ) : null}
      <div className="flex gap-3 overflow-x-auto px-5 pb-3 xl:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="focus-ring shrink-0 border-b border-[var(--color-line)] px-2 py-1.5 text-sm font-semibold"
          >
            {link.label}
          </Link>
        ))}
        {isConnected ? (
          <button
            type="button"
            onClick={() => void disconnect()}
            className="focus-ring mono-data shrink-0 border border-[var(--color-line)] px-3 py-1.5 text-xs font-semibold"
          >
            Disconnect
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void connect()}
            className="focus-ring shrink-0 bg-[var(--color-soil)] px-3 py-1.5 text-sm font-bold text-[var(--color-paper)]"
          >
            Connect wallet
          </button>
        )}
      </div>
    </header>
  );
}
