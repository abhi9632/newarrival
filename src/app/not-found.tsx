import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-start justify-center px-6 py-20 md:px-8">
        <p className="font-body text-sm font-medium text-[var(--color-accent)]">404</p>
        <h1 className="mt-2 font-display text-[clamp(2.2rem,5vw,3.5rem)] leading-[0.98] tracking-[-0.03em] text-[var(--color-text)]">
          No obligation lives at this stop.
        </h1>
        <p className="mt-4 max-w-[52ch] font-body text-lg leading-relaxed text-[var(--color-muted)]">
          This page is not on the line. Head back to the start and pick up your timeline from there.
        </p>
        <Link
          href="/"
          className="affordance mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[var(--color-accent)] bg-[var(--color-accent)] px-7 py-3 font-body text-base font-medium text-[var(--color-surface)] hover:border-[var(--color-text)] hover:bg-[var(--color-text)]"
        >
          Back to the start
          <span aria-hidden="true" className="nudge">→</span>
        </Link>
      </main>
    </>
  );
}
