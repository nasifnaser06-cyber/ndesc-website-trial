"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

export type SegOption = { name: string; cats: string[]; online: boolean; team: boolean };
type Pass = "solo" | "team" | "online";
type Live = { open: boolean; bkash: string; nagad: string; prices: Record<Pass, number> };
type Result = { regId: string; status: string; teamCode?: string; newTeam?: boolean };

const PHONE = /^01[3-9]\d{8}$/;
const TRX = /^[A-Z0-9]{8,12}$/;
/** Bangla (০-৯) and Arabic-Indic (٠-٩, ۰-۹) digits from phone keyboards become 0-9. */
const asciiDigits = (s: string) =>
  s.replace(/[\u09E6-\u09EF\u0660-\u0669\u06F0-\u06F9]/g, (c) => {
    const n = c.charCodeAt(0);
    return String(n - (n >= 0x09e6 ? 0x09e6 : n >= 0x06f0 ? 0x06f0 : 0x0660));
  });
const normPhone = (s: string) => {
  let d = asciiDigits(s).replace(/\D/g, "");
  if (d.startsWith("880")) d = d.slice(2);
  if (d.length === 10 && d.startsWith("1")) d = "0" + d;
  return d;
};
const normTrx = (s: string) => asciiDigits(s).toUpperCase().replace(/[^A-Z0-9]/g, "");

/**
 * Class choices and the category each one belongs to (Mahmud, 20 Nov 2026, trial).
 * Bangladesh levels: pre-primary and Classes 1-5 primary, 6-8 junior secondary,
 * 9-10 secondary (SSC), 11-12 higher secondary (HSC). SSC 2027 candidates (added 23 Nov 2026)
 * are Secondary. O Levels/IGCSE count as Class 10,
 * A Levels (AS and A2) as Classes 11-12.
 */
const CLASS_GROUPS: { category: string; label: string; classes: string[] }[] = [
  { category: "P", label: "Primary (P)", classes: ["Pre-primary (before Class 1)", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5"] },
  { category: "J", label: "Junior (J)", classes: ["Class 6", "Class 7", "Class 8"] },
  { category: "S", label: "Secondary (S)", classes: ["Class 9", "Class 10 (SSC)", "SSC 2027", "O Level / IGCSE"] },
  { category: "HS", label: "Higher Secondary (HS)", classes: ["Class 11", "Class 12 (HSC)", "A Level (AS)", "A Level (A2)"] },
];
const CATEGORY_OF: Record<string, string> = Object.fromEntries(CLASS_GROUPS.flatMap((g) => g.classes.map((c) => [c, g.category])));

/** Which segments a pass includes for this category. Solo: all solo segments. Team: every segment. */
function allowed(seg: SegOption, category: string, pass: Pass) {
  if (pass === "online" && !seg.online) return false;
  if (pass === "solo" && seg.team) return false;
  return seg.cats.some((c) => c === category || c === "C" || c.startsWith("PS"));
}

async function call(endpoint: string, body: object) {
  const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(body) });
  return res.json();
}

export default function RegisterForm({
  endpoint, trial = false, fallback, googleForm, categories, segments, nessHref,
}: {
  endpoint: string | null;
  trial?: boolean;
  fallback: { bkash: string; nagad: string | null; prices: Record<Pass, number> };
  googleForm: string | null;
  categories: { code: string; name: string; who: string }[];
  segments: SegOption[];
  nessHref: string;
}) {
  const [live, setLive] = useState<Live>({ open: true, bkash: fallback.bkash, nagad: fallback.nagad ?? "", prices: fallback.prices });
  const [pass, setPass] = useState<Pass>("solo");
  const [className, setClassName] = useState("");
  const category = CATEGORY_OF[className] ?? "";
  const [wallet, setWallet] = useState("bKash");
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<Result | null>(null);
  const errorBox = useRef<HTMLDivElement>(null);
  const draft = !endpoint;

  // Live numbers, prices and open/closed from the sheet's Settings tab.
  useEffect(() => {
    if (!endpoint) return;
    fetch(endpoint).then((r) => r.json()).then((d) => {
      if (d && d.ok) setLive({ open: d.open, bkash: d.bkash || fallback.bkash, nagad: d.nagad || "", prices: d.prices || fallback.prices });
    }).catch(() => {});
  }, [endpoint, fallback.bkash, fallback.prices]);

  const included = useMemo(() => (category ? segments.filter((s) => allowed(s, category, pass)) : []), [segments, category, pass]);

  const price = live.prices[pass];
  const payNumber = wallet === "Nagad" ? live.nagad : live.bkash;


  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) || "").trim();
    const body = {
      action: "register",
      pass,
      name: v("name"),
      email: v("email"),
      phone: normPhone(v("phone")),
      institution: v("institution"),
      className,
      category,
      teamCode: normTrx(v("teamCode")),
      wallet: pass === "online" ? "" : wallet,
      trxId: pass === "online" ? "" : normTrx(v("trxId")),
      sender: pass === "online" ? "" : normPhone(v("sender")),
      // Kept for the sheet script, which still reads this field.
      consent: true,
      // Hidden spam trap: people never see it, so it stays empty for them.
      hp_field: v("hp_field"),
    };

    const errs: string[] = [];
    if (!body.name) errs.push("Enter your full name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) errs.push("Enter a valid email address. Your pass is sent there.");
    if (!PHONE.test(body.phone)) errs.push("Mobile number (near the top): enter your 11-digit number, like 01712345678.");
    if (!body.institution) errs.push("Enter your school or college.");
    if (!category) errs.push("Choose your class.");
    if (body.teamCode && !/^[A-Z0-9]{6}$/.test(body.teamCode)) errs.push("A team code has 6 letters and numbers.");
    if (pass !== "online") {
      if (!TRX.test(body.trxId)) errs.push("Enter the TrxID from your payment SMS. It has 8 to 12 letters and numbers, like DK481HDVPG.");
      if (!PHONE.test(body.sender)) errs.push("Number you paid from: enter the 11-digit bKash or Nagad number, like 01712345678.");
    }
    setErrors(errs);
    if (errs.length) { errorBox.current?.focus(); return; }

    if (draft) {
      setErrors(["This page is a draft and is not taking registrations yet. Please use the registration form for now."]);
      errorBox.current?.focus();
      return;
    }
    setBusy(true);
    try {
      const d = await call(endpoint!, body);
      if (d.ok) setDone({ regId: d.regId, status: d.status, teamCode: d.teamCode, newTeam: d.newTeam });
      else { setErrors(d.errors || [d.error || "Something went wrong. Please try again."]); errorBox.current?.focus(); }
    } catch {
      setErrors(["We couldn't reach the registration system. Check your internet and try again. You have not been charged twice: your payment is safe."]);
      errorBox.current?.focus();
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="surface reg-done" role="status" aria-live="polite">
        <h2>{done.status === "Verified" ? "You're registered" : "Registration received"}</h2>
        <p>Registration <strong>{done.regId}</strong>.</p>
        {done.status === "Verified" ? (
          <p>Your pass is on its way to your email. Check your spam folder if you don't see it in a few minutes.</p>
        ) : done.status === "Needs review" ? (
          <p>We couldn't match your payment automatically, so our team will check it by hand, usually within a day. You don't need to pay again.</p>
        ) : (
          <p>We're matching your payment now. Your pass usually arrives by email within a few minutes. Please don't pay again.</p>
        )}
        {done.teamCode && (
          <p className="reg-code">
            Team code: <strong>{done.teamCode}</strong>
            {done.newTeam && <span className="small muted"> Share this with your teammates. They type it in when they register.</span>}
          </p>
        )}
        <p><a href={nessHref}>Back to NESS X</a></p>
      </div>
    );
  }

  return (
    <div className="reg">
      {draft && (
        <div className="reg-draft" role="note">
          <strong>Draft page.</strong> This form isn't connected yet, so it can't take registrations.
          {googleForm && <> To register now, use the <a href={googleForm} target="_blank" rel="noopener noreferrer">registration form</a>.</>}
        </div>
      )}
      {!draft && trial && (
        <div className="reg-draft" role="note">
          <strong>Trial.</strong> This page is being tested by the organisers with small test payments. Please don't register here yet.
          {googleForm && <> To register, use the <a href={googleForm} target="_blank" rel="noopener noreferrer">registration form</a>.</>}
        </div>
      )}
      {!live.open && <div className="reg-draft" role="note"><strong>Registration is closed.</strong></div>}

      <form className="form reg-form" onSubmit={submit} noValidate>
        <div className="hp-trap" aria-hidden="true">
          <label>Leave this empty <input type="text" name="hp_field" tabIndex={-1} autoComplete="off" defaultValue="" /></label>
        </div>
        <fieldset>
          <legend><span className="reg-step">1</span> Choose your pass</legend>
          <div className="reg-passes">
            {([
              ["solo", "Solo pass", `${live.prices.solo} Tk`, "All solo segments in your category"],
              ["team", "Team pass", `${live.prices.team} Tk per person`, "Every segment, solo and team. Up to 3 per team, each registers"],
              ["online", "Online segments", "Free", "All online submission segments"],
            ] as const).map(([val, name, cost, note]) => (
              <label key={val} className="reg-pass" data-on={pass === val}>
                <input type="radio" name="pass" value={val} checked={pass === val} onChange={() => setPass(val)} />
                <span className="reg-pass-name">{name}</span>
                <span className="reg-pass-price">{cost}</span>
                <span className="small muted">{note}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend><span className="reg-step">2</span> Your details</legend>
          <div className="reg-grid">
            <div><label htmlFor="name">Full name</label><input id="name" name="name" autoComplete="name" required /></div>
            <div><label htmlFor="phone">Mobile number</label><input id="phone" name="phone" inputMode="tel" autoComplete="tel" placeholder="e.g. 01712345678" required /></div>
            <div><label htmlFor="email">Email (your pass is sent here)</label><input id="email" name="email" type="email" autoComplete="email" required /></div>
            <div><label htmlFor="institution">School or college</label><input id="institution" name="institution" autoComplete="organization" required /></div>
            <div>
              <label htmlFor="className">Class</label>
              <select id="className" name="className" value={className} onChange={(e) => setClassName(e.target.value)} aria-describedby="reg-category" required>
                <option value="">Choose your class</option>
                {CLASS_GROUPS.map((g) => (
                  <optgroup key={g.category} label={g.label}>
                    {g.classes.map((c) => <option key={c} value={c}>{c}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <span className="reg-label">Category</span>
              <output id="reg-category" className={`reg-category${category ? "" : " muted"}`} htmlFor="className" aria-live="polite">
                {category ? (() => { const c = categories.find((x) => x.code === category); return c ? `${c.name} (${c.code})` : category; })() : "Set by your class"}
              </output>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend><span className="reg-step">3</span> What your pass includes</legend>
          {!category ? (
            <p className="muted">Choose your class to see the segments your pass includes.</p>
          ) : (
            <>
              <p>
                {pass === "team"
                  ? "Your team pass includes every segment open to your category, solo and team. You don't need to pick."
                  : pass === "online"
                    ? "This covers every online submission segment open to your category. You don't need to pick."
                    : "Your solo pass includes every solo segment open to your category. You don't need to pick."}
              </p>
              <ul className="reg-included">
                {included.map((s) => (
                  <li key={s.name}>
                    <span>{s.name}</span>
                    {s.team && <span className="tag">Team</span>}
                    {s.online && <span className="tag tag-up">Online</span>}
                  </li>
                ))}
              </ul>
            </>
          )}
          <p className="small muted" style={{ marginTop: "var(--s3)" }}>The UNOOSA special committee has its own registration form. Full rules for each segment are on the <a href={nessHref}>NESS X page</a>.</p>
        </fieldset>

        {pass === "team" && (
          <fieldset>
            <legend><span className="reg-step">4</span> Your team</legend>
            <div className="reg-grid">
              <div className="reg-wide">
                <label htmlFor="teamCode">Team code (leave blank if you are the first in your team)</label>
                <input id="teamCode" name="teamCode" maxLength={6} placeholder="e.g. K7Q2MD" style={{ textTransform: "uppercase" }} />
                <p className="small muted" style={{ marginTop: "var(--s2)" }}>The first teammate gets a code after registering. The other two type it here.</p>
              </div>
            </div>
          </fieldset>
        )}

        {pass !== "online" && (
          <fieldset>
            <legend><span className="reg-step">{pass === "team" ? 5 : 4}</span> Pay, then enter your TrxID</legend>
            <div className="reg-pay surface">
              <p className="reg-pay-amount">Send <strong>{price} Tk</strong> to <strong>{payNumber || "[club number]"}</strong> ({wallet})</p>
              <ol className="small">
                <li>Open your {wallet} app (or dial {wallet === "Nagad" ? "*167#" : "*247#"}) and choose <strong>Send Money</strong>.</li>
                <li>Enter the number above and exactly {price} Tk.</li>
                <li>You'll get an SMS with a <strong>TrxID</strong>, like DK481HDVPG. Type it below.</li>
              </ol>
              <p className="small muted">No screenshots needed. One teammate can pay for the whole team ({live.prices.team * 2} Tk for two, {live.prices.team * 3} Tk for three): everyone then enters the same TrxID and team code.</p>
            </div>
            <div className="reg-grid">
              <div>
                <label htmlFor="wallet">Paid with</label>
                <select id="wallet" value={wallet} onChange={(e) => setWallet(e.target.value)}>
                  <option value="bKash">bKash</option>
                  {live.nagad && <option value="Nagad">Nagad</option>}
                </select>
              </div>
              <div><label htmlFor="trxId">TrxID</label><input id="trxId" name="trxId" autoComplete="off" placeholder="e.g. DK481HDVPG" style={{ textTransform: "uppercase" }} required /></div>
              <div className="reg-wide"><label htmlFor="sender">Number you paid from</label><input id="sender" name="sender" inputMode="tel" placeholder="e.g. 01712345678" required /></div>
            </div>
          </fieldset>
        )}

        <div ref={errorBox} tabIndex={-1} aria-live="assertive" className={errors.length ? "reg-errors" : ""}>
          {errors.length > 0 && (
            <>
              <p><strong>Please fix {errors.length === 1 ? "this" : "these"}:</strong></p>
              <ul>{errors.map((x) => <li key={x}>{x}</li>)}</ul>
            </>
          )}
        </div>

        <div className="actions">
          <button className="btn" type="submit" disabled={busy || !live.open}>{busy ? "Sending..." : pass === "online" ? "Register" : "Register and confirm payment"}</button>
        </div>
      </form>

      <StatusCheck endpoint={endpoint} />
    </div>
  );
}

function StatusCheck({ endpoint }: { endpoint: string | null }) {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  async function check(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const resend = f.get("resend") === "on";
    if (!endpoint) { setMsg("This page is a draft, so there is nothing to check yet."); return; }
    setBusy(true);
    try {
      const d = await call(endpoint, { action: "status", phone: normPhone(String(f.get("sphone") || "")), trxId: normTrx(String(f.get("strx") || "")), email: String(f.get("semail") || ""), resend });
      if (!d.ok) setMsg(d.error || "Not found.");
      else if (d.status === "Verified") setMsg(`Verified. Participant ID ${d.participantId}.${d.resent ? " We've emailed your pass again." : ""}`);
      else if (d.status === "Needs review") setMsg("Our team is checking your payment by hand. You don't need to pay again.");
      else setMsg("Waiting for your payment to be matched. This usually takes a few minutes after paying.");
    } catch {
      setMsg("We couldn't reach the registration system. Try again in a minute.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="reg-status" aria-labelledby="status-h">
      <h2 id="status-h">Check my registration</h2>
      <form className="form" onSubmit={(e) => check(e)}>
        <div className="reg-grid">
          <div><label htmlFor="sphone">Mobile number</label><input id="sphone" name="sphone" inputMode="tel" /></div>
          <div><label htmlFor="strx">TrxID (if you paid)</label><input id="strx" name="strx" style={{ textTransform: "uppercase" }} /></div>
          <div className="reg-wide"><label htmlFor="semail">Email (if you registered for online segments)</label><input id="semail" name="semail" type="email" /></div>
        </div>
        <label className="reg-seg"><input type="checkbox" name="resend" /><span>Email my pass again if I'm verified</span></label>
        <div className="actions">
          <button className="btn btn-secondary" type="submit" disabled={busy}>Check status</button>
        </div>
        <p aria-live="polite" className="reg-status-msg">{msg}</p>
      </form>
    </section>
  );
}
