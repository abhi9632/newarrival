"use client";

import { useState } from "react";
import { rules } from "@/lib/rules";
import { EXAMPLE_PROFILES } from "@/lib/profile";
import { derive } from "@/lib/derive";

// ponytail: a build viewed across local midnight re-renders with the new date on the
// client; this is the only clock read in the app, which is what keeps the negative
// grep on src/lib/derive.ts meaningful.
function todayIso(): string {
  return new Date().toLocaleDateString("en-CA");
}

export default function TimelinePage() {
  const [profile] = useState(EXAMPLE_PROFILES[0].profile);
  const [today] = useState(todayIso);

  const obligations = derive(rules, profile, today);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16 md:px-8 md:py-20">
      <h1 className="font-display text-3xl text-[var(--color-text)]">Your timeline</h1>
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
