"use client";

import * as React from "react";
import type { CSSProperties, ReactNode } from "react";
import { rules, SUBCLASSES, CITIZENSHIPS, STATES } from "@/lib/rules";
import {
  SUBCLASS_OPTIONS,
  CITIZENSHIP_OPTIONS,
  STATE_OPTIONS,
  type Profile,
} from "@/lib/profile";
import { derive, toUtcDays, type Obligation } from "@/lib/derive";
import { diffObligations } from "@/lib/perturb";

// The landing diagram is Priya's arrival with three switchable facts. Arrival and course
// end stay fixed so every station keeps one position across all eight profiles.
const ARRIVAL = "2026-09-13";
const COURSE_END = "2027-11-26";
const AXIS_START = "2026-09-01";
const AXIS_END = "2028-07-01";

// Work limits are visa conditions (8105), so they ride the visa line.
const MODULES: { ids: Obligation["module"][]; label: string }[] = [
  { ids: ["visa", "work"], label: "Visa" },
  { ids: ["health"], label: "Health" },
  { ids: ["tax"], label: "Tax" },
  { ids: ["tenancy"], label: "Tenancy" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function shortDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

function axisT(iso: string): number {
  const start = toUtcDays(AXIS_START);
  return (toUtcDays(iso) - start) / (toUtcDays(AXIS_END) - start);
}

const ARRIVAL_T = axisT(ARRIVAL);

// A span element starts at arrival and runs to the line's end; this is the scaleX that
// stops it on a given date.
function dateAt(t: number): string {
  const start = toUtcDays(AXIS_START);
  const days = Math.round(start + t * (toUtcDays(AXIS_END) - start));
  return shortDate(new Date(days * 86400000).toISOString().slice(0, 10));
}

function spanScale(iso: string): number {
  return (axisT(iso) - ARRIVAL_T) / (1 - ARRIVAL_T);
}

function profileOf(facts: Pick<Profile, "subclass" | "citizenship" | "state">): Profile {
  return { ...facts, arrivalDate: ARRIVAL, courseEndDate: COURSE_END };
}

// derive's reference date only sets status, which this diagram does not draw. Passing the
// arrival date keeps server and client output identical, so hydration never mismatches.
function deriveFor(profile: Profile): Obligation[] {
  return derive(rules, profile, ARRIVAL);
}

// Every station any of the eight profiles can produce, rendered once and faded in or out,
// so a fact switch is a transition on existing nodes rather than a mount.
const ALL_STATIONS: Obligation[] = (() => {
  const byId = new Map<string, Obligation>();
  for (const subclass of SUBCLASSES)
    for (const citizenship of CITIZENSHIPS)
      for (const state of STATES)
        for (const o of deriveFor(profileOf({ subclass, citizenship, state })))
          if (o.dueDate && !byId.has(o.id)) byId.set(o.id, o);
  return [...byId.values()];
})();

const YEAR_MARKS = ["2027-01-01", "2028-01-01"];

type Facts = Pick<Profile, "subclass" | "citizenship" | "state">;

const FACT_ROWS: {
  key: keyof Facts;
  legend: string;
  options: { value: string; label: string }[];
}[] = [
  {
    key: "subclass",
    legend: "Visa",
    options: SUBCLASS_OPTIONS.map((o) => ({
      value: o.value,
      label: o.value === "500" ? "Student 500" : "Skilled 482",
    })),
  },
  { key: "citizenship", legend: "Citizenship", options: CITIZENSHIP_OPTIONS },
  {
    key: "state",
    legend: "State",
    options: STATE_OPTIONS.map((o) => ({ value: o.value, label: o.value === "NSW" ? "NSW" : o.label })),
  },
];

function describeChange(prev: Obligation[], next: Obligation[], label: string): string {
  const counts = { added: 0, removed: 0, held: 0, moved: 0 };
  for (const change of diffObligations(prev, next)) {
    if (change.kind in counts) counts[change.kind as keyof typeof counts] += 1;
  }
  const parts = [
    counts.removed > 0 ? `${counts.removed} fell away` : null,
    counts.added > 0 ? `${counts.added} appeared` : null,
    `${counts.held + counts.moved} held`,
  ].filter(Boolean);
  return `${label}: ${parts.join(", ")}.`;
}

export function LiveRoute({ headline, lede }: { headline: ReactNode; lede: ReactNode }) {
  const [facts, setFacts] = React.useState<Facts>({ subclass: "500", citizenship: "IN", state: "VIC" });
  const [readout, setReadout] = React.useState<string | null>(null);
  // Pointer scrub: where the hairline sits on the axis, 0 to 1, or null when idle.
  const [scrub, setScrub] = React.useState<number | null>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const frame = React.useRef(0);

  function scrubTo(clientX: number) {
    const track = trackRef.current;
    if (!track) return;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rect = track.getBoundingClientRect();
      setScrub(Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)));
    });
  }

  function endScrub() {
    cancelAnimationFrame(frame.current);
    setScrub(null);
  }

  const obligations = React.useMemo(() => deriveFor(profileOf(facts)), [facts]);
  const present = React.useMemo(() => new Set(obligations.map((o) => o.id)), [obligations]);
  const agencyCount = new Set(obligations.map((o) => o.agency)).size;
  const datedCount = obligations.filter((o) => o.dueDate).length;

  function switchFact(key: keyof Facts, value: string, label: string) {
    if (facts[key] === value) return;
    const next = { ...facts, [key]: value } as Facts;
    setReadout(describeChange(obligations, deriveFor(profileOf(next)), `Switched to ${label}`));
    setFacts(next);
  }

  return (
    <>
      {headline}
      <div className="mt-4 grid gap-5 md:mt-10 md:grid-cols-12 md:items-end md:gap-8">
        <div className="md:col-span-4">{lede}</div>

        <div
          className="fade-up flex flex-col gap-2.5 md:col-span-8 md:grid md:grid-cols-3 md:gap-4"
          style={{ "--delay": "420ms" } as CSSProperties}
        >
          {FACT_ROWS.map((row) => {
            const index = row.options.findIndex((o) => o.value === facts[row.key]);
            return (
              <fieldset
                key={row.key}
                className="grid grid-cols-[5.25rem_1fr] items-center gap-3 max-[359px]:grid-cols-[4.25rem_1fr] max-[359px]:gap-2 md:grid-cols-1 md:gap-2"
              >
                <legend className="float-left font-body text-sm text-[var(--color-muted)] md:mb-2">{row.legend}</legend>
                <div className="relative grid grid-cols-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
                  {/* One thumb slides between the two options instead of two fills swapping. */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-[var(--color-text)] transition-transform duration-300 ease-[var(--ease-in-out)] motion-reduce:transition-none"
                    style={{ transform: `translateX(${index * 100}%)` }}
                  />
                  {row.options.map((option) => (
                    <label key={option.value} className="relative cursor-pointer">
                      <input
                        type="radio"
                        name={`landing-${row.key}`}
                        value={option.value}
                        checked={facts[row.key] === option.value}
                        onChange={() => switchFact(row.key, option.value, option.label)}
                        className="peer sr-only"
                      />
                      <span className="affordance block whitespace-nowrap rounded-full px-2 py-2 text-center font-body text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] peer-checked:text-[var(--color-surface)] peer-checked:hover:text-[var(--color-surface)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--color-accent)] max-[359px]:px-1.5 max-[359px]:text-[13px] md:px-3">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            );
          })}
        </div>
      </div>

      <figure
        data-scrub={scrub !== null}
        onPointerMove={(event) => scrubTo(event.clientX)}
        onPointerDown={(event) => scrubTo(event.clientX)}
        onPointerLeave={endScrub}
        onPointerCancel={endScrub}
        className="route fade-up relative mt-6 touch-pan-y select-none rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-5 pb-6 pt-5 shadow-[0_1px_0_var(--color-border),0_24px_60px_-40px_rgb(33_30_25/0.35)] md:mt-12 md:px-8"
        style={{ "--delay": "240ms" } as CSSProperties}
      >
        {/* The scrub layer covers exactly the dated track column, so pointer x maps onto the axis. */}
        <div
          ref={trackRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-4 left-5 right-5 md:left-[18.5rem] md:right-8"
        >
          {scrub !== null && (
            <div className="route-scrub absolute inset-y-0 w-px bg-[var(--color-accent)]" style={{ left: `${scrub * 100}%` }}>
              <span
                className={`absolute -top-1 whitespace-nowrap rounded-full bg-[var(--color-text)] px-2.5 py-1 font-display text-xs tabular-nums text-[var(--color-surface)] ${
                  scrub > 0.8 ? "right-2" : "left-2"
                }`}
              >
                {dateAt(scrub)}
              </span>
            </div>
          )}
        </div>
        <figcaption className="sr-only">
          Obligations across visa, health, tax and tenancy, placed on a dated line from arrival.
        </figcaption>

        <div className="md:grid md:grid-cols-[15rem_1fr] md:gap-6">
          <div aria-hidden="true" className="hidden md:block" />
          <div aria-hidden="true" className="relative h-7">
            <div className="route-axis absolute inset-x-0 bottom-0 h-2" />
            <span
              className="absolute bottom-3 -ml-1 font-display text-xs text-[var(--color-accent)] md:ml-0 md:-translate-x-1/2"
              style={{ left: `${ARRIVAL_T * 100}%` }}
            >
              Arrive {shortDate(ARRIVAL)}
            </span>
            {YEAR_MARKS.map((mark) => (
              <span
                key={mark}
                className={`absolute bottom-3 -translate-x-1/2 font-display text-xs tabular-nums text-[var(--color-muted)] ${
                  axisT(mark) < 0.3 ? "hidden md:block" : ""
                }`}
                style={{ left: `${axisT(mark) * 100}%` }}
              >
                {mark.slice(0, 4)}
              </span>
            ))}
          </div>
        </div>

        <ol className="mt-2 flex flex-col">
          {MODULES.map((module, lane) => {
            const inLane = obligations.filter((o) => module.ids.includes(o.module));
            const standing = inLane.filter((o) => !o.dueDate);
            const until = inLane
              .map((o) => o.activeUntil)
              .filter((d): d is string => d !== null)
              .sort()
              .pop();
            const laneStations = ALL_STATIONS.filter((s) => module.ids.includes(s.module));
            const hasStation = laneStations.some((s) => present.has(s.id));
            const wholeStay = standing.filter((o) => !o.activeUntil).length;

            return (
              <li
                key={module.label}
                className="grid gap-3 border-t border-[var(--color-border)] py-5 first:border-t-0 md:grid-cols-[15rem_1fr] md:gap-6"
                style={{ "--lane": lane } as CSSProperties}
              >
                <div>
                  <p className="font-display text-base text-[var(--color-text)]">{module.label}</p>
                  <ul className="mt-1.5 flex flex-col gap-1">
                    {standing.map((o) => (
                      <li
                        key={o.id}
                        className="route-fade flex gap-2 font-body text-xs leading-snug text-[var(--color-muted)]"
                      >
                        <span aria-hidden="true" className="mt-[5px] h-px w-2.5 shrink-0 bg-[var(--color-text)]" />
                        <span>
                          {o.title}
                          <span className="sr-only">, {o.agency}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`relative ${hasStation ? "h-24 md:h-20" : "h-6"}`}>
                  <div className="route-line absolute inset-x-0 top-3 h-0.5 bg-[var(--color-text)]" />
                  {/* Both spans start at arrival. Solid: conditions that end on a date.
                      Thin: conditions that hold for the whole stay, run off the line's end. */}
                  <div
                    className="route-span absolute right-0 top-[10.5px] h-[5px] rounded-l-full bg-[var(--color-accent)] opacity-70"
                    style={{ left: `${ARRIVAL_T * 100}%`, "--span": wholeStay > 0 ? 1 : 0 } as CSSProperties}
                  />
                  <div
                    className="route-span absolute right-0 top-[9px] h-2 rounded-full bg-[var(--color-accent)]"
                    style={{ left: `${ARRIVAL_T * 100}%`, "--span": until ? spanScale(until) : 0 } as CSSProperties}
                  />
                  {wholeStay > 0 && (
                    <span
                      key={`${module.label}-${wholeStay}`}
                      className="route-fade absolute right-0 top-5 hidden font-body text-xs text-[var(--color-accent)] md:block"
                    >
                      {wholeStay} {wholeStay === 1 ? "condition" : "conditions"} for the whole stay
                    </span>
                  )}
                  {until && (
                    <span
                      className="route-fade absolute top-6 hidden -translate-x-full pr-1 font-body text-xs text-[var(--color-accent)] md:block"
                      style={{ left: `${axisT(until) * 100}%` }}
                    >
                      Study conditions end {shortDate(until)}
                    </span>
                  )}
                  {laneStations.map((station) => {
                    const t = axisT(station.dueDate!);
                    const on = present.has(station.id);
                    const alignEnd = t > 0.6;
                    return (
                      <div
                        key={station.id}
                        data-on={on}
                        data-passed={scrub !== null && on && t <= scrub}
                        aria-hidden={!on}
                        className="route-station absolute top-0"
                        style={{ left: `${t * 100}%`, "--t": t } as CSSProperties}
                      >
                        <span className="route-dot absolute left-0 top-3 block h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--color-text)] bg-[var(--color-surface)]" />
                        <span
                          className={`route-label absolute top-6 block w-[7rem] md:w-48 ${
                            alignEnd ? "right-0 text-right" : "left-0 -ml-1.5"
                          }`}
                        >
                          <span className="block font-display text-sm tabular-nums text-[var(--color-text)]">
                            {shortDate(station.dueDate!)}
                          </span>
                          <span className="block font-body text-xs leading-snug text-[var(--color-muted)]">
                            {station.title}
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ol>
      </figure>

      <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <p aria-live="polite" className="font-body text-sm text-[var(--color-muted)]">
          <span className="font-medium text-[var(--color-text)]">
            {obligations.length} obligations across {agencyCount} agencies, {datedCount} with a date.
          </span>{" "}
          {readout ?? "Switch a fact above and watch what moves. Run a pointer along the line to read any date."}
        </p>
        <a
          href="/timeline"
          className="affordance inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-[var(--color-accent)] bg-[var(--color-accent)] px-7 py-3 font-body text-base font-medium text-[var(--color-surface)] hover:border-[var(--color-text)] hover:bg-[var(--color-text)]"
        >
          Build your full timeline
          <span aria-hidden="true" className="nudge">→</span>
        </a>
      </div>
    </>
  );
}
