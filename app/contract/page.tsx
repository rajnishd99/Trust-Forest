import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  ExternalLink,
  FileCode2,
  Network,
} from "lucide-react";
import {
  CONTRACT_FOLDER_URL,
  CONTRACT_NAME,
  CONTRACT_NETWORK,
  CONTRACT_SOURCE_URL,
  getContractExplorerUrl,
  getContractId,
} from "@/lib/contract-info";

export const metadata: Metadata = {
  title: "Contract | TrustForest",
  description:
    "Inspect TrustForest Soroban contract, deployed Stellar testnet record, source code, and public methods.",
};

const methods = [
  {
    name: "submit_claim",
    actor: "Planter",
    purpose: "Lock stake and register photo plus GPS grid proof.",
  },
  {
    name: "decide_claim",
    actor: "Admin",
    purpose: "Approve and pay reward, or reject and refund stake.",
  },
  {
    name: "list_claims",
    actor: "Anyone",
    purpose: "Read full claim ledger with optional status filter.",
  },
  {
    name: "update_claim",
    actor: "Planter",
    purpose: "Correct proof while claim remains pending.",
  },
  {
    name: "cancel_claim",
    actor: "Planter",
    purpose: "Cancel pending claim and recover locked stake.",
  },
  {
    name: "expire_claim",
    actor: "Anyone",
    purpose: "Close overdue claim and release reserved proof indexes.",
  },
];

export default function ContractPage() {
  const contractId = getContractId();
  const explorerUrl = getContractExplorerUrl(contractId);

  return (
    <>
      <section className="journal-page px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_0.85fr]">
            <div>
              <p className="mono-data text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-soil)]">
                Contract registry / deployed specimen
              </p>
              <h1 className="font-display mt-4 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-7xl">
                Contract, visible from source to testnet.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[rgba(29,27,23,0.68)]">
                Inspect deployed Soroban contract, read Rust source, and trace
                exact methods used by TrustForest client.
              </p>
            </div>
            <div className="earth-panel p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <span className="mono-data text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-soil)]">
                  Live identifier
                </span>
                <span className="inline-flex items-center gap-2 text-xs font-bold text-[var(--color-forest)]">
                  <span className="size-2 rounded-full bg-[var(--color-forest)]" />
                  Testnet
                </span>
              </div>
              <p className="mono-data mt-5 break-all border-y border-dashed border-[var(--color-line)] py-5 text-sm font-bold leading-7">
                {contractId}
              </p>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 bg-[var(--color-soil)] px-5 py-3.5 font-bold text-[var(--color-paper)] transition hover:-translate-y-0.5"
              >
                Open deployed contract <ExternalLink size={17} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { icon: FileCode2, label: "Contract", value: CONTRACT_NAME },
              { icon: Network, label: "Network", value: CONTRACT_NETWORK },
              { icon: CheckCircle2, label: "Client integration", value: "Wallet-signed" },
            ].map((item) => (
              <div key={item.label} className="ledger-rule py-5">
                <item.icon size={20} className="text-[var(--color-soil)]" />
                <p className="mono-data mt-4 text-[9px] font-bold uppercase tracking-[0.16em] text-[rgba(29,27,23,0.5)]">
                  {item.label}
                </p>
                <p className="mt-2 font-display text-2xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="mono-data text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-soil)]">
                Public interface
              </p>
              <h2 className="font-display mt-3 text-4xl font-semibold">
                Frontend and contract speak same language.
              </h2>
              <p className="mt-4 leading-7 text-[rgba(29,27,23,0.68)]">
                Claim form calls <code className="mono-data">submit_claim</code>{" "}
                directly through Stellar SDK. Admin dashboard calls{" "}
                <code className="mono-data">decide_claim</code>. Both transactions
                require connected wallet signature.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={CONTRACT_SOURCE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring inline-flex items-center gap-2 border border-[var(--color-ink)] px-5 py-3 font-bold"
                >
                  Read lib.rs <Code2 size={17} />
                </a>
                <a
                  href={CONTRACT_FOLDER_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring inline-flex items-center gap-2 px-5 py-3 font-bold text-[var(--color-soil)]"
                >
                  Contract folder <ExternalLink size={17} />
                </a>
              </div>
            </div>

            <div className="earth-panel divide-y divide-dashed divide-[var(--color-line)] p-5 sm:p-7">
              {methods.map((method) => (
                <div
                  key={method.name}
                  className="grid gap-2 py-5 first:pt-1 last:pb-1 sm:grid-cols-[0.65fr_0.35fr_1.2fr] sm:items-baseline"
                >
                  <code className="mono-data text-sm font-bold text-[var(--color-soil)]">
                    {method.name}
                  </code>
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-[rgba(29,27,23,0.48)]">
                    {method.actor}
                  </span>
                  <span className="text-sm leading-6 text-[rgba(29,27,23,0.68)]">
                    {method.purpose}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <Link
              href="/submit"
              className="focus-ring inline-flex items-center gap-2 bg-[var(--color-forest)] px-6 py-4 font-bold text-[var(--color-paper)]"
            >
              Build contract call <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
