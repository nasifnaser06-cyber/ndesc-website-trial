import Link from "next/link";
import type { ReactNode } from "react";
import { type Locale, path } from "@/lib/i18n";
import { ui } from "@/content/ui";
import { site } from "@/content/site";

/** A "Register" button: the website's Register page, or the Google Form if site.registerWith is "form". */
export function RegisterButton({ lang, children, secondary = false }: { lang: Locale; children: ReactNode; secondary?: boolean }) {
  if (site.registerWith === "form" && site.forms.nessRegister) {
    return <FormButton href={site.forms.nessRegister} lang={lang} secondary={secondary}>{children}</FormButton>;
  }
  return <Link className={`btn ${secondary ? "btn-secondary" : ""}`} href={path(lang, "/ness/register")}>{children}</Link>;
}

/** Renders text and marks any [square bracket] part as a placeholder for the club to fill in. */
export function Txt({ children }: { children: string }) {
  const parts = children.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("[") && p.endsWith("]") ? (
          <span key={i} className="todo">
            {p}
          </span>
        ) : (
          p
        ),
      )}
    </>
  );
}
export function T({ text, lang }: { text: string; lang: Locale }) {
  return <Txt>{text}</Txt>;
}

const bp = () => process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** The club's own logo (public/brand/). Decorative where the club's name is written beside it.
 *  Width-based srcset (23 Nov 2026): the browser picks a file big enough for the size the logo is
 *  actually shown at (CSS can make it larger than `size`), so it is never stretched or blurred.
 *  `sizes` tells it that shown size; it defaults to `size`. */
export function Logo({ size = 44, alt = "", sizes }: { size?: number; alt?: string; sizes?: string }) {
  const src = (s: number) => `${bp()}/brand/ndesc-logo-${s}.png`;
  const set = [48, 96, 144, 192, 288, 384, 576].map((w) => `${src(w)} ${w}w`).join(", ");
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="logo-mark" src={src(144)} srcSet={set} sizes={sizes ?? `${size}px`} width={size} height={size} alt={alt} aria-hidden={alt ? undefined : true} />
  );
}

/** Notre Dame College's crest, on a light tile so its black lettering reads on the night background. */
export function CollegeCrest({ alt, sizes = "74px" }: { alt: string; sizes?: string }) {
  return (
    <span className="crest-tile">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${bp()}/brand/ndc-crest-144.png`}
        srcSet={[[72, 74], [144, 148], [216, 221], [288, 295], [432, 443]].map(([h, w]) => `${bp()}/brand/ndc-crest-${h}.png ${w}w`).join(", ")}
        sizes={sizes}
        width={74}
        height={72}
        alt={alt}
        loading="lazy"
      />
    </span>
  );
}

/** A few fixed stars for sky sections. Decorative only. */
export function Stars() {
  return <span className="stars" aria-hidden="true" />;
}

export function PhotoSlot({ label, lang, className = "", tall = false }: { label: string; lang: Locale; className?: string; tall?: boolean }) {
  return (
    <div className={`photo-slot ${tall ? "tall" : ""} ${className}`} role="img" aria-label={`${ui.photoSoon}: ${label}`}>
      <span>
        {ui.photoSoon}
        <br />
        <small>{label}</small>
      </span>
    </div>
  );
}

/** A button that goes to one of the club's forms, or says the link is coming when it is not set yet. */
export function FormButton({ href, children, lang, secondary = false }: { href: string | null; children: ReactNode; lang: Locale; secondary?: boolean }) {
  if (!href) {
    return (
      <span className={`btn ${secondary ? "btn-secondary" : ""} is-disabled`} aria-disabled="true">
        {children}
        <small className="btn-note">{ui.formSoon}</small>
      </span>
    );
  }
  return (
    <a className={`btn ${secondary ? "btn-secondary" : ""}`} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="visually-hidden"> {ui.newTab}</span>
    </a>
  );
}

export function PageHead({ kicker, title, lead, lang, crumbs }: { kicker?: string; title: string; lead?: string; lang: Locale; crumbs?: { label: string; to: string }[] }) {
  return (
    <header className="page-head wrap">
      {crumbs && crumbs.length > 0 && (
        <nav aria-label={ui.breadcrumb} className="crumbs">
          <ol>
            {crumbs.map((c) => (
              <li key={c.to}>
                <Link href={path(lang, c.to)}>{c.label}</Link>
              </li>
            ))}
          </ol>
        </nav>
      )}
      {kicker && <p className="label">{kicker}</p>}
      <h1>
        <T text={title} lang={lang} />
      </h1>
      {lead && (
        <p className="lead">
          <T text={lead} lang={lang} />
        </p>
      )}
    </header>
  );
}

export function SectionHead({ title, link, lang }: { title: string; link?: { label: string; to: string }; lang: Locale }) {
  return (
    <div className="section-head">
      <h2>{title}</h2>
      {link && <Link href={path(lang, link.to)}>{link.label}</Link>}
    </div>
  );
}

/** A link to another site (Facebook, Instagram) that opens in a new tab, and says so to screen readers. */
export function ExternalLink({ href, children, lang, className }: { href: string; children: ReactNode; lang: Locale; className?: string }) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="visually-hidden"> {ui.newTab}</span>
    </a>
  );
}

/** A person's card on the Executives and About pages. Photos only with consent. */
export function PersonCard({ name, post, department, photo, poster, lang }: { name: string; post: string; department?: string; photo?: string; poster?: string; lang: Locale }) {
  const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const role = department ? `${post}, ${department}` : post;
  return (
    <div className="person">
      {poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="person-poster"
          src={`${bp}${poster}-480.webp`}
          srcSet={`${bp}${poster}-480.webp 480w, ${bp}${poster}-960.webp 960w`}
          sizes="(min-width: 1280px) 290px, (min-width: 600px) 30vw, 46vw"
          alt={`${"Poster"}: ${name}, ${role}`}
          loading="lazy"
          decoding="async"
          width={960}
          height={960}
        />
      ) : photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="person-photo"
          src={`${bp}${photo}-400.webp`}
          srcSet={`${bp}${photo}-400.webp 400w, ${bp}${photo}-800.webp 800w`}
          sizes="(min-width: 1280px) 220px, (min-width: 600px) 25vw, 46vw"
          alt={name}
          loading="lazy"
          decoding="async"
          width={800}
          height={1000}
        />
      ) : (
        <PhotoSlot lang={lang} label={"photo"} />
      )}
      <h3><T text={name} lang={lang} /></h3>
      <p className="small muted">
        {/* Position only (Mahmud, 20 Nov 2026): the wing is already the heading above the cards. */}
        <T text={post} lang={lang} />
      </p>
    </div>
  );
}

/** A responsive banner or poster image (16:9 WebP files at several widths in public/). */
export function Banner({ name, widths, alt, lang, sizes = "(min-width: 1280px) 1216px, 100vw", priority = false, className = "", height = 1080 }: { name: string; widths: number[]; alt: string; lang: Locale; sizes?: string; priority?: boolean; className?: string; height?: number; social?: string }) {
  const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const largest = Math.max(...widths);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`banner ${className}`}
      src={`${bp}${name}-${largest}.webp`}
      srcSet={widths.map((w) => `${bp}${name}-${w}.webp ${w}w`).join(", ")}
      sizes={sizes}
      alt={alt}
      width={1920}
      height={height}
      style={height !== 1080 ? ({ ["--banner-ratio" as string]: `1920 / ${height}` } as React.CSSProperties) : undefined}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
    />
  );
}

/* Contact links with an icon (Lucide icons, ISC licence). Phone opens the dial pad, email opens a new
   message, and Facebook and Instagram use normal https links: phones open the app when it is installed
   and the website when it is not. */
type ContactKind = "phone" | "email" | "facebook" | "instagram";

const contactIcons: Record<ContactKind, ReactNode> = {
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />,
  email: <><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>,
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  instagram: <><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></>,
};

const contactNames: Record<ContactKind, string> = {
  phone: "Call",
  email: "Email",
  facebook: "Facebook",
  instagram: "Instagram",
};

export function ContactIcon({ kind }: { kind: ContactKind }) {
  return (
    <svg className="contact-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {contactIcons[kind]}
    </svg>
  );
}

/** The username part of a Facebook or Instagram address, e.g. "ndesc.official". */
export function handleOf(url: string) {
  return url.replace(/^https?:\/\/(www\.)?[^/]+\//, "").replace(/[/?#].*$/, "");
}

export function ContactLink({ kind, value, lang, className }: { kind: ContactKind; value: string; lang: Locale; className?: string }) {
  const cls = `contact-link${className ? ` ${className}` : ""}`;
  const name = <span className="visually-hidden">{contactNames[kind]}: </span>;
  if (kind === "phone") {
    return <a className={cls} href={`tel:${value.replace(/[^+\d]/g, "")}`}><ContactIcon kind="phone" />{name}<span>{value}</span></a>;
  }
  if (kind === "email") {
    // Never split the address mid-word: it fits on one line, or breaks once, after the @.
    const [user, domain] = value.split("@");
    return (
      <a className={`${cls} contact-email`} href={`mailto:${value}`}>
        <ContactIcon kind="email" />{name}
        <span><span>{user}@</span><wbr /><span>{domain}</span></span>
      </a>
    );
  }
  const handle = handleOf(value);
  return (
    <a className={cls} href={value} target="_blank" rel="noopener noreferrer">
      <ContactIcon kind={kind} />{name}
      <span>{handle}</span>
      <span className="visually-hidden"> {ui.newTab}</span>
    </a>
  );
}
