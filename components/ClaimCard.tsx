import Link from "next/link";
import type { Claim } from "@/lib/claims";
import { ClaimPhotoFrame } from "./ClaimPhotoFrame";
import { StatusBadge } from "./StatusBadge";

export function ClaimCard({
  claim,
  isAdmin = false,
  deciding = false,
  onDecision,
}: {
  claim: Claim;
  isAdmin?: boolean;
  deciding?: boolean;
  onDecision?: (approve: boolean) => void;
}) {
  return (
    <article className="journal-card earth-panel min-w-0 overflow-hidden">
      <Link
        href={`/claim/${claim.id}`}
        className="focus-ring group block"
      >
      <ClaimPhotoFrame
        photoUri={claim.photoUri}
        caption={claim.photoUri || claim.photoHash || "Photo not stored yet"}
      >
        <div className="absolute left-4 top-4">
          <StatusBadge status={claim.status} />
        </div>
        </ClaimPhotoFrame>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-display text-3xl font-semibold">Claim #{claim.id}</p>
            <p
              className="mono-data mt-1 truncate text-[10px] uppercase tracking-[0.08em] text-[rgba(29,27,23,0.62)]"
              title={claim.gridCell}
            >
              {claim.gridCell}
            </p>
          </div>
          <p className="mono-data shrink-0 border border-[var(--color-line)] px-3 py-2 text-[10px] font-bold uppercase">
            {claim.stakeAmount} XLM
          </p>
        </div>
        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <div className="min-w-0">
            <p className="mono-data text-[9px] uppercase tracking-[0.14em] text-[rgba(29,27,23,0.5)]">Planter</p>
            <p className="mono-data truncate text-xs leading-5" title={claim.planter}>
              {claim.planter}
            </p>
          </div>
          <div className="min-w-0">
            <p className="mono-data text-[9px] uppercase tracking-[0.14em] text-[rgba(29,27,23,0.5)]">Review</p>
            <p className="truncate font-semibold leading-5" title={claim.status}>
              {claim.status === "Pending" ? "Admin review pending" : "Admin decision recorded"}
            </p>
          </div>
        </div>
        </div>
      </Link>
      {isAdmin && claim.status === "Pending" && onDecision ? (
        <div className="grid grid-cols-2 gap-3 px-5 pb-5">
          <button
            type="button"
            disabled={deciding}
            onClick={() => onDecision(true)}
            className="focus-ring border border-[var(--color-forest)] bg-[var(--color-forest)] px-4 py-3 text-sm font-bold text-[var(--color-paper)] disabled:cursor-wait disabled:opacity-60"
          >
            {deciding ? "Sending…" : "Accept claim"}
          </button>
          <button
            type="button"
            disabled={deciding}
            onClick={() => onDecision(false)}
            className="focus-ring border border-[var(--color-soil)] bg-transparent px-4 py-3 text-sm font-bold text-[var(--color-soil)] disabled:cursor-wait disabled:opacity-60"
          >
            Decline claim
          </button>
        </div>
      ) : null}
    </article>
  );
}
