import Link from "next/link";

/**
 * "Register for NESS X": the icy gradient button with a frost sheen that crosses it once.
 * The snowflake crystals were taken off on 23 Nov 2026 (Mahmud: keep the button, remove the flakes).
 */

export default function IceButton({ href, external, label = "Register for NESS X", shortLabel = "Register", note }: {
  href: string;
  external?: boolean;
  label?: string;
  /** Shown instead of the label on phones, where the header is narrow. */
  shortLabel?: string;
  note?: string;
}) {
  const Tag = (external ? "a" : Link) as React.ElementType;
  return (
    <Tag
      className="btn btn-small join-btn ice-btn"
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className="ice-label"><span className="ice-label-long">{label}</span><span className="ice-label-short">{shortLabel}</span></span>
      {note && <span className="visually-hidden"> {note}</span>}
    </Tag>
  );
}
