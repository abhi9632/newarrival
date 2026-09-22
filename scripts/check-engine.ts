import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, resolve } from "node:path";
import assert from "node:assert/strict";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const enginePath = process.argv[2]
  ? resolve(process.cwd(), process.argv[2])
  : join(ROOT, "src", "lib", "derive.ts");

let failed = false;
function fail(gate: string, message: string) {
  failed = true;
  console.log(`FAIL ${gate}: ${message}`);
}

const corpusPath = join(ROOT, "src", "data", "rules.json");
const records = JSON.parse(readFileSync(corpusPath, "utf8"));
const engineSource = readFileSync(enginePath, "utf8");

// Two profiles matching src/lib/profile.ts EXAMPLE_PROFILES. Hardcoded here rather
// than imported, because profile.ts pulls in rules.ts's JSON import, which has no
// import attribute and would fail Node's native loader when reached this way.
const STUDENT_PROFILE = {
  subclass: "500",
  citizenship: "IN",
  state: "VIC",
  arrivalDate: "2026-09-13",
  courseEndDate: "2027-11-26",
};
const SKILLED_PROFILE = {
  subclass: "482",
  citizenship: "IT",
  state: "NSW",
  arrivalDate: "2026-08-03",
  courseEndDate: "2026-08-03",
};
const REFERENCE_DATE = "2026-09-22";

// engine-01-source
{
  const literals = [
    "'500'", '"500"', "'482'", '"482"',
    "'IN'", '"IN"', "'IT'", '"IT"',
    "'VIC'", '"VIC"', "'NSW'", '"NSW"',
  ];
  const names = ["Priya", "Marco"];
  const hits = [...literals, ...names].filter((needle) => engineSource.includes(needle));
  if (hits.length > 0) {
    fail("engine-01-source", `module source at ${enginePath} contains: ${hits.join(", ")}`);
  }
}

// engine-01-clock
{
  const clockRead = /Date\.now|new Date\(\s*\)/.test(engineSource);
  if (clockRead) {
    fail("engine-01-clock", `module source at ${enginePath} reads the system clock`);
  }
}

const engine = await import(pathToFileURL(enginePath).href);
const { derive, addDays, statusFor, DUE_SOON_DAYS } = engine;

// engine-01-derive
try {
  const studentSet = derive(records, STUDENT_PROFILE, REFERENCE_DATE);
  const skilledSet = derive(records, SKILLED_PROFILE, REFERENCE_DATE);
  const studentIds = new Set(studentSet.map((o: { id: string }) => o.id));
  const skilledIds = new Set(skilledSet.map((o: { id: string }) => o.id));

  assert.ok(studentSet.length > 0, "student profile derived an empty set");
  assert.ok(skilledSet.length > 0, "skilled profile derived an empty set");

  const onlyStudent = [...studentIds].filter((id) => !skilledIds.has(id));
  const onlySkilled = [...skilledIds].filter((id) => !studentIds.has(id));
  assert.ok(onlyStudent.length > 0, "student set has no id the skilled set lacks");
  assert.ok(onlySkilled.length > 0, "skilled set has no id the student set lacks");

  for (const id of ["visa-500-8105-work-limit", "visa-485-window"]) {
    assert.ok(studentIds.has(id), `student set missing ${id}`);
    assert.ok(!skilledIds.has(id), `skilled set unexpectedly has ${id}`);
  }
  for (const id of ["visa-482-sponsor-obligations", "visa-482-pr-pathway"]) {
    assert.ok(skilledIds.has(id), `skilled set missing ${id}`);
    assert.ok(!studentIds.has(id), `student set unexpectedly has ${id}`);
  }

  const union = new Set([...studentIds, ...skilledIds]);
  const symmetricDifference = onlyStudent.length + onlySkilled.length;
  console.log(`DIVERGENCE ${symmetricDifference} of ${union.size}`);
} catch (error) {
  fail("engine-01-derive", (error as Error).message);
}

// engine-02-dates
try {
  const dated = derive(records, STUDENT_PROFILE, REFERENCE_DATE).filter(
    (o: { dueDate: string | null }) => o.dueDate !== null
  );
  const byId: Record<string, { anchor: string; offsetDays?: number; date?: string }> = Object.fromEntries(
    records.map((r: { id: string; due: { anchor: string; offsetDays?: number; date?: string } }) => [r.id, r.due])
  );
  for (const obligation of dated as { id: string; dueDate: string }[]) {
    const due = byId[obligation.id];
    let expected: string;
    if (due.anchor === "arrival") expected = addDays(STUDENT_PROFILE.arrivalDate, due.offsetDays!);
    else if (due.anchor === "courseEnd") expected = addDays(STUDENT_PROFILE.courseEndDate, due.offsetDays!);
    else expected = due.date!;
    assert.equal(obligation.dueDate, expected, `${obligation.id} computed ${obligation.dueDate}, expected ${expected}`);
  }

  assert.equal(addDays("2026-10-02", 2), "2026-10-04", "addDays fails crossing the 2026-10-04 daylight saving start");
  assert.equal(addDays("2026-12-28", 5), "2027-01-02", "addDays fails crossing the year boundary");
  assert.equal(addDays("2028-02-27", 2), "2028-02-29", "addDays fails landing on the 2028 leap day");
} catch (error) {
  fail("engine-02-dates", (error as Error).message);
}

// engine-03-citizenship
try {
  const base = derive(records, STUDENT_PROFILE, REFERENCE_DATE);
  const swapped = derive(records, { ...STUDENT_PROFILE, citizenship: "IT" }, REFERENCE_DATE);
  const baseIds = new Set(base.map((o: { id: string }) => o.id));
  const swappedIds = new Set(swapped.map((o: { id: string }) => o.id));
  const diffIds = new Set([...baseIds, ...swappedIds].filter((id) => baseIds.has(id) !== swappedIds.has(id)));
  assert.ok(diffIds.size > 0, "swapping citizenship changed nothing");

  const allRecordsById: Record<string, { module: string }> = Object.fromEntries(
    records.map((r: { id: string; module: string }) => [r.id, r])
  );
  for (const id of diffIds) {
    assert.equal(allRecordsById[id].module, "health", `${id} changed by a citizenship swap but is not module health`);
  }
} catch (error) {
  fail("engine-03-citizenship", (error as Error).message);
}

// engine-04-state
{
  const hasTenancyRecords = records.some((r: { module: string }) => r.module === "tenancy");
  if (!hasTenancyRecords) {
    console.log("SKIP engine-04: no tenancy records in corpus, RULE-06 was cut");
  } else {
    try {
      const base = derive(records, STUDENT_PROFILE, REFERENCE_DATE);
      const swapped = derive(records, { ...STUDENT_PROFILE, state: "NSW" }, REFERENCE_DATE);
      const baseIds = new Set(base.map((o: { id: string }) => o.id));
      const swappedIds = new Set(swapped.map((o: { id: string }) => o.id));
      const diffIds = new Set([...baseIds, ...swappedIds].filter((id) => baseIds.has(id) !== swappedIds.has(id)));
      assert.ok(diffIds.size > 0, "swapping state changed nothing");

      const allRecordsById: Record<string, { module: string }> = Object.fromEntries(
        records.map((r: { id: string; module: string }) => [r.id, r])
      );
      for (const id of diffIds) {
        assert.equal(allRecordsById[id].module, "tenancy", `${id} changed by a state swap but is not module tenancy`);
      }
    } catch (error) {
      fail("engine-04-state", (error as Error).message);
    }
  }
}

// time-03-status
try {
  assert.equal(statusFor("2026-09-20", "2026-09-21"), "overdue", "one day before due should be overdue");
  assert.equal(statusFor("2026-09-20", "2026-09-20"), "due-soon", "the due date itself should be due-soon");
  assert.equal(
    statusFor(addDays("2026-09-20", DUE_SOON_DAYS), "2026-09-20"),
    "due-soon",
    `exactly DUE_SOON_DAYS (${DUE_SOON_DAYS}) ahead should be due-soon`
  );
  assert.equal(statusFor("2026-09-28", "2026-09-20"), "upcoming", "one day past the due-soon window should be upcoming");
  assert.equal(statusFor(null, "2026-09-20"), "standing", "a null due date should be standing");
} catch (error) {
  fail("time-03-status", (error as Error).message);
}

// engine-05-deterministic
try {
  const first = derive(records, STUDENT_PROFILE, REFERENCE_DATE);
  const second = derive(records, STUDENT_PROFILE, REFERENCE_DATE);
  assert.deepEqual(first, second, "two calls with identical arguments produced different results");

  const changed = derive(records, { ...STUDENT_PROFILE, state: "NSW" }, REFERENCE_DATE);
  assert.notDeepEqual(first, changed, "changing one facet did not change the result");
} catch (error) {
  fail("engine-05-deterministic", (error as Error).message);
}

// time-01-order
try {
  const obligations = derive(records, STUDENT_PROFILE, REFERENCE_DATE) as {
    id: string;
    dueDate: string | null;
  }[];
  let seenStanding = false;
  let previousDate: string | null = null;
  for (const obligation of obligations) {
    if (obligation.dueDate === null) {
      seenStanding = true;
    } else {
      assert.ok(!seenStanding, `dated obligation ${obligation.id} appears after a standing one`);
      if (previousDate !== null) {
        assert.ok(previousDate <= obligation.dueDate, `dated obligations are not ascending at ${obligation.id}`);
      }
      previousDate = obligation.dueDate;
    }
  }
} catch (error) {
  fail("time-01-order", (error as Error).message);
}

if (failed) {
  process.exit(1);
} else {
  console.log("OK engine");
  process.exit(0);
}
