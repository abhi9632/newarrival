import type { Obligation, ObligationStatus } from "@/lib/derive";

export const STATUS_CLASS: Record<ObligationStatus, string> = {
  overdue: "border-overdue bg-overdue/10 text-overdue",
  "due-soon": "border-due-soon bg-due-soon/10 text-due-soon",
  upcoming: "border-upcoming bg-upcoming/10 text-upcoming",
  standing: "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-muted)]",
};

export const STATUS_LABEL: Record<ObligationStatus, string> = {
  overdue: "Overdue",
  "due-soon": "Due soon",
  upcoming: "Upcoming",
  standing: "Standing condition",
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

function relativePhrase(daysUntilDue: number | null): string | null {
  if (daysUntilDue === null) return null;
  const magnitude = Math.abs(daysUntilDue);
  const unit = magnitude === 1 ? "day" : "days";
  if (daysUntilDue < 0) return `${magnitude} ${unit} overdue`;
  if (daysUntilDue === 0) return "due today";
  return `in ${magnitude} ${unit}`;
}

export function ObligationCard({ obligation }: { obligation: Obligation }) {
  const phrase = relativePhrase(obligation.daysUntilDue);

  return (
    <article
      data-obligation-id={obligation.id}
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm"
    >
      <span
        className={`inline-flex items-center rounded-full border px-3 py-1 font-body text-xs font-medium uppercase tracking-wide ${STATUS_CLASS[obligation.status]}`}
      >
        {STATUS_LABEL[obligation.status]}
      </span>

      <p className="mt-3 font-body text-sm text-[var(--color-muted)]">
        {obligation.dueDate ? (
          <>
            {formatDate(obligation.dueDate)}
            {phrase ? ` · ${phrase}` : null}
          </>
        ) : (
          STATUS_LABEL.standing
        )}
      </p>

      <h3 className="mt-2 font-display text-lg text-[var(--color-text)]">{obligation.title}</h3>

      <p className="mt-1 font-body text-sm text-[var(--color-muted)]">{obligation.agency}</p>

      <p className="mt-2 font-body text-sm text-[var(--color-text)]">{obligation.instrument}</p>

      <a
        href={obligation.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="affordance mt-2 inline-flex items-center gap-1 font-body text-sm font-medium text-[var(--color-accent)] underline decoration-1 underline-offset-2 hover:text-[var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
      >
        Open the source page for {obligation.title}
      </a>

      <p className="mt-2 font-body text-xs text-[var(--color-muted)]">
        Checked against its source on {formatDate(obligation.verifiedOn)}
      </p>

      <details className="group mt-3">
        <summary className="affordance flex cursor-pointer items-center gap-2 font-body text-sm font-medium text-[var(--color-accent)] [&::-webkit-details-marker]:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]">
          <span
            aria-hidden="true"
            className="affordance inline-block group-open:rotate-90"
          >
            {"›"}
          </span>
          What this requires and what happens if it is missed
        </summary>
        <p className="mt-2 font-body text-sm leading-relaxed text-[var(--color-muted)]">
          {obligation.detail}
        </p>
      </details>
    </article>
  );
}
