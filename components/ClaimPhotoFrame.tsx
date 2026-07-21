import type { ReactNode } from "react";
import Image from "next/image";
import { resolvePhotoUrl } from "@/lib/pinata";

export function ClaimPhotoFrame({
  photoUri,
  caption,
  children,
}: {
  photoUri?: string;
  caption?: ReactNode;
  children?: ReactNode;
}) {
  const src = resolvePhotoUrl(photoUri);

  return (
    <div className="relative aspect-[4/3] overflow-hidden border border-[var(--color-line)] bg-[linear-gradient(180deg,#ded7c5,#9aa58a_62%,#76644e_62%)]">
      {src ? (
        <Image
          src={src}
          alt="Claim photo proof"
          fill
          unoptimized
          className="object-cover"
          sizes="100vw"
        />
      ) : (
        <>
          <div className="absolute bottom-[28%] left-1/2 h-24 w-px -translate-x-1/2 bg-[var(--color-bark)]" />
          <div className="absolute bottom-[42%] left-1/2 size-28 -translate-x-1/2 rounded-full border border-[var(--color-forest)]" />
          <div className="absolute bottom-[43%] left-[38%] size-20 rounded-full border border-[var(--color-forest)]" />
          <div className="absolute bottom-[43%] right-[38%] size-20 rounded-full border border-[var(--color-forest)]" />
          <div className="absolute bottom-0 left-0 right-0 h-[28%] bg-[#76644e]" />
        </>
      )}
      {children}
      {caption ? (
        <div
          className="mono-data absolute bottom-3 left-3 right-3 truncate border-t border-[rgba(29,27,23,0.18)] bg-[rgba(251,247,237,0.88)] px-3 py-3 text-[10px] font-bold leading-5 text-[var(--color-ink)]"
          title={typeof caption === "string" ? caption : undefined}
        >
          {caption}
        </div>
      ) : null}
    </div>
  );
}
