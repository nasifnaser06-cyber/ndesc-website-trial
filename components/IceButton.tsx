import Link from "next/link";

/**
 * "Register for NESS X" with ice that forms on the button.
 * Crystals draw themselves out from their centres (stroke), grow and settle, then a frost sheen
 * crosses the button once. Hover re-forms the ice. Idle: a faint, slow twinkle.
 * Reduced motion: the frost is simply there, nothing moves.
 */

type Crystal = { x: string; y: string; dx: number; dy: number; r: number; spin: number; cls: string };

// Six arms, each with two side branches: the classic ice-crystal (stellar dendrite) shape.
function crystalPath(r: number) {
  const parts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    const ex = Math.cos(a) * r, ey = Math.sin(a) * r;
    parts.push(`M0 0L${ex.toFixed(2)} ${ey.toFixed(2)}`);
    for (const t of [0.45, 0.72]) {
      const bx = Math.cos(a) * r * t, by = Math.sin(a) * r * t;
      const len = r * (t === 0.45 ? 0.38 : 0.26);
      for (const side of [-1, 1]) {
        const b = a + side * (Math.PI / 3);
        parts.push(`M${bx.toFixed(2)} ${by.toFixed(2)}L${(bx + Math.cos(b) * len).toFixed(2)} ${(by + Math.sin(b) * len).toFixed(2)}`);
      }
    }
  }
  return parts.join("");
}

// Placed in the button's side padding and just inside its rim, clear of the label.
const crystals: Crystal[] = [
  { x: "0", y: "50%", dx: 15, dy: 0, r: 8, spin: -24, cls: "c1" },
  { x: "100%", y: "50%", dx: -15, dy: 0, r: 8, spin: 18, cls: "c2" },
  { x: "100%", y: "0", dx: -36, dy: 6, r: 3.6, spin: -12, cls: "c3" },
  { x: "0", y: "100%", dx: 34, dy: -6, r: 3.6, spin: 30, cls: "c4" },
];

export default function IceButton({ href, external, label = "Register for NESS X", note }: {
  href: string;
  external?: boolean;
  label?: string;
  note?: string;
}) {
  const Tag = (external ? "a" : Link) as React.ElementType;
  return (
    <Tag
      className="btn btn-small join-btn ice-btn"
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <svg className="ice" aria-hidden="true" focusable="false">
        {crystals.map((c) => (
          <svg key={c.cls} x={c.x} y={c.y} overflow="visible">
            {/* Outer layer: forms once on load. Inner layer: re-forms on hover. */}
            <g className={`crystal ${c.cls}`} style={{ ["--spin" as string]: `${c.spin}deg` }}>
              <g className="crystal-hover">
                <path d={crystalPath(c.r)} pathLength={1} transform={`translate(${c.dx} ${c.dy})`} />
              </g>
            </g>
          </svg>
        ))}
      </svg>
      <span className="ice-label">{label}</span>
      {note && <span className="visually-hidden"> {note}</span>}
    </Tag>
  );
}
