// Small line icons for the Explore hub and Olympiad team cards. Decorative: always aria-hidden.
const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true, focusable: false };

export function IconEvents() {
  return (
    <svg {...base}>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
      <path d="M12 12.6l.9 1.9 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2L9.1 14.8l2-.3z" />
    </svg>
  );
}

export function IconFacts() {
  return (
    <svg {...base}>
      <ellipse cx="12" cy="12" rx="9" ry="3.6" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconTeams() {
  return (
    <svg {...base}>
      <circle cx="12" cy="14.5" r="5.5" />
      <path d="M12 11.8l.8 1.6 1.8.3-1.3 1.2.3 1.8-1.6-.85-1.6.85.3-1.8-1.3-1.2 1.8-.3z" />
      <path d="M8.5 9.8L6 3h4l2 4M15.5 9.8L18 3h-4l-2 4" />
    </svg>
  );
}

export function IconPublications() {
  return (
    <svg {...base}>
      <path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5z" />
      <path d="M12 6.5v13" />
    </svg>
  );
}

export function IconInterstellar() {
  return (
    <svg {...base}>
      <circle cx="12" cy="12" r="4.5" />
      <ellipse cx="12" cy="12" rx="10" ry="3.4" transform="rotate(-20 12 12)" />
      <path d="M19 3.5v2M18 4.5h2M4.5 18v2M3.5 19h2" />
    </svg>
  );
}

export function IconTerrestrial() {
  return (
    <svg {...base}>
      <path d="M2.5 19l6-9 3.5 5 2.5-3.5 7 7.5z" />
      <path d="M2.5 19h19" />
      <circle cx="17" cy="6" r="2" />
    </svg>
  );
}

export function IconHelix() {
  return (
    <svg {...base}>
      <path d="M7 3c0 4.5 10 4.5 10 9s-10 4.5-10 9" />
      <path d="M17 3c0 4.5-10 4.5-10 9s10 4.5 10 9" />
      <path d="M8.5 6h7M8.5 18h7M10 12h4" />
    </svg>
  );
}

export function IconArrow() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
