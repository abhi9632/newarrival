export default function Home() {
  return (
    <main className="flex flex-col">
      <div className="mx-auto w-full max-w-4xl px-6 pt-16 pb-24 md:px-8 md:pt-20">
        <span className="font-display text-sm tracking-tight text-[var(--color-muted)]">
          NewArrival
        </span>

        <h1 className="mt-6 font-display text-4xl leading-tight tracking-tight text-[var(--color-text)] md:text-5xl">
          Four facts decide every deadline you have in Australia.
        </h1>

        <p className="mt-6 max-w-[62ch] font-body text-lg leading-relaxed text-[var(--color-muted)]">
          Your visa subclass, your citizenship, your arrival date and your state determine every obligation you carry, across Home Affairs, the ATO, Services Australia and your state tenancy authority. No single agency puts them in one place.
        </p>

        <a
          href="#how"
          className="affordance mt-10 inline-flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-accent)] bg-[var(--color-accent)] px-6 py-3 font-body text-base font-medium text-[var(--color-surface)] hover:-translate-y-px hover:border-[var(--color-text)] hover:bg-[var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        >
          Start with four facts
        </a>
      </div>

      <section
        id="how"
        className="border-t border-[var(--color-border)] bg-[var(--color-surface)]"
      >
        <div className="mx-auto grid w-full max-w-4xl gap-10 px-6 py-16 md:grid-cols-[auto_1fr] md:gap-8 md:px-8 md:py-20">
          <div
            aria-hidden="true"
            className="hidden w-px bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-due-soon)] to-[var(--color-upcoming)] md:block"
          />

          <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
            <li>
              <h2 className="font-display text-lg text-[var(--color-text)]">
                Give it four facts
              </h2>
              <p className="mt-2 font-body text-sm leading-relaxed text-[var(--color-muted)]">
                Visa subclass, citizenship, arrival date, state. Nothing else, and no personal identifiers.
              </p>
            </li>
            <li>
              <h2 className="font-display text-lg text-[var(--color-text)]">
                It derives your obligations
              </h2>
              <p className="mt-2 font-body text-sm leading-relaxed text-[var(--color-muted)]">
                Every deadline those four facts produce, dated from your arrival and ordered by when it falls due.
              </p>
            </li>
            <li>
              <h2 className="font-display text-lg text-[var(--color-text)]">
                Every item names its source
              </h2>
              <p className="mt-2 font-body text-sm leading-relaxed text-[var(--color-muted)]">
                The legal instrument or agency page it came from, with the date it was checked.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <footer className="mt-auto border-t border-[var(--color-border)]">
        <p className="mx-auto max-w-4xl px-6 py-8 font-body text-sm leading-relaxed text-[var(--color-muted)] md:px-8">
          NewArrival is not migration advice and not legal advice. It shows published rules and computes dates from them. Only a registered migration agent or an Australian legal practitioner can advise on your individual circumstances.
        </p>
      </footer>
    </main>
  );
}
