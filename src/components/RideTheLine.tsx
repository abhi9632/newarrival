"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import { rules } from "@/lib/rules";
import { derive, toUtcDays, type Obligation } from "@/lib/derive";
import type { Profile } from "@/lib/profile";
import { ROUTE_LANES, axisT } from "@/components/LiveRoute";

// Priya's first two years, ridden by scroll. Scroll is time: each stop gets an equal share
// of the scroll, holds while its card is read, then travels to the next date.
const PRIYA: Profile = {
  subclass: "500",
  citizenship: "IN",
  state: "VIC",
  arrivalDate: "2026-09-13",
  courseEndDate: "2027-11-26",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function shortDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

function firstSentence(text: string): string {
  const end = text.indexOf(". ");
  return end === -1 ? text : text.slice(0, end + 1);
}

interface Stop {
  date: string;
  // Which lane of the route the stop sits on; arrival starts every lane.
  lane: string | null;
  title: string;
  agency: string;
  body: string;
  source: { href: string; label: string } | null;
}

const laneOf = (module: Obligation["module"]) =>
  ROUTE_LANES.find((lane) => lane.ids.includes(module))?.label ?? null;

const ALL = derive(rules, PRIYA, PRIYA.arrivalDate);

// The same four lanes the hero draws, reduced to what the ride needs: the study span and
// whether anything holds for the whole stay.
const LANES = ROUTE_LANES.map((lane) => {
  const inLane = ALL.filter((o) => lane.ids.includes(o.module));
  const until = inLane.map((o) => o.activeUntil).filter((d): d is string => d !== null).sort().pop() ?? null;
  return { label: lane.label, until, wholeStay: inLane.some((o) => !o.dueDate && !o.activeUntil) };
});

const STOPS: Stop[] = (() => {
  const all = ALL;
  const dated: Stop[] = all
    .filter((o) => o.dueDate)
    .map((o) => ({
      date: o.dueDate!,
      lane: laneOf(o.module),
      title: o.title,
      agency: o.agency,
      body: firstSentence(o.detail),
      source: { href: o.sourceUrl, label: o.instrument },
    }));
  const lifted = all.filter((o) => o.activeUntil === PRIYA.courseEndDate);
  const stops: Stop[] = [
    {
      date: PRIYA.arrivalDate,
      lane: null,
      title: "Arrival day in Victoria",
      agency: "Every clock starts here",
      body: `Student visa 500, Indian citizen, Victoria. From these four facts, ${all.length} obligations across ${
        new Set(all.map((o) => o.agency)).size
      } agencies apply, and every date on this line is counted from this day.`,
      source: null,
    },
    ...dated,
  ];
  if (lifted.length > 0)
    stops.push({
      date: PRIYA.courseEndDate,
      lane: laneOf(lifted[0].module),
      title: "Course ends, study conditions lift",
      agency: lifted[0].agency,
      body: `${lifted.map((o) => o.title).join(" and ")}: both run until the course ends, then fall away.`,
      source: { href: lifted[0].sourceUrl, label: lifted[0].instrument },
    });
  return stops.sort((a, b) => a.date.localeCompare(b.date));
})();

const STOP_DAYS = STOPS.map((stop) => toUtcDays(stop.date));
const ARRIVAL_X = axisT(PRIYA.arrivalDate);

// Scroll share per stop: hold for the first part (time to read the card), then travel.
const HOLD = 0.45;
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function timeAt(progress: number): { days: number; index: number } {
  const segments = STOPS.length - 1;
  const scaled = Math.min(progress, 0.9999) * segments;
  const index = Math.floor(scaled);
  const local = scaled - index;
  const travel = local <= HOLD ? 0 : ease((local - HOLD) / (1 - HOLD));
  const days = STOP_DAYS[index] + (STOP_DAYS[index + 1] - STOP_DAYS[index]) * travel;
  // The card switches halfway through the travel, so the last stop is reachable at the end.
  return { days, index: travel >= 0.5 ? index + 1 : index };
}

function isoOf(days: number): string {
  return new Date(Math.round(days) * 86400000).toISOString().slice(0, 10);
}

export function RideTheLine() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const sceneRef = React.useRef<HTMLDivElement>(null);
  const dateRef = React.useRef<HTMLSpanElement>(null);
  const [active, setActive] = React.useState(0);
  const [passedDays, setPassedDays] = React.useState(STOP_DAYS[0]);

  React.useEffect(() => {
    const section = sectionRef.current;
    const scene = sceneRef.current;
    if (!section || !scene) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Cache geometry on resize; the scroll path only does arithmetic and writes.
    let top = 0;
    let range = 1;
    let frame = 0;
    let lastIndex = -1;
    let lastCrossed = -1;
    const measure = () => {
      top = section.getBoundingClientRect().top + window.scrollY;
      range = Math.max(1, section.offsetHeight - window.innerHeight);
    };
    const update = () => {
      frame = 0;
      const progress = Math.min(1, Math.max(0, (window.scrollY - top) / range));
      const { days, index } = timeAt(progress);
      const iso = isoOf(days);
      scene.style.setProperty("--p", axisT(iso).toFixed(4));
      if (dateRef.current) dateRef.current.textContent = shortDate(iso);
      if (index !== lastIndex) {
        lastIndex = index;
        setActive(index);
      }
      // Only re-render the stops when the head crosses one.
      const crossed = STOP_DAYS.filter((d) => d <= days + 0.5).length;
      if (crossed !== lastCrossed) {
        lastCrossed = crossed;
        setPassedDays(days);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="ride-heading"
      className="ride relative border-t border-[var(--color-border)]"
      style={{ "--stops": STOPS.length } as CSSProperties}
    >
      <div ref={sceneRef} className="ride-scene sticky top-16 flex h-[calc(100svh-4rem)] flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
          <div className="flex items-baseline justify-between gap-6">
            <h2 id="ride-heading" className="font-display text-xl tracking-tight text-[var(--color-text)] md:text-2xl">
              Ride Priya&apos;s line
            </h2>
            <p className="ride-count font-body text-sm tabular-nums text-[var(--color-muted)]">
              Stop <span className="text-[var(--color-text)]">{active + 1}</span> of {STOPS.length}
            </p>
          </div>

          <p aria-hidden="true" className="ride-date mt-4 font-display text-[clamp(3.25rem,12vw,10.5rem)] leading-[0.9] tracking-[-0.04em] tabular-nums text-[var(--color-text)] md:mt-6">
            <span ref={dateRef}>{shortDate(STOPS[0].date)}</span>
          </p>

          {/* The hero's four lanes on the hero's own axis, with scroll as the scrubber. */}
          <div
            aria-hidden="true"
            className="ride-track mt-6 grid grid-cols-[4.5rem_1fr] gap-x-3 md:mt-10 md:grid-cols-[7rem_1fr] md:gap-x-6"
            style={{ "--a": ARRIVAL_X } as CSSProperties}
          >
            {LANES.map((lane) => (
              <React.Fragment key={lane.label}>
                <span className="self-center py-2 font-display text-sm text-[var(--color-muted)] md:py-2.5 md:text-base">{lane.label}</span>
                <div className="relative h-8 md:h-10">
                  <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--color-text)]/70" />
                  {lane.wholeStay && (
                    <div
                      className="absolute right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[var(--color-accent)]/25"
                      style={{ left: `${ARRIVAL_X * 100}%` }}
                    />
                  )}
                  {lane.until && (
                    <div
                      className="absolute top-1/2 h-[5px] -translate-y-1/2 rounded-full bg-[var(--color-accent)]/35"
                      style={{ left: `${ARRIVAL_X * 100}%`, width: `${(axisT(lane.until) - ARRIVAL_X) * 100}%` }}
                    />
                  )}
                  <div className="ride-fill absolute right-0 top-1/2 h-[5px] -translate-y-1/2 rounded-full bg-[var(--color-accent)]" style={{ left: `${ARRIVAL_X * 100}%` }} />
                  {STOPS.map((stop, i) =>
                    stop.lane === lane.label || stop.lane === null ? (
                      <span
                        key={stop.date + stop.title}
                        data-passed={STOP_DAYS[i] <= passedDays + 0.5}
                        className={`ride-stop ride-dot absolute top-1/2 block -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--color-text)] bg-[var(--color-bg)] ${
                          stop.lane === null ? "h-2.5 w-2.5" : "h-3.5 w-3.5"
                        }`}
                        style={{ left: `${axisT(stop.date) * 100}%` }}
                      />
                    ) : null
                  )}
                </div>
              </React.Fragment>
            ))}
            <span />
            <div className="relative h-0">
              {/* One hairline crosses every lane at the current date. */}
              <div className="ride-head pointer-events-none absolute inset-x-0 bottom-0 h-[calc(4*2rem)] md:h-[calc(4*2.5rem)]">
                <span className="absolute inset-y-0 left-0 w-px bg-[var(--color-accent)]" />
                <span className="absolute -top-1.5 left-0 block h-3 w-3 -translate-x-1/2 rounded-full bg-[var(--color-accent)] shadow-[0_0_0_5px_rgb(181_70_31/0.18)]" />
              </div>
            </div>
          </div>

          <ol className="ride-cards mt-6 grid md:mt-10">
            {STOPS.map((stop, i) => (
              <li
                key={stop.date + stop.title}
                data-active={i === active}
                data-past={i < active}
                className="ride-card col-start-1 row-start-1 grid gap-3 md:grid-cols-12 md:gap-8"
              >
                <p className="font-body text-sm text-[var(--color-accent)] md:col-span-3">
                  <span className="ride-card-date block font-display tabular-nums">{shortDate(stop.date)}</span>
                  <span className="text-[var(--color-muted)]">{stop.agency}</span>
                </p>
                <div className="md:col-span-7">
                  <h3 className="font-display text-2xl leading-tight tracking-tight text-[var(--color-text)] md:text-4xl">
                    {stop.title}
                  </h3>
                  <p className="mt-3 max-w-[58ch] font-body text-base leading-relaxed text-[var(--color-muted)]">{stop.body}</p>
                  {stop.source && (
                    <a
                      href={stop.source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={i === active ? undefined : -1}
                      className="mt-3 inline-flex items-baseline gap-1.5 font-body text-sm font-medium text-[var(--color-text)] underline decoration-[var(--color-border)] decoration-1 underline-offset-4 transition-[text-decoration-color] duration-300 hover:decoration-[var(--color-accent)]"
                    >
                      {stop.source.label}
                      <span aria-hidden="true" className="nudge nudge-up text-[var(--color-accent)]">↗</span>
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
