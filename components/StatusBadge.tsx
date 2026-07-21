"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ClaimStatus } from "@/lib/claims";

const styles: Record<ClaimStatus, string> = {
  Pending: "text-[var(--color-amber)]",
  Approved: "text-[var(--color-forest)]",
  Rejected: "text-[var(--color-soil)]",
  Paid: "text-[var(--color-forest)]",
  Cancelled: "text-[rgba(29,27,23,0.58)]",
  Expired: "text-[rgba(29,27,23,0.58)]",
};

export function StatusBadge({ status }: { status: ClaimStatus }) {
  const label = status === "Paid" ? "Verified" : status;
  const reduceMotion = useReducedMotion();
  return (
    <motion.span
      key={status}
      initial={reduceMotion ? false : { opacity: 0, scale: 1.45 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 16 }}
      className="inline-block"
    >
      <span className={`stamp inline-block px-3 py-1.5 text-[10px] font-bold ${styles[status]}`}>
        {label}
      </span>
    </motion.span>
  );
}
