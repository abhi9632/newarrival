import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_PATH = join(__dirname, "..", "src", "data", "rules.json");
const corpusPath = process.argv[2] ?? DEFAULT_PATH;

const REQUIRED_FIELDS = [
  "id",
  "module",
  "title",
  "detail",
  "agency",
  "instrument",
  "sourceUrl",
  "verifiedOn",
];
const MODULES = ["visa", "work", "health", "tax", "tenancy"];
const FACETS = {
  subclass: ["500", "482"],
  citizenship: ["IN", "IT"],
  state: ["VIC", "NSW"],
};
const DUE_ANCHORS = ["arrival", "courseEnd", "fixed", "ongoing"];
const DASH_CHARS = [String.fromCharCode(8212), String.fromCharCode(8211)];
const ADVICE_PATTERNS = [
  /\byou should\b/i,
  /\byou must\b/i,
  /\byou need to\b/i,
  /\byou ought to\b/i,
  /\byou qualify\b/i,
  /\byou are eligible\b/i,
  /\byou're eligible\b/i,
  /\bwe recommend\b/i,
  /\bwe suggest\b/i,
  /\bwe advise\b/i,
];

let failed = false;
function fail(gate, id, message) {
  failed = true;
  console.log(`FAIL ${gate}: ${id}: ${message}`);
}

const raw = readFileSync(corpusPath, "utf8");
const records = JSON.parse(raw);

const seenIds = new Set();
let hasIT = false;
let hasIN = false;

for (const record of records) {
  const id = typeof record.id === "string" && record.id.trim() ? record.id : "(no id)";

  // required-field
  for (const field of REQUIRED_FIELDS) {
    const value = record[field];
    if (typeof value !== "string" || value.trim() === "") {
      fail("required-field", id, `missing or empty field "${field}"`);
    }
  }

  // source-host
  if (typeof record.sourceUrl === "string") {
    if (!record.sourceUrl.startsWith("https://")) {
      fail("source-host", id, "sourceUrl does not start with https://");
    } else {
      try {
        const host = new URL(record.sourceUrl).hostname;
        if (!host.endsWith(".gov.au")) {
          fail("source-host", id, `sourceUrl hostname "${host}" does not end with .gov.au`);
        }
      } catch {
        fail("source-host", id, "sourceUrl is not a parseable URL");
      }
    }
  }

  // verified-date
  if (typeof record.verifiedOn === "string") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(record.verifiedOn)) {
      fail("verified-date", id, `verifiedOn "${record.verifiedOn}" is not YYYY-MM-DD`);
    } else {
      const parsed = new Date(record.verifiedOn + "T00:00:00Z");
      const today = new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z");
      if (Number.isNaN(parsed.getTime())) {
        fail("verified-date", id, `verifiedOn "${record.verifiedOn}" does not parse as a real date`);
      } else if (parsed.getTime() > today.getTime()) {
        fail("verified-date", id, `verifiedOn "${record.verifiedOn}" is in the future`);
      } else {
        const ageDays = (today.getTime() - parsed.getTime()) / (1000 * 60 * 60 * 24);
        if (ageDays > 30) {
          fail("verified-date", id, `verifiedOn "${record.verifiedOn}" is more than 30 days old`);
        }
      }
    }
  }

  // duplicate-id
  if (typeof record.id === "string") {
    if (seenIds.has(record.id)) {
      fail("duplicate-id", id, `id "${record.id}" is used by more than one record`);
    }
    seenIds.add(record.id);
  }

  // module-name
  if (!MODULES.includes(record.module)) {
    fail("module-name", id, `module "${record.module}" is not one of ${MODULES.join(", ")}`);
  }

  // applies-to
  if (record.appliesTo === null || typeof record.appliesTo !== "object" || Array.isArray(record.appliesTo)) {
    fail("applies-to", id, "appliesTo is not an object");
  } else {
    for (const [facet, values] of Object.entries(record.appliesTo)) {
      if (!Object.prototype.hasOwnProperty.call(FACETS, facet)) {
        fail("applies-to", id, `appliesTo key "${facet}" is not subclass, citizenship or state`);
        continue;
      }
      if (!Array.isArray(values) || values.length === 0) {
        fail("applies-to", id, `appliesTo.${facet} is not a non empty array`);
        continue;
      }
      for (const value of values) {
        if (!FACETS[facet].includes(value)) {
          fail("applies-to", id, `appliesTo.${facet} value "${value}" is not allowed for that facet`);
        }
      }
    }
  }

  // due-shape
  const due = record.due;
  if (due === null || typeof due !== "object" || !DUE_ANCHORS.includes(due.anchor)) {
    fail("due-shape", id, "due.anchor is missing or not one of arrival, courseEnd, fixed, ongoing");
  } else if (due.anchor === "arrival" || due.anchor === "courseEnd") {
    if (!Number.isInteger(due.offsetDays)) {
      fail("due-shape", id, `due.anchor "${due.anchor}" requires an integer offsetDays`);
    }
    if (due.date !== undefined) {
      fail("due-shape", id, `due.anchor "${due.anchor}" must not carry date`);
    }
  } else if (due.anchor === "fixed") {
    if (typeof due.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(due.date)) {
      fail("due-shape", id, 'due.anchor "fixed" requires an ISO YYYY-MM-DD date');
    }
    if (due.offsetDays !== undefined) {
      fail("due-shape", id, 'due.anchor "fixed" must not carry offsetDays');
    }
  } else if (due.anchor === "ongoing") {
    if (due.offsetDays !== undefined || due.date !== undefined) {
      fail("due-shape", id, 'due.anchor "ongoing" must not carry offsetDays or date');
    }
  }

  // dash-copy
  for (const field of ["title", "detail"]) {
    const value = record[field];
    if (typeof value === "string") {
      for (const dash of DASH_CHARS) {
        if (value.includes(dash)) {
          fail("dash-copy", id, `field "${field}" contains a banned dash character`);
          break;
        }
      }
    }
  }

  // advice-copy
  for (const field of ["title", "detail"]) {
    const value = record[field];
    if (typeof value === "string") {
      for (const pattern of ADVICE_PATTERNS) {
        if (pattern.test(value)) {
          fail("advice-copy", id, `field "${field}" contains advice framing matching ${pattern}`);
          break;
        }
      }
    }
  }

  // markup-copy
  for (const field of ["title", "detail"]) {
    const value = record[field];
    if (typeof value === "string" && (value.includes("<") || value.includes(">"))) {
      fail("markup-copy", id, `field "${field}" contains angle bracket markup`);
    }
  }

  // rhca-branch bookkeeping
  const citizenship = record.appliesTo && record.appliesTo.citizenship;
  if (Array.isArray(citizenship) && citizenship.length === 1) {
    if (citizenship[0] === "IT") hasIT = true;
    if (citizenship[0] === "IN") hasIN = true;
  }
}

// rhca-branch, corpus level
if (!hasIT || !hasIN) {
  failed = true;
  console.log(
    `FAIL rhca-branch: (corpus): needs one record with appliesTo.citizenship exactly ["IT"] and one exactly ["IN"], found IT=${hasIT} IN=${hasIN}`
  );
}

if (failed) {
  process.exit(1);
} else {
  console.log(`OK ${records.length} records`);
  process.exit(0);
}
