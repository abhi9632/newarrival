"use client";

import * as React from "react";
import { rules } from "@/lib/rules";
import {
  EXAMPLE_PROFILES,
  SUBCLASS_OPTIONS,
  CITIZENSHIP_OPTIONS,
  STATE_OPTIONS,
  type Profile,
} from "@/lib/profile";
import { derive, addMonths } from "@/lib/derive";
import { diffObligations, summariseCascade } from "@/lib/perturb";
import { ObligationCard, STATUS_CLASS, STATUS_LABEL, formatDate, relativePhrase } from "@/components/ObligationCard";
import { WhatIfRail } from "@/components/WhatIfRail";
import { SiteHeader } from "@/components/SiteHeader";
import { haptic } from "@/lib/haptics";

type ViewTransitionCapableDocument = {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

// ponytail: a build viewed across local midnight re-renders with the new date on the
// client; this is the only clock read in the app, which is what keeps the negative
// grep on src/lib/derive.ts meaningful.
function todayIso(): string {
  return new Date().toLocaleDateString("en-CA");
}

// Native date input kept for its picker and accessibility, dressed in the switch's chip language.
const CONTROL_CLASS =
  "affordance mt-1 w-full rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-[7px] font-body text-sm font-medium tabular-nums text-[var(--color-text)] hover:border-[var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100";
const LABEL_CLASS = "font-body text-sm font-medium text-[var(--color-text)]";

// Same two-way switch as the landing page: every fact in scope has exactly two values.
function FactSwitch<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
}: {
  name: string;
  legend: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  const index = options.findIndex((o) => o.value === value);
  return (
    <fieldset>
      <legend className={LABEL_CLASS}>{legend}</legend>
      <div className="relative mt-1 grid grid-cols-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-[var(--color-text)] transition-transform duration-300 ease-[var(--ease-in-out)] motion-reduce:transition-none"
          style={{ transform: `translateX(${index * 100}%)` }}
        />
        {options.map((option) => (
          <label key={option.value} className="relative cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => {
                haptic("tap");
                onChange(option.value);
              }}
              className="peer sr-only"
            />
            <span className="affordance block truncate rounded-full px-3 py-2 text-center font-body text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] peer-checked:text-[var(--color-surface)] peer-checked:hover:text-[var(--color-surface)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--color-accent)]">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const SHORT_SUBCLASS = SUBCLASS_OPTIONS.map((o) => ({
  value: o.value,
  label: o.value === "500" ? "Student 500" : "Skilled 482",
}));

export default function TimelinePage() {
  const [profile, setProfile] = React.useState<Profile>(EXAMPLE_PROFILES[0].profile);
  const [today] = React.useState(todayIso);
  const [offsetMonths, setOffsetMonths] = React.useState(0);
  const cascadeInFlight = React.useRef(false);

  const baseline = React.useMemo(() => derive(rules, profile, today), [profile, today]);

  const perturbedProfile = React.useMemo(
    () =>
      offsetMonths === 0
        ? profile
        : { ...profile, courseEndDate: addMonths(profile.courseEndDate, offsetMonths) },
    [profile, offsetMonths]
  );
  const obligations = React.useMemo(
    () => (offsetMonths === 0 ? baseline : derive(rules, perturbedProfile, today)),
    [offsetMonths, baseline, perturbedProfile, today]
  );
  const changes = React.useMemo(
    () => (offsetMonths === 0 ? [] : diffObligations(baseline, obligations)),
    [offsetMonths, baseline, obligations]
  );
  const changeById = React.useMemo(() => new Map(changes.map((change) => [change.id, change])), [changes]);
  const cascadeSummary = React.useMemo(
    () => (changes.length > 0 ? summariseCascade(changes) : null),
    [changes]
  );

  const needsCourseEnd = baseline.some((obligation) => obligation.anchor === "courseEnd");
  const dated = obligations.filter((obligation) => obligation.dueDate !== null);
  const standing = obligations.filter((obligation) => obligation.dueDate === null);
  const agencyCount = new Set(obligations.map((obligation) => obligation.agency)).size;
  const urgentCount = obligations.filter(
    (obligation) => obligation.status === "overdue" || obligation.status === "due-soon"
  ).length;
  const next = dated[0] ?? null;

  function updateProfile(patch: Partial<Profile>) {
    setProfile((prev) => ({ ...prev, ...patch }));
    setOffsetMonths(0);
  }

  function loadPreset(preset: Profile) {
    setProfile(preset);
    setOffsetMonths(0);
  }

  function runCascade(nextOffsetMonths: number) {
    if (typeof window === "undefined") {
      setOffsetMonths(nextOffsetMonths);
      return;
    }

    const applyUpdate = () => setOffsetMonths(nextOffsetMonths);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as unknown as ViewTransitionCapableDocument;

    if (cascadeInFlight.current || prefersReducedMotion || !doc.startViewTransition) {
      applyUpdate();
      return;
    }

    cascadeInFlight.current = true;
    const transition = doc.startViewTransition(applyUpdate);
    transition.finished.finally(() => {
      cascadeInFlight.current = false;
    });
  }

  return (
    <>
      <SiteHeader current="timeline" />
      <main className="mx-auto w-full max-w-[1800px] px-6 py-14 md:px-8 md:py-20 xl:grid xl:grid-cols-[minmax(0,56rem)_18rem] xl:justify-center xl:gap-16 2xl:grid-cols-[minmax(0,56rem)_20rem] 2xl:gap-24">
      <div className="w-full max-w-4xl xl:max-w-none">
        <h1 className="font-display text-[clamp(2.6rem,6vw,4.5rem)] leading-[0.98] tracking-[-0.035em] text-[var(--color-text)]">
          <span className="mask-line">
            <span>
              Your <span className="text-[var(--color-accent)]">timeline</span>
            </span>
          </span>
        </h1>
        <p className="fade-up mt-4 max-w-[52ch] font-body text-lg leading-relaxed text-[var(--color-muted)]" style={{ "--delay": "200ms" } as React.CSSProperties}>
          Four facts in, every dated obligation out, each one linked to the rule it comes from.
        </p>

        <dl
          aria-live="polite"
          className="fade-up mt-8 grid grid-cols-3 border-y border-[var(--color-border)] md:mt-10"
          style={{ "--delay": "300ms" } as React.CSSProperties}
        >
          {[
            { label: "Obligations", value: obligations.length },
            { label: "With a date", value: dated.length },
            { label: "Agencies", value: agencyCount },
          ].map((stat) => (
            <div key={stat.label} className="border-l border-[var(--color-border)] py-4 pl-4 first:border-l-0 first:pl-0 md:py-5">
              <dt className="font-body text-xs text-[var(--color-muted)] md:text-sm">{stat.label}</dt>
              <dd className="mt-1 font-display text-4xl leading-none tracking-tight tabular-nums text-[var(--color-text)] md:text-6xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 md:p-6">
        <section aria-labelledby="examples-heading" className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <h2 id="examples-heading" className="font-body text-sm text-[var(--color-muted)]">
            Load a worked example
          </h2>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_PROFILES.map((example) => {
              const fields = Object.keys(example.profile) as (keyof Profile)[];
              const isLoaded = fields.every((field) => example.profile[field] === profile[field]);
              return (
                <button
                  key={example.id}
                  type="button"
                  data-profile-preset={example.id}
                  aria-pressed={isLoaded}
                  onClick={() => loadPreset(example.profile)}
                  className="affordance rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 font-body text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-text)] aria-pressed:border-[var(--color-accent)] aria-pressed:bg-[var(--color-accent)] aria-pressed:text-[var(--color-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                >
                  {example.label}
                </button>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="facts-heading" className="mt-5 grid gap-4 border-t border-[var(--color-border)] pt-5 sm:grid-cols-2 md:grid-cols-3">
          <h2 id="facts-heading" className="sr-only">
            Your four facts
          </h2>

          <FactSwitch
            name="subclass"
            legend="Visa subclass"
            options={SHORT_SUBCLASS}
            value={profile.subclass}
            onChange={(value) => updateProfile({ subclass: value })}
          />

          <FactSwitch
            name="citizenship"
            legend="Citizenship"
            options={CITIZENSHIP_OPTIONS}
            value={profile.citizenship}
            onChange={(value) => updateProfile({ citizenship: value })}
          />

          <div>
            <label htmlFor="arrivalDate" className={LABEL_CLASS}>
              Arrival date
            </label>
            <input
              id="arrivalDate"
              type="date"
              value={profile.arrivalDate}
              onChange={(event) => updateProfile({ arrivalDate: event.target.value })}
              className={CONTROL_CLASS}
            />
          </div>

          <FactSwitch
            name="state"
            legend="State"
            options={STATE_OPTIONS}
            value={profile.state}
            onChange={(value) => updateProfile({ state: value })}
          />

          {needsCourseEnd && (
            <div>
              <label htmlFor="courseEndDate" className={LABEL_CLASS}>
                Course end date
              </label>
              <input
                id="courseEndDate"
                type="date"
                value={profile.courseEndDate}
                onChange={(event) => updateProfile({ courseEndDate: event.target.value })}
                className={CONTROL_CLASS}
              />
            </div>
          )}
        </section>
        </div>

        {needsCourseEnd && (
          <WhatIfRail
            courseEndDate={profile.courseEndDate}
            committedOffsetMonths={offsetMonths}
            totals={cascadeSummary ? { moved: cascadeSummary.moved, agencies: cascadeSummary.agencies.length } : null}
            onCommit={runCascade}
            onReset={() => runCascade(0)}
          />
        )}

        <section aria-labelledby="dated-heading" className="mt-10">
          <h2 id="dated-heading" className="font-display text-3xl tracking-tight text-[var(--color-text)]">
            Your dated timeline
          </h2>
          <p className="mt-2 font-body text-sm text-[var(--color-muted)]">
            {urgentCount} of {obligations.length} obligations are overdue or due soon.
          </p>
          <ol className="relative mt-6 flex flex-col gap-6 border-l-2 border-[var(--color-border)] pl-6">
            {/* The rail fills in terracotta as the reader travels down it. */}
            <span aria-hidden="true" className="rail-fill absolute -left-0.5 top-0 h-full w-0.5 bg-[var(--color-accent)]" />
            {dated.map((obligation, index) => (
              <li key={obligation.id} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-6 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-accent)]"
                />
                <ObligationCard
                  obligation={obligation}
                  change={changeById.get(obligation.id) ?? null}
                  cascadeIndex={index}
                />
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="standing-heading" className="mt-10">
          <h2 id="standing-heading" className="font-display text-3xl tracking-tight text-[var(--color-text)]">
            Standing conditions for your whole stay
          </h2>
          <ul className="mt-6 flex flex-col gap-6">
            {standing.map((obligation, index) => (
              <li key={obligation.id}>
                <ObligationCard
                  obligation={obligation}
                  change={changeById.get(obligation.id) ?? null}
                  cascadeIndex={index}
                />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="mt-14 hidden xl:mt-0 xl:block">
        <div className="sticky top-24 flex flex-col gap-6">
          {next && (
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <p className="font-body text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
                Next obligation
              </p>
              <p
                className={`mt-3 inline-flex items-center rounded-full border px-3 py-1 font-body text-xs font-medium uppercase tracking-wide ${STATUS_CLASS[next.status]}`}
              >
                {STATUS_LABEL[next.status]}
              </p>
              <h3 className="mt-3 font-display text-lg leading-snug text-[var(--color-text)]">{next.title}</h3>
              <p className="mt-1 font-body text-sm text-[var(--color-muted)]">
                {next.dueDate && formatDate(next.dueDate)}
                {relativePhrase(next.daysUntilDue) ? ` · ${relativePhrase(next.daysUntilDue)}` : null}
              </p>
            </div>
          )}

          {needsCourseEnd && (
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <p className="font-body text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
                Course ends
              </p>
              <h3 className="mt-3 font-display text-lg leading-snug text-[var(--color-text)]">
                {formatDate(perturbedProfile.courseEndDate)}
              </h3>
              <p className="mt-1 font-body text-sm text-[var(--color-muted)]">
                {offsetMonths === 0 ? "Your enrolment end date" : `${offsetMonths > 0 ? "+" : ""}${offsetMonths} ${Math.abs(offsetMonths) === 1 ? "month" : "months"} from your enrolment end date`}
              </p>
            </div>
          )}

          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <p className="font-body text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
              This line
            </p>
            <h3 className="mt-3 font-display text-lg leading-snug text-[var(--color-text)]">
              {dated.length} dated, {standing.length} standing
            </h3>
            <p className="mt-1 font-body text-sm text-[var(--color-muted)]">
              Across {agencyCount} {agencyCount === 1 ? "agency" : "agencies"}
            </p>
          </div>
        </div>
      </aside>
      </main>
    </>
  );
}
