"use client";

import Link from "next/link";

export type EventRowData = {
  slug: string;
  href: string;
  type: string;
  typeLabel: string;
  date: string;
  title: string;
  where: string;
  upcoming: boolean;
};

type Labels = { upcoming: string; past: string; all: string; allTypes: string; details: string; when: string; kind: string; empty: string };

function Row({ e, labels }: { e: EventRowData; labels: Labels }) {
  return (
    <li className="event-row">
      <p className="event-date">{e.date}</p>
      <div className="event-main">
        <h3>
          <Link href={e.href}>{e.title}</Link>
        </h3>
        <p className="small muted">
          {e.typeLabel}. {e.where}
        </p>
      </div>
      <p className="event-status">
        <span className={`tag ${e.upcoming ? "tag-up" : ""}`}>{e.upcoming ? labels.upcoming : labels.past}</span>
      </p>
    </li>
  );
}

/** Static list (used on the home page). */
export function EventRows({ items, labels }: { items: EventRowData[]; labels: Labels }) {
  return (
    <ul className="event-list">
      {items.map((e) => (
        <Row key={e.slug} e={e} labels={labels} />
      ))}
    </ul>
  );
}
