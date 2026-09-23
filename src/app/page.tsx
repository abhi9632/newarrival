import { rules } from "@/lib/rules";
import { LiveRoute } from "@/components/LiveRoute";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function longDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

// One row per agency, straight from the corpus: how many rules it contributes.
const SOURCES = [...new Set(rules.map((r) => r.agency))]
  .map((agency) => ({ agency, count: rules.filter((r) => r.agency === agency).length }))
  .sort((a, b) => b.count - a.count);

const CHECKED = [...new Set(rules.map((r) => r.verifiedOn))].sort();

export default function Home() {
  return (
    <main className="flex flex-col">
      <div className="mx-auto w-full max-w-6xl px-6 pt-10 pb-20 md:px-8 md:pt-14">
        <header className="flex items-center justify-between">
          <span className="font-display text-base tracking-tight text-[var(--color-text)]">
            NewArrival
          </span>
          <a
            href="/timeline"
            className="affordance -my-2 py-3 font-body text-sm font-medium text-[var(--color-muted)] underline decoration-1 underline-offset-4 hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            Your timeline
          </a>
        </header>

        <div className="mt-8 md:mt-16">
          <LiveRoute
            intro={
              <>
                <h1 className="max-w-[16ch] font-display text-4xl leading-[1.05] tracking-tight text-[var(--color-text)] md:text-6xl">
                  Four facts decide every deadline you have in Australia.
                </h1>
                <p className="mt-4 max-w-[46ch] font-body text-lg md:mt-6 leading-relaxed text-[var(--color-muted)]">
                  Visa, citizenship, arrival and state set your obligations across four agencies.
                  Change one and see what moves.
                </p>
              </>
            }
          />
        </div>
      </div>

      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 md:grid-cols-12 md:gap-8 md:px-8 md:py-24">
          <div className="md:col-span-5">
            <h2 className="max-w-[18ch] font-display text-3xl leading-tight tracking-tight text-[var(--color-text)]">
              Every stop names the rule behind it.
            </h2>
            <p className="mt-4 max-w-[44ch] font-body text-base leading-relaxed text-[var(--color-muted)]">
              Each obligation links to the legal instrument or agency page it comes from, with
              the date it was last checked. No personal identifiers, only the four facts.
            </p>
            <p className="mt-6 font-body text-sm text-[var(--color-text)]">
              {rules.length} rules, {CHECKED.length === 1 ? "every one checked against its source on" : "last checked against their sources on"}{" "}
              {longDate(CHECKED[CHECKED.length - 1])}.
            </p>
          </div>

          <ul className="md:col-span-7">
            {SOURCES.map((source) => (
              <li
                key={source.agency}
                className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 border-b border-[var(--color-border)] py-4 first:border-t"
              >
                <span className="font-display text-lg text-[var(--color-text)]">{source.agency}</span>
                <span className="font-body text-sm tabular-nums text-[var(--color-accent)]">
                  {source.count} {source.count === 1 ? "rule" : "rules"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="mt-auto border-t border-[var(--color-border)]">
        <p className="mx-auto max-w-6xl px-6 py-8 font-body text-sm leading-relaxed text-[var(--color-muted)] md:px-8">
          NewArrival is not migration advice and not legal advice. It shows published rules and computes dates from them. Only a registered migration agent or an Australian legal practitioner can advise on your individual circumstances.
        </p>
      </footer>
    </main>
  );
}
