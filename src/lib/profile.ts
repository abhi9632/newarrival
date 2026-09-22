import { SUBCLASSES, CITIZENSHIPS, STATES } from "./rules";

export type Subclass = (typeof SUBCLASSES)[number];
export type Citizenship = (typeof CITIZENSHIPS)[number];
export type StateCode = (typeof STATES)[number];

export interface Profile {
  subclass: Subclass;
  citizenship: Citizenship;
  state: StateCode;
  arrivalDate: string;
  // ponytail: ignored by any profile whose derived set has no course end anchored obligation
  courseEndDate: string;
}

interface Option<T extends string> {
  value: T;
  label: string;
}

export const SUBCLASS_OPTIONS: Option<Subclass>[] = [
  { value: "500", label: "Student visa (subclass 500)" },
  { value: "482", label: "Skills in Demand visa (subclass 482)" },
];

export const CITIZENSHIP_OPTIONS: Option<Citizenship>[] = [
  { value: "IN", label: "India" },
  { value: "IT", label: "Italy" },
];

export const STATE_OPTIONS: Option<StateCode>[] = [
  { value: "VIC", label: "Victoria" },
  { value: "NSW", label: "New South Wales" },
];

interface ExampleProfile {
  id: string;
  label: string;
  profile: Profile;
}

// These are input presets: four facts a user could supply, not a derived output.
// A preset that names four facts is the opposite of a hardcoded obligation set;
// ENGINE-01 is about the engine's output, and no output is defined here.
export const EXAMPLE_PROFILES: ExampleProfile[] = [
  {
    id: "student-500-india",
    label: "Priya, student visa, India",
    profile: {
      subclass: "500",
      citizenship: "IN",
      state: "VIC",
      arrivalDate: "2026-09-13",
      courseEndDate: "2027-11-26",
    },
  },
  {
    id: "skilled-482-italy",
    label: "Marco, skilled visa, Italy",
    profile: {
      subclass: "482",
      citizenship: "IT",
      state: "NSW",
      arrivalDate: "2026-08-03",
      // ponytail: unused for this profile, no course end anchored obligation applies to subclass 482
      courseEndDate: "2026-08-03",
    },
  },
];
