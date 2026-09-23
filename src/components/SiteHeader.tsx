import Link from "next/link";

// One header for every page, so the inner page reads as the same project. The terracotta
// hairline along its foot is the page's own route line: it fills as you scroll.
export function SiteHeader({ current }: { current?: "home" | "timeline" }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 md:px-8">
        <Link
          href="/"
          aria-current={current === "home" ? "page" : undefined}
          className="group flex items-center gap-2.5 font-display text-base tracking-tight text-[var(--color-text)]"
        >
          <span aria-hidden="true" className="relative flex h-3.5 w-7 items-center">
            <span className="h-0.5 w-full bg-[var(--color-text)]" />
            <span className="absolute left-0 h-3.5 w-3.5 rounded-full border-2 border-[var(--color-text)] bg-[var(--color-bg)] transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-3.5" />
          </span>
          NewArrival
        </Link>
        <nav aria-label="Main">
          <Link
            href="/timeline"
            aria-current={current === "timeline" ? "page" : undefined}
            className="-my-2 inline-flex py-3 font-body text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] aria-[current=page]:text-[var(--color-accent)]"
          >
            <span className="link-sweep">
              Your timeline
            </span>
          </Link>
        </nav>
      </div>
      <div aria-hidden="true" className="page-progress absolute inset-x-0 -bottom-px h-0.5 bg-[var(--color-accent)]" />
    </header>
  );
}
