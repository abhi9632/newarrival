"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { pressPulse } from "@/lib/pressPulse";

const MIN_OFFSET_MONTHS = -12;
const MAX_OFFSET_MONTHS = 12;

export { MAX_OFFSET_MONTHS };

// Local date arithmetic rather than an import from lib/derive: this component takes
// its inputs as props and stays free of any dependency outside react, matching the
// zero new dependency stance for the native range control.
function shiftMonths(iso: string, months: number): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1 + months, day)).toISOString().slice(0, 10);
}

interface CascadeTotals {
  moved: number;
  agencies: number;
}

interface WhatIfRailProps {
  courseEndDate: string;
  committedOffsetMonths: number;
  totals: CascadeTotals | null;
  onCommit: (offsetMonths: number) => void;
  onReset: () => void;
  onDraftChange?: (offsetMonths: number) => void;
}

export function WhatIfRail({
  courseEndDate,
  committedOffsetMonths,
  totals,
  onCommit,
  onReset,
  onDraftChange,
}: WhatIfRailProps) {
  const [draftOffset, setDraftOffset] = React.useState(committedOffsetMonths);
  const rangeRef = React.useRef<HTMLInputElement>(null);
  const prevOffsetRef = React.useRef(committedOffsetMonths);

  React.useEffect(() => {
    setDraftOffset(committedOffsetMonths);
    prevOffsetRef.current = committedOffsetMonths;
    onDraftChange?.(committedOffsetMonths);
  }, [committedOffsetMonths, onDraftChange]);

  function commit() {
    onCommit(draftOffset);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const next = Number(event.target.value);
    if (next !== prevOffsetRef.current) {
      if (!haptic("tick")) pressPulse(rangeRef.current);
      prevOffsetRef.current = next;
    }
    setDraftOffset(next);
    onDraftChange?.(next);
  }

  function handleReset() {
    haptic("success");
    onReset();
  }

  // Easter egg: dragging all the way to the maximum offset reveals Priya's line
  // reaching a graduation marker. Reversible by dragging back or pressing Escape.
  const atMax = draftOffset === MAX_OFFSET_MONTHS;
  const eggFiredRef = React.useRef(false);

  React.useEffect(() => {
    if (atMax && !eggFiredRef.current) {
      haptic("success");
      eggFiredRef.current = true;
    } else if (!atMax) {
      eggFiredRef.current = false;
    }
  }, [atMax]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape" && atMax) {
      const next = MAX_OFFSET_MONTHS - 1;
      setDraftOffset(next);
      onDraftChange?.(next);
      onCommit(next);
    }
  }

  const readoutDate = shiftMonths(courseEndDate, draftOffset);

  return (
    <section
      aria-labelledby="whatif-heading"
      className="mt-10 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
    >
      <h2 id="whatif-heading" className="font-display text-lg text-[var(--color-text)]">
        Move your course end date
      </h2>
      <p className="mt-1 font-body text-sm text-[var(--color-muted)]">
        Drag to see which obligations recompute and which stay fixed.
      </p>

      <div className="mt-4 flex flex-col gap-2">
        <label htmlFor="course-end-offset" className="font-body text-sm font-medium text-[var(--color-text)]">
          New course end date: {readoutDate}
        </label>
        <input
          ref={rangeRef}
          id="course-end-offset"
          type="range"
          min={MIN_OFFSET_MONTHS}
          max={MAX_OFFSET_MONTHS}
          step={1}
          value={draftOffset}
          onChange={handleChange}
          onPointerUp={commit}
          onKeyUp={commit}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          className="affordance w-full accent-[var(--color-accent)]"
        />
      </div>

      {/* The reveal lives on the dated timeline's own rail, in its visual language. This
          announces it for screen reader users who may not reach that rail right away. */}
      <p aria-live="polite" className="sr-only">
        {atMax ? "Priya's line reaches graduation. Every dated obligation resettles around her, on time." : ""}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleReset}
          disabled={committedOffsetMonths === 0}
          className="affordance rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 py-2 font-body text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reset to your original date
        </button>

        {totals && (
          <p aria-live="polite" className="font-body text-sm text-[var(--color-text)]">
            {totals.moved} obligation{totals.moved === 1 ? "" : "s"} moved, across {totals.agencies}{" "}
            agenc{totals.agencies === 1 ? "y" : "ies"}.
          </p>
        )}
      </div>
    </section>
  );
}
