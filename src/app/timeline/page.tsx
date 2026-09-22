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
import { derive } from "@/lib/derive";

// ponytail: a build viewed across local midnight re-renders with the new date on the
// client; this is the only clock read in the app, which is what keeps the negative
// grep on src/lib/derive.ts meaningful.
function todayIso(): string {
  return new Date().toLocaleDateString("en-CA");
}

const CONTROL_CLASS =
  "mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 font-body text-sm text-[var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]";
const LABEL_CLASS = "font-body text-sm font-medium text-[var(--color-text)]";

export default function TimelinePage() {
  const [profile, setProfile] = React.useState<Profile>(EXAMPLE_PROFILES[0].profile);
  const [today] = React.useState(todayIso);

  const obligations = React.useMemo(() => derive(rules, profile, today), [profile, today]);
  const needsCourseEnd = obligations.some((obligation) => obligation.anchor === "courseEnd");

  function updateProfile(patch: Partial<Profile>) {
    setProfile((prev) => ({ ...prev, ...patch }));
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16 md:px-8 md:py-20">
      <h1 className="font-display text-3xl text-[var(--color-text)]">Your timeline</h1>

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

      <ul className="mt-8 flex flex-col gap-4">
        {obligations.map((obligation) => (
          <li
            key={obligation.id}
            data-obligation-id={obligation.id}
            className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
          >
            <p className="font-display text-base text-[var(--color-text)]">{obligation.title}</p>
            <p className="mt-1 font-body text-sm text-[var(--color-muted)]">{obligation.agency}</p>
            <p className="mt-1 font-body text-sm text-[var(--color-muted)]">
              {obligation.dueDate ?? "Standing condition"}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
