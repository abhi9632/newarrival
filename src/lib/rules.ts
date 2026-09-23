import rulesJson from "../data/rules.json";

export const SUBCLASSES = ["500", "482"] as const;
export const CITIZENSHIPS = ["IN", "IT"] as const;
export const STATES = ["VIC", "NSW"] as const;

export type Subclass = (typeof SUBCLASSES)[number];
export type Citizenship = (typeof CITIZENSHIPS)[number];
export type State = (typeof STATES)[number];

export interface RuleRecord {
  id: string;
  module: "visa" | "work" | "health" | "tax" | "tenancy";
  title: string;
  detail: string;
  agency: string;
  instrument: string;
  sourceUrl: string;
  verifiedOn: string;
  appliesTo: {
    subclass?: Subclass[];
    citizenship?: Citizenship[];
    state?: State[];
  };
  due:
    | { anchor: "arrival" | "courseEnd"; offsetDays: number }
    | { anchor: "fixed"; date: string }
    | { anchor: "ongoing" };
  // Structural classification, same kind as appliesTo and due.anchor: the obligation's
  // active period is bounded by the course end date. Not a new legal figure.
  courseScoped?: boolean;
}

// ponytail: scripts/check-rules.mjs is the real gate on the union valued
// fields below (module, appliesTo keys/values, due.anchor). TypeScript
// widens the JSON string literals on import and cannot check them itself.
export const rules = rulesJson as unknown as RuleRecord[];
