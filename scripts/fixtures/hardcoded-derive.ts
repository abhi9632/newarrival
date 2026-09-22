// A deliberately wrong engine. It special cases Priya's subclass 500 profile with a
// fixed obligation list and ignores citizenship entirely, which is exactly the failure
// ENGINE-01 exists to forbid. scripts/check-engine.ts must reject this file.
export { DUE_SOON_DAYS, toUtcDays, addDays, applies, dueDateFor, statusFor } from "../../src/lib/derive.ts";
export type { ObligationStatus, Obligation } from "../../src/lib/derive.ts";

import type { RuleRecord } from "../../src/lib/rules.ts";
import type { Profile } from "../../src/lib/profile.ts";
import type { Obligation } from "../../src/lib/derive.ts";

const HARDCODED_STUDENT_OBLIGATIONS: Obligation[] = [
  {
    id: "visa-500-8533-address",
    module: "visa",
    title: "Tell your provider your address within 7 days",
    detail: "Hardcoded for the demo, ignores the profile entirely.",
    agency: "Department of Home Affairs",
    instrument: "Migration Regulations 1994, Schedule 8, condition 8533",
    sourceUrl: "https://www.studyaustralia.gov.au/en/plan-your-move/your-first-week-in-australia",
    verifiedOn: "2026-09-22",
    anchor: "arrival",
    dueDate: "2026-09-20",
    status: "overdue",
    daysUntilDue: -2,
  },
];

export function derive(_records: RuleRecord[], profile: Profile, _today: string): Obligation[] {
  if (profile.subclass === "500") {
    return HARDCODED_STUDENT_OBLIGATIONS;
  }
  return [];
}
