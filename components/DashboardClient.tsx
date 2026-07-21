"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Address,
  Contract,
  nativeToScVal,
  Networks,
  rpc,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import { ClaimCard } from "@/components/ClaimCard";
import { useWallet } from "@/components/WalletProvider";
import { StellarWalletsKit } from "@/lib/stellar-wallets-kit";
import type { Claim, ClaimStatus } from "@/lib/claims";
import {
  clearMatchedPendingClaims,
  loadPendingClaims,
  type PendingClaim,
} from "@/lib/pending-claims";

const filters: Array<ClaimStatus | "All"> = [
  "All",
  "Pending",
  "Approved",
  "Paid",
  "Expired",
  "Cancelled",
  "Rejected",
];

const FIXED_ADMIN_ADDRESS = "GCGEXUG76FMVLCQHMVEUIQ2GPDEZSSNXQZQITISFUR433LZCD4UPGMYT";

export function DashboardClient({
  claims,
  source,
  error,
}: {
  claims: Claim[];
  source: "live" | "empty";
  error?: string;
}) {
  const { publicKey } = useWallet();
  const [decidingId, setDecidingId] = useState<number | null>(null);
  const [decisionMessage, setDecisionMessage] = useState("");
  const [filter, setFilter] = useState<ClaimStatus | "All">("All");
  const [pendingClaims, setPendingClaims] = useState<PendingClaim[]>(() => loadPendingClaims());

  useEffect(() => {
    let cancelled = false;
    const refreshPendingClaims = () => {
      if (!cancelled) {
        setPendingClaims(clearMatchedPendingClaims(claims));
      }
    };

    window.setTimeout(refreshPendingClaims, 0);
    const interval = window.setInterval(() => {
      refreshPendingClaims();
    }, 2500);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [claims]);

  const visible = useMemo(
    () => {
      const mergedClaims = [...claims, ...pendingClaims];
      return filter === "All"
        ? mergedClaims
        : mergedClaims.filter((claim) => claim.status === filter);
    },
    [claims, filter, pendingClaims],
  );

  const adminAddress = process.env.NEXT_PUBLIC_ADMIN_ADDRESS ?? FIXED_ADMIN_ADDRESS;
  const isAdmin = Boolean(publicKey && adminAddress && publicKey === adminAddress);
  const pendingLiveClaims = claims.filter((claim) => claim.status === "Pending").length;

  async function decideClaim(claimId: number, approve: boolean) {
    if (!publicKey || !isAdmin) return;
    const contractId = process.env.NEXT_PUBLIC_CONTRACT_ID;
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
    const networkPassphrase = process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE ?? Networks.TESTNET;
    if (!contractId || !rpcUrl) {
      setDecisionMessage("Contract or RPC config missing.");
      return;
    }

    setDecidingId(claimId);
    setDecisionMessage("");
    try {
      const server = new rpc.Server(rpcUrl);
      const source = await server.getAccount(publicKey);
      const transaction = new TransactionBuilder(source, { fee: "100", networkPassphrase })
        .addOperation(
          new Contract(contractId).call(
            "decide_claim",
            new Address(publicKey).toScVal(),
            nativeToScVal(claimId, { type: "u64" }),
            nativeToScVal(approve),
          ),
        )
        .setTimeout(30)
        .build();
      const prepared = await server.prepareTransaction(transaction);
      const { signedTxXdr } = await StellarWalletsKit.signTransaction(prepared.toXDR(), {
        networkPassphrase,
        address: publicKey,
      });
      const result = await server.sendTransaction(
        TransactionBuilder.fromXDR(signedTxXdr, networkPassphrase),
      );
      setDecisionMessage(`Decision submitted. Tx hash: ${result.hash}`);
      window.setTimeout(() => window.location.reload(), 2500);
    } catch (error) {
      setDecisionMessage(error instanceof Error ? error.message : "Decision failed.");
    } finally {
      setDecidingId(null);
    }
  }

  return (
    <section className="journal-page px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
      <div className="ledger-rule flex flex-col justify-between gap-5 py-4 md:flex-row md:items-end">
        <div>
          <p className="mono-data text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-soil)]">
            {source === "live" ? "Live contract feed" : "No claim data yet"}
          </p>
          <h1 className="font-display mt-3 text-6xl font-semibold tracking-[-0.04em]">The claim ledger</h1>
          <p className="mt-4 max-w-2xl text-[rgba(29,27,23,0.68)]">
            Follow each planting proof from submission to admin review and reward.
            {isAdmin ? " Admin controls are enabled for this wallet." : " Connect as admin to review pending claims."}
          </p>
        </div>
        <div className="flex max-w-full gap-2 overflow-x-auto border border-[var(--color-line)] bg-[rgba(251,247,237,0.55)] p-2">
          {filters.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`focus-ring shrink-0 border-b-2 px-4 py-2 text-sm font-bold transition ${
                filter === item
                  ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                  : "text-[rgba(29,27,23,0.62)] hover:bg-[rgba(155,63,53,0.08)]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="mono-data mt-5 flex flex-wrap gap-x-8 gap-y-2 text-[9px] uppercase tracking-[0.14em] text-[rgba(29,27,23,0.5)]">
        <span>Registry: TrustForest</span><span>Network: Stellar testnet</span><span>Entries: {visible.length}</span>
      </div>
      {isAdmin ? (
        <div className="mt-6 flex flex-col justify-between gap-4 border-2 border-[var(--color-forest)] bg-[rgba(82,107,79,0.08)] p-5 sm:flex-row sm:items-center">
          <div>
            <p className="mono-data text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-forest)]">Admin review desk</p>
            <p className="mt-2 font-display text-2xl">{pendingLiveClaims} claim{pendingLiveClaims === 1 ? "" : "s"} awaiting your decision.</p>
          </div>
          <p className="mono-data text-[9px] uppercase tracking-[0.1em] text-[rgba(29,27,23,0.58)]">Wallet verified · controls unlocked</p>
        </div>
      ) : null}

      <motion.div
        className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {visible.length > 0 ? (
          visible.map((claim) => (
            <motion.div
              key={claim.id}
              variants={{
                hidden: { opacity: 0, y: 28 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <ClaimCard
                claim={claim}
                isAdmin={isAdmin && claim.id > 0}
                deciding={decidingId === claim.id}
                onDecision={(approve) => void decideClaim(claim.id, approve)}
              />
            </motion.div>
          ))
        ) : (
          <motion.div
            className="earth-panel p-8 md:col-span-2 xl:col-span-3"
            variants={{
              hidden: { opacity: 0, y: 28 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <p className="font-display text-3xl font-semibold">No contract claims to show.</p>
            <p className="mt-3 max-w-2xl leading-7 text-[rgba(29,27,23,0.68)]">
              Submit a claim and confirm the wallet transaction, then refresh
              this dashboard after the contract stores it. {error ? `Latest read: ${error}` : ""}
              {visible.length === 0 && claims.length > 0 && " (Try adjusting your filters to see more claims)"}
            </p>
          </motion.div>
        )}
      </motion.div>
      {decisionMessage ? <p className="mt-5 font-semibold text-[var(--color-soil)]">{decisionMessage}</p> : null}
      </div>
    </section>
  );
}
