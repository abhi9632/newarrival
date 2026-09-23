import type { CSSProperties } from "react";
import Link from "next/link";
import { rules } from "@/lib/rules";
import { LiveRoute } from "@/components/LiveRoute";
import { RideTheLine } from "@/components/RideTheLine";
import { SiteHeader } from "@/components/SiteHeader";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function longDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

// One row per agency, straight from the corpus: how many rules it contributes, and where
// the first of them is published.
const SOURCES = [...new Set(rules.map((r) => r.agency))]
  .map((agency) => {
    const own = rules.filter((r) => r.agency === agency);
    return { agency, count: own.length, href: own[0].sourceUrl };
  })
  .sort((a, b) => b.count - a.count);

const CHECKED = [...new Set(rules.map((r) => r.verifiedOn))].sort();

const HEADLINE = ["Four facts decide", "every deadline you", "have in Australia."];

export default function Home() {
  return (
    <>
      <SiteHeader current="home" />
      <main className="flex flex-col">
        <div className="mx-auto w-full max-w-6xl px-6 pt-7 pb-20 md:px-8 md:pt-12 md:pb-28">
          <LiveRoute
            headline={
              <h1 className="font-display text-[clamp(2rem,5vw,4.25rem)] leading-[0.98] tracking-[-0.035em] text-[var(--color-text)]">
                {HEADLINE.map((line, i) => (
                  <span key={line} className="mask-line" style={{ "--i": i } as CSSProperties}>
                    <span>
                      {i === 1 ? (
                        <>
                          every <span className="text-[var(--color-accent)]">deadline</span> you
                        </>
                      ) : (
                        line
                      )}
                    </span>
                  </span>
                ))}
              </h1>
          }
          lede={
              <p
                className="fade-up max-w-[40ch] font-body text-base leading-relaxed md:text-lg text-[var(--color-muted)]"
                style={{ "--delay": "320ms" } as CSSProperties}
              >
                Visa, citizenship, arrival and state set your obligations across four agencies.
                Change one and see what moves.
              </p>
            }
          />
        </div>

        <RideTheLine />

        <section aria-labelledby="sources-heading" className="relative border-t border-[var(--color-border)] bg-[var(--color-surface)]">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-6 top-20 hidden font-body text-xs uppercase tracking-[0.2em] text-[var(--color-muted)] xl:block xl:left-10 2xl:left-16"
            style={{ writingMode: "vertical-rl" }}
          >
            03 / Sources
          </span>
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 md:grid-cols-12 md:gap-8 md:px-8 md:py-32 2xl:max-w-[1440px]">
            <div data-reveal className="md:col-span-5">
              <p className="font-display text-[clamp(5rem,14vw,11rem)] leading-[0.8] tracking-[-0.05em] tabular-nums text-[var(--color-accent)]">
                {rules.length}
              </p>
              <h2 id="sources-heading" className="mt-6 max-w-[16ch] font-display text-3xl leading-tight tracking-tight text-[var(--color-text)] md:text-4xl">
                Every stop names the rule behind it.
              </h2>
              <p className="mt-4 max-w-[44ch] font-body text-base leading-relaxed text-[var(--color-muted)]">
                Each obligation links to the legal instrument or agency page it comes from, with
                the date it was last checked. No personal identifiers, only the four facts.
              </p>
              <p className="mt-6 font-body text-sm text-[var(--color-text)]">
                {rules.length} rules,{" "}
                {CHECKED.length === 1 ? "every one checked against its source on" : "last checked against their sources on"}{" "}
                {longDate(CHECKED[CHECKED.length - 1])}.
              </p>
            </div>

            <ul data-reveal className="self-end md:col-span-6 md:col-start-7">
              {SOURCES.map((source) => (
                <li key={source.agency} className="border-b border-[var(--color-border)] first:border-t">
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="source-row grid grid-cols-[1fr_auto_auto] items-baseline gap-x-4 py-5"
                  >
                    <span className="source-name font-display text-lg text-[var(--color-text)] md:text-xl">{source.agency}</span>
                    <span className="font-body text-sm tabular-nums text-[var(--color-muted)]">
                      {source.count} {source.count === 1 ? "rule" : "rules"}
                    </span>
                    <span aria-hidden="true" className="nudge nudge-up text-[var(--color-accent)]">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="close-heading" className="relative bg-[var(--color-text)] text-[var(--color-surface)]">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-6 top-20 hidden font-body text-xs uppercase tracking-[0.2em] text-[var(--color-surface)]/50 xl:block xl:right-10 2xl:right-16"
            style={{ writingMode: "vertical-rl" }}
          >
            04 / Your line
          </span>
          <div className="mx-auto w-full max-w-6xl px-6 pt-20 pb-10 md:px-8 md:pt-32 2xl:max-w-[1440px]">
            <div data-reveal className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
              <h2 id="close-heading" className="max-w-[14ch] font-display text-[clamp(2.4rem,6vw,5rem)] leading-[0.98] tracking-[-0.035em]">
                Your line starts the day you <span className="text-[var(--color-accent-on-ink)]">land.</span>
              </h2>
              <Link
                href="/timeline"
                className="affordance inline-flex min-h-12 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[var(--color-surface)] px-7 py-3 font-body text-base font-medium text-[var(--color-text)] hover:bg-[var(--color-accent)] hover:text-[var(--color-surface)] md:self-auto"
              >
                Build your full timeline
                <span aria-hidden="true" className="nudge">→</span>
              </Link>
            </div>
            <div
              aria-hidden="true"
              className="relative mt-16 h-3 md:mt-24 xl:relative xl:left-1/2 xl:right-1/2 xl:-mx-[50vw] xl:w-screen xl:px-10 2xl:px-16"
            >
              <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-[var(--color-surface)]/30 xl:inset-x-10 2xl:inset-x-16" />
              <span className="absolute left-0 top-0 h-3 w-3 rounded-full bg-[var(--color-accent-on-ink)] xl:left-10 2xl:left-16" />
              <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-[var(--color-surface)]/50 bg-[var(--color-text)] xl:right-10 2xl:right-16" />
            </div>
            <footer className="mt-8 grid gap-4 md:grid-cols-12">
              <p className="font-display text-base md:col-span-3">NewArrival</p>
              <p className="max-w-[80ch] font-body text-sm leading-relaxed text-[var(--color-surface)]/70 md:col-span-9">
                NewArrival is not migration advice and not legal advice. It shows published rules and computes dates from them. Only a registered migration agent or an Australian legal practitioner can advise on your individual circumstances.
              </p>
            </footer>
          </div>
        </section>
      </main>
    </>
  );
}
