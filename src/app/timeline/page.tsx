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
import { ObligationCard } from "@/components/ObligationCard";
import { WhatIfRail } from "@/components/WhatIfRail";

type ViewTransitionCapableDocument = {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

// ponytail: a build viewed across local midnight re-renders with the new date on the
// client; this is the only clock read in the app, which is what keeps the negative
// grep on src/lib/derive.ts meaningful.
function todayIso(): string {
  return new Date().toLocaleDateString("en-CA");
}

const CONTROL_CLASS =
  "affordance mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 font-body text-sm text-[var(--color-text)] hover:border-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]";
const LABEL_CLASS = "font-body text-sm font-medium text-[var(--color-text)]";

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
  const urgentCount = obligations.filter(
    (obligation) => obligation.status === "overdue" || obligation.status === "due-soon"
  ).length;

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
    <main className="mx-auto w-full max-w-4xl px-6 py-16 md:px-8 md:py-20">
      <h1 className="font-display text-3xl text-[var(--color-text)]">Your timeline</h1>

      <section aria-labelledby="examples-heading" className="mt-8">
        <h2 id="examples-heading" className={LABEL_CLASS}>
          Load a worked example
        </h2>
        <div className="mt-3 flex flex-wrap gap-3">
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
                className="affordance rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 py-2 font-body text-sm font-medium text-[var(--color-text)] aria-pressed:border-[var(--color-accent)] aria-pressed:text-[var(--color-accent)] hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              >
                {example.label}
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="facts-heading" className="mt-8 grid gap-4 sm:grid-cols-2">
        <h2 id="facts-heading" className="sr-only">
          Your four facts
        </h2>

        <div>
          <label htmlFor="subclass" className={LABEL_CLASS}>
            Visa subclass
          </label>
          <select
            id="subclass"
            value={profile.subclass}
            onChange={(event) =>
              updateProfile({ subclass: event.target.value as Profile["subclass"] })
            }
            className={CONTROL_CLASS}
          >
            {SUBCLASS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="citizenship" className={LABEL_CLASS}>
            Citizenship
          </label>
          <select
            id="citizenship"
            value={profile.citizenship}
            onChange={(event) =>
              updateProfile({ citizenship: event.target.value as Profile["citizenship"] })
            }
            className={CONTROL_CLASS}
          >
            {CITIZENSHIP_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

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

        <div>
          <label htmlFor="state" className={LABEL_CLASS}>
            State
          </label>
          <select
            id="state"
            value={profile.state}
            onChange={(event) => updateProfile({ state: event.target.value as Profile["state"] })}
            className={CONTROL_CLASS}
          >
            {STATE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

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
        <h2 id="dated-heading" className="font-display text-xl text-[var(--color-text)]">
          Your dated timeline
        </h2>
        <p className="mt-2 font-body text-sm text-[var(--color-muted)]">
          {urgentCount} of {obligations.length} obligations are overdue or due soon.
        </p>
        <ol className="mt-6 flex flex-col gap-6 border-l-2 border-[var(--color-accent)] pl-6">
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
        <h2 id="standing-heading" className="font-display text-xl text-[var(--color-text)]">
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
    </main>
  );
}
