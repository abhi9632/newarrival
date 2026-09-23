import type { Obligation, ObligationStatus } from "./derive";

export type ObligationChangeKind = "added" | "removed" | "moved" | "restatused" | "held";

export interface ObligationChange {
  id: string;
  agency: string;
  kind: ObligationChangeKind;
  fromDate: string | null;
  toDate: string | null;
  deltaDays: number | null;
  fromStatus: ObligationStatus | null;
  toStatus: ObligationStatus | null;
}

export interface CascadeSummary {
  moved: number;
  restatused: number;
  held: number;
  agencies: string[];
}

// Local day arithmetic, duplicated from derive.ts rather than imported: this file must
// keep zero runtime imports so scripts/check-cascade.mjs can load it under plain Node
// with type stripping and no bundler.
function daysBetween(fromIso: string, toIso: string): number {
  const [fy, fm, fd] = fromIso.split("-").map(Number);
  const [ty, tm, td] = toIso.split("-").map(Number);
  return (Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86400000;
}

function effectiveDate(obligation: Obligation): string | null {
  return obligation.dueDate ?? obligation.activeUntil ?? null;
}

export function diffObligations(before: Obligation[], after: Obligation[]): ObligationChange[] {
  const beforeById = new Map(before.map((obligation) => [obligation.id, obligation]));
  const afterById = new Map(after.map((obligation) => [obligation.id, obligation]));

  const changes: ObligationChange[] = [];

  for (const obligation of after) {
    const previous = beforeById.get(obligation.id);
    if (!previous) {
      changes.push({
        id: obligation.id,
        agency: obligation.agency,
        kind: "added",
        fromDate: null,
        toDate: effectiveDate(obligation),
        deltaDays: null,
        fromStatus: null,
        toStatus: obligation.status,
      });
      continue;
    }

    const fromDate = effectiveDate(previous);
    const toDate = effectiveDate(obligation);

    if (fromDate !== toDate) {
      changes.push({
        id: obligation.id,
        agency: obligation.agency,
        kind: "moved",
        fromDate,
        toDate,
        deltaDays: fromDate !== null && toDate !== null ? daysBetween(fromDate, toDate) : null,
        fromStatus: previous.status,
        toStatus: obligation.status,
      });
      continue;
    }

    if (previous.status !== obligation.status) {
      changes.push({
        id: obligation.id,
        agency: obligation.agency,
        kind: "restatused",
        fromDate,
        toDate,
        deltaDays: null,
        fromStatus: previous.status,
        toStatus: obligation.status,
      });
      continue;
    }

    changes.push({
      id: obligation.id,
      agency: obligation.agency,
      kind: "held",
      fromDate,
      toDate,
      deltaDays: null,
      fromStatus: previous.status,
      toStatus: obligation.status,
    });
  }

  for (const obligation of before) {
    if (!afterById.has(obligation.id)) {
      changes.push({
        id: obligation.id,
        agency: obligation.agency,
        kind: "removed",
        fromDate: effectiveDate(obligation),
        toDate: null,
        deltaDays: null,
        fromStatus: obligation.status,
        toStatus: null,
      });
    }
  }

  return changes;
}

export function summariseCascade(changes: ObligationChange[]): CascadeSummary {
  let moved = 0;
  let restatused = 0;
  let held = 0;
  const agencies = new Set<string>();

  for (const change of changes) {
    agencies.add(change.agency);
    if (change.kind === "moved") moved += 1;
    else if (change.kind === "restatused") restatused += 1;
    else if (change.kind === "held") held += 1;
  }

  return { moved, restatused, held, agencies: [...agencies].sort() };
}
