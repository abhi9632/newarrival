import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

let failed = false;
function fail(gate, message) {
  failed = true;
  console.log(`FAIL ${gate}: ${message}`);
}

const corpusPath = join(ROOT, "src", "data", "rules.json");
const records = JSON.parse(readFileSync(corpusPath, "utf8"));

// Priya's profile, matching src/lib/profile.ts EXAMPLE_PROFILES. Hardcoded here rather
// than imported, same reasoning as scripts/check-engine.ts: profile.ts pulls in
// rules.ts's JSON import, which has no import attribute Node's native loader accepts
// when reached this way.
const PROFILE = {
  subclass: "500",
  citizenship: "IN",
  state: "VIC",
  arrivalDate: "2026-09-13",
  courseEndDate: "2027-11-26",
};
const REFERENCE_DATE = "2026-09-22";
const DRAG_MONTHS = -3;

function shiftMonths(iso, months) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1 + months, day)).toISOString().slice(0, 10);
}

const derivePath = join(ROOT, "src", "lib", "derive.ts");
const perturbPath = join(ROOT, "src", "lib", "perturb.ts");
const { derive } = await import(pathToFileURL(derivePath).href);
const { diffObligations, summariseCascade } = await import(pathToFileURL(perturbPath).href);

const before = derive(records, PROFILE, REFERENCE_DATE);
const perturbedProfile = { ...PROFILE, courseEndDate: shiftMonths(PROFILE.courseEndDate, DRAG_MONTHS) };
const after = derive(records, perturbedProfile, REFERENCE_DATE);
const changes = diffObligations(before, after);
const summary = summariseCascade(changes);
const byId = Object.fromEntries(changes.map((change) => [change.id, change]));
const hasRecord = (id) => records.some((record) => record.id === id);

const expectedDeltaDays = Math.round(
  (Date.parse(perturbedProfile.courseEndDate) - Date.parse(PROFILE.courseEndDate)) / 86400000
);

// window-moves
{
  const change = byId["visa-485-window"];
  if (!change) {
    fail("window-moves", "visa-485-window is not present in the diff");
  } else if (change.kind !== "moved") {
    fail("window-moves", `expected kind moved, got ${change.kind}`);
  } else if (change.deltaDays !== expectedDeltaDays) {
    fail("window-moves", `expected deltaDays ${expectedDeltaDays}, got ${change.deltaDays}`);
  }
}

// arrival-holds
{
  const change = byId["visa-500-8533-address"];
  if (!change) {
    fail("arrival-holds", "visa-500-8533-address is not present in the diff");
  } else if (change.kind !== "held") {
    fail("arrival-holds", `expected kind held, got ${change.kind}`);
  }
}

// fixed-holds
if (!hasRecord("tax-return-deadline")) {
  console.log("SKIP fixed-holds: tax-return-deadline not present in the corpus, agency spread is reduced");
} else {
  const change = byId["tax-return-deadline"];
  if (!change) {
    fail("fixed-holds", "tax-return-deadline is not present in the diff");
  } else if (change.kind !== "held") {
    fail("fixed-holds", `expected kind held, got ${change.kind}`);
  }
}

// movers-count
{
  if (summary.moved < 2) {
    fail("movers-count", `expected at least 2 moved records, got ${summary.moved}`);
  }
}

// holds-count
{
  if (summary.held < 2) {
    fail("holds-count", `expected at least 2 held records, got ${summary.held}`);
  }
}

// agency-spread
{
  if (summary.agencies.length < 3) {
    fail(
      "agency-spread",
      `expected at least 3 distinct agencies, got ${summary.agencies.length}: ${summary.agencies.join(", ")}`
    );
  }
}

// no-nulls
{
  for (const change of changes) {
    if (change.kind === "moved") {
      if (change.fromDate === null || change.toDate === null || change.deltaDays === null) {
        fail("no-nulls", `moved record ${change.id} has a null date or deltaDays field`);
      }
    }
  }
}

if (failed) {
  process.exit(1);
} else {
  console.log(`OK cascade: ${summary.moved} moved, ${summary.held} held, ${summary.agencies.length} agencies`);
  process.exit(0);
}
