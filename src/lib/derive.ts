import type { RuleRecord } from "./rules";
import type { Profile } from "./profile";

export const DUE_SOON_DAYS = 7;

export type ObligationStatus = "overdue" | "due-soon" | "upcoming" | "standing";

export interface Obligation {
  id: string;
  module: RuleRecord["module"];
  title: string;
  detail: string;
  agency: string;
  instrument: string;
  sourceUrl: string;
  verifiedOn: string;
  anchor: RuleRecord["due"]["anchor"];
  dueDate: string | null;
  status: ObligationStatus;
  daysUntilDue: number | null;
}

const ANCHOR_FIELD: Record<"arrival" | "courseEnd", keyof Profile> = {
  arrival: "arrivalDate",
  courseEnd: "courseEndDate",
};

export function toUtcDays(iso: string): number {
  const [year, month, day] = iso.split("-").map(Number);
  return Date.UTC(year, month - 1, day) / 86400000;
}

export function addDays(iso: string, n: number): string {
  const days = toUtcDays(iso) + n;
  return new Date(days * 86400000).toISOString().slice(0, 10);
}

export function applies(record: RuleRecord, profile: Profile): boolean {
  return Object.entries(record.appliesTo).every(([facet, allowed]) => {
    const value = profile[facet as keyof Profile] as string;
    return (allowed as string[]).includes(value);
  });
}

export function dueDateFor(record: RuleRecord, profile: Profile): string | null {
  const due = record.due;
  if (due.anchor === "arrival" || due.anchor === "courseEnd") {
    const anchorDate = profile[ANCHOR_FIELD[due.anchor]] as string;
    return addDays(anchorDate, due.offsetDays);
  }
  if (due.anchor === "fixed") {
    return due.date;
  }
  return null;
}

export function statusFor(dueDate: string | null, today: string): ObligationStatus {
  if (dueDate === null) return "standing";
  const diff = toUtcDays(dueDate) - toUtcDays(today);
  if (diff < 0) return "overdue";
  if (diff <= DUE_SOON_DAYS) return "due-soon";
  return "upcoming";
}

export function derive(records: RuleRecord[], profile: Profile, today: string): Obligation[] {
  const obligations: Obligation[] = records
    .filter((record) => applies(record, profile))
    .map((record) => {
      const dueDate = dueDateFor(record, profile);
      return {
        id: record.id,
        module: record.module,
        title: record.title,
        detail: record.detail,
        agency: record.agency,
        instrument: record.instrument,
        sourceUrl: record.sourceUrl,
        verifiedOn: record.verifiedOn,
        anchor: record.due.anchor,
        dueDate,
        status: statusFor(dueDate, today),
        daysUntilDue: dueDate === null ? null : toUtcDays(dueDate) - toUtcDays(today),
      };
    });

  const dated = obligations
    .filter((o) => o.dueDate !== null)
    .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : a.dueDate! > b.dueDate! ? 1 : 0));
  const standing = obligations.filter((o) => o.dueDate === null);

  return [...dated, ...standing];
}
