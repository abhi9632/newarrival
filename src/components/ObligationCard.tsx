import type { CSSProperties } from "react";
import type { Obligation, ObligationStatus } from "@/lib/derive";
import type { ObligationChange } from "@/lib/perturb";

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

export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

export function relativePhrase(daysUntilDue: number | null): string | null {
  if (daysUntilDue === null) return null;
  const magnitude = Math.abs(daysUntilDue);
  const unit = magnitude === 1 ? "day" : "days";
  if (daysUntilDue < 0) return `${magnitude} ${unit} overdue`;
  if (daysUntilDue === 0) return "due today";
  return `in ${magnitude} ${unit}`;
}

const CHANGE_MARKER_CLASS: Record<ObligationChange["kind"], string> = {
  moved: "text-[var(--color-accent)]",
  restatused: "text-[var(--color-accent)]",
  held: "text-[var(--color-muted)]",
  added: "text-[var(--color-accent)]",
  removed: "text-[var(--color-muted)]",
};

function changeMarkerText(change: ObligationChange): string {
  if (change.kind === "moved") {
    const delta = change.deltaDays ?? 0;
    const sign = delta > 0 ? "plus" : delta < 0 ? "minus" : "";
    const magnitude = Math.abs(delta);
    const unit = magnitude === 1 ? "day" : "days";
    const from = change.fromDate ? `, was ${formatDate(change.fromDate)}` : "";
    return `Moved ${sign} ${magnitude} ${unit}${from}`.replace(/\s+/g, " ").trim();
  }
  if (change.kind === "restatused") {
    const from = change.fromStatus ? STATUS_LABEL[change.fromStatus] : "unknown";
    const to = change.toStatus ? STATUS_LABEL[change.toStatus] : "unknown";
    return `Status changed, from ${from} to ${to}`;
  }
  if (change.kind === "held") {
    return "Held, this date does not move";
  }
  if (change.kind === "added") {
    return "New under this profile";
  }
  return "No longer applies under this profile";
}

interface ObligationCardProps {
  obligation: Obligation;
  change?: ObligationChange | null;
  cascadeIndex?: number;
  /** Denser chrome for grid contexts: source link and verified-on fold into the disclosure. */
  compact?: boolean;
  /** Omit the standalone agency line when a group heading already states it. */
  hideAgency?: boolean;
}

export function ObligationCard({
  obligation,
  change = null,
  cascadeIndex = 0,
  compact = false,
  hideAgency = false,
}: ObligationCardProps) {
  const phrase = relativePhrase(obligation.daysUntilDue);
  const cardStyle = {
    viewTransitionName: `obligation-${obligation.id}`,
    "--cascade-index": cascadeIndex,
  } as unknown as CSSProperties;

  const sourceLink = (
    <a
      href={obligation.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open the source page for ${obligation.title}`}
      className="affordance mt-2 inline-flex items-center gap-1 font-body text-sm font-medium text-[var(--color-accent)] underline decoration-1 underline-offset-2 hover:text-[var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
    >
      Source <span aria-hidden="true">↗</span>
    </a>
  );

  if (compact) {
    return (
      <article
        data-obligation-id={obligation.id}
        data-change-kind={change?.kind ?? "none"}
        style={cardStyle}
        className="cascade-card border-b border-[var(--color-border)] pb-3 last:border-b-0 last:pb-0"
      >
        {change && (
          <p className={`font-body text-xs font-medium ${CHANGE_MARKER_CLASS[change.kind]}`}>
            {changeMarkerText(change)}
          </p>
        )}
        <h3 className="font-display text-base text-[var(--color-text)]">{obligation.title}</h3>
        <p className="mt-0.5 truncate font-body text-sm text-[var(--color-muted)]">{obligation.instrument}</p>

        <details className="group mt-1.5">
          <summary className="affordance inline-flex cursor-pointer items-center gap-1 font-body text-xs font-medium text-[var(--color-accent)] [&::-webkit-details-marker]:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]">
            <span aria-hidden="true" className="affordance inline-block group-open:rotate-90">
              {"›"}
            </span>
            Details
          </summary>
          <p className="mt-2 font-body text-sm leading-relaxed text-[var(--color-muted)]">{obligation.detail}</p>
          {obligation.activeUntil && (
            <p className="mt-2 font-body text-sm text-[var(--color-muted)]">
              Runs until {formatDate(obligation.activeUntil)}
            </p>
          )}
          {sourceLink}
          <p className="mt-2 font-body text-xs text-[var(--color-muted)]">
            Checked against its source on {formatDate(obligation.verifiedOn)}
          </p>
        </details>
      </article>
    );
  }

  return (
    <article
      data-obligation-id={obligation.id}
      data-change-kind={change?.kind ?? "none"}
      style={cardStyle}
      className="cascade-card rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm"
    >
      <span
        className={`inline-flex items-center rounded-full border px-3 py-1 font-body text-xs font-medium uppercase tracking-wide ${STATUS_CLASS[obligation.status]}`}
      >
        {STATUS_LABEL[obligation.status]}
      </span>

      {obligation.dueDate && (
        <p className="mt-3 font-body text-sm text-[var(--color-muted)]">
          {formatDate(obligation.dueDate)}
          {phrase ? ` · ${phrase}` : null}
        </p>
      )}

      {!obligation.dueDate && obligation.activeUntil && (
        <p className="mt-3 font-body text-sm text-[var(--color-muted)]">
          Runs until {formatDate(obligation.activeUntil)}
        </p>
      )}

      {change && (
        <p className={`mt-1 font-body text-xs font-medium ${CHANGE_MARKER_CLASS[change.kind]}`}>
          {changeMarkerText(change)}
        </p>
      )}

      <h3 className="mt-2 font-display text-lg text-[var(--color-text)]">{obligation.title}</h3>

      {!hideAgency && <p className="mt-1 font-body text-sm text-[var(--color-muted)]">{obligation.agency}</p>}

      <p className="mt-2 font-body text-sm text-[var(--color-text)]">{obligation.instrument}</p>

      {sourceLink}

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
          Details
        </summary>
        <p className="mt-2 font-body text-sm leading-relaxed text-[var(--color-muted)]">
          {obligation.detail}
        </p>
      </details>
    </article>
  );
}
