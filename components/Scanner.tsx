"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

// NESS X check-in scanner. Reads the participant's QR code with the phone camera, asks the
// check-in web app in the NESS X Summit sheet, and shows Registered, Already scanned or
// Not registered with the pass. The web app address and key come from the scanner link
// (ndesc.com/scan/#<web app id>.<key>) and are remembered on the phone.

type Link = { endpoint: string; key: string };
type Answer = {
  ok: boolean;
  error?: string;
  result?: "registered" | "already" | "unpaid" | "not_registered";
  name?: string;
  participantId?: string;
  pass?: string;
  firstAt?: string;
  firstBy?: string;
  sheet?: string;
};
type BarcodeDetectorLike = { detect(src: CanvasImageSource): Promise<{ rawValue: string }[]> };

const STORE_LINK = "ndesc-scan-link";
const STORE_PHONE = "ndesc-scan-phone";
const PHONES = ["Jarif's phone", "Rion's phone"]; // the two scanning phones at NESS X

function readLink(): Link | null {
  const fromHash = (h: string): Link | null => {
    const raw = decodeURIComponent(h.replace(/^#/, ""));
    const dot = raw.lastIndexOf(".");
    if (dot < 1) return null;
    const id = raw.slice(0, dot), key = raw.slice(dot + 1);
    if (!/^[A-Za-z0-9]{16,}$/.test(key)) return null;
    if (/^https?:\/\//.test(id)) return { endpoint: id, key }; // full address, used in local tests
    if (!/^[A-Za-z0-9_-]{20,}$/.test(id)) return null;
    return { endpoint: `https://script.google.com/macros/s/${id}/exec`, key };
  };
  try {
    const fromQuery = new URLSearchParams(window.location.search).get("l");
    const link = fromHash(window.location.hash) || (fromQuery ? fromHash(fromQuery) : null);
    if (link) {
      localStorage.setItem(STORE_LINK, JSON.stringify(link));
      return link;
    }
    const saved = localStorage.getItem(STORE_LINK);
    return saved ? (JSON.parse(saved) as Link) : null;
  } catch {
    const q = new URLSearchParams(window.location.search).get("l");
    return fromHash(window.location.hash) || (q ? fromHash(q) : null);
  }
}

/** Messenger, Facebook, Instagram and other in-app browsers usually block the camera. */
function inAppBrowser(): { inApp: boolean; android: boolean } {
  const ua = navigator.userAgent || "";
  const inApp = /FBAN|FBAV|FB_IAB|FBIOS|MESSENGER|Messenger|Instagram|Line\/|MicroMessenger|; wv\)/.test(ua);
  return { inApp, android: /Android/i.test(ua) };
}

/** The same scanner link with the key in the query, so it survives the jump to Chrome. */
function chromeLinks(link: Link): { https: string; intent: string } {
  const m = link.endpoint.match(/\/macros\/s\/([^/]+)\/exec$/);
  const id = m ? m[1] : link.endpoint;
  const q = `?l=${encodeURIComponent(`${id}.${link.key}`)}`;
  const path = window.location.pathname;
  return {
    https: `${window.location.origin}${path}${q}`,
    intent: `intent://${window.location.host}${path}${q}#Intent;scheme=${window.location.protocol.replace(":", "")};package=com.android.chrome;end`,
  };
}


async function ask(link: Link, body: object): Promise<Answer> {
  const res = await fetch(link.endpoint, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ ...body, key: link.key }),
  });
  return res.json();
}

const C = {
  night: "#0F1E36", panel: "#172A4A", line: "#2E4670", star: "#E9EEF6", haze: "#A9B7CC", sprout: "#8FD3A6",
  green: "#17733F", amber: "#8A5A00", red: "#A3271D",
};

const btn: React.CSSProperties = {
  minHeight: 52, padding: "0 22px", borderRadius: 12, border: "none", fontSize: 18, fontWeight: 700,
  background: C.sprout, color: C.night, cursor: "pointer", fontFamily: "inherit",
};
const ghost: React.CSSProperties = { ...btn, background: "transparent", color: C.star, border: `1px solid ${C.line}` };
const input: React.CSSProperties = {
  minHeight: 52, padding: "0 14px", borderRadius: 12, border: `1px solid ${C.line}`, background: C.panel,
  color: C.star, fontSize: 18, fontFamily: "inherit", width: "100%", boxSizing: "border-box",
};

export default function Scanner() {
  const [link, setLink] = useState<Link | null | undefined>(undefined);
  const [phone, setPhone] = useState("");
  const [connected, setConnected] = useState<"checking" | "yes" | "no">("checking");
  const [connError, setConnError] = useState("");
  const [camera, setCamera] = useState<"off" | "on" | "error">("off");
  const [cameraError, setCameraError] = useState("");
  const [busy, setBusy] = useState(false);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [lastValue, setLastValue] = useState("");
  const [typed, setTyped] = useState("");
  const [typedError, setTypedError] = useState("");
  const [browser, setBrowser] = useState<{ inApp: boolean; android: boolean }>({ inApp: false, android: false });
  const [tryHere, setTryHere] = useState(false);
  const [copied, setCopied] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanningRef = useRef(false);
  const detectorRef = useRef<BarcodeDetectorLike | null>(null);
  // After "Scan next" the last person's QR is often still in view: ignore that code for a moment.
  const ignoreRef = useRef<{ value: string; until: number }>({ value: "", until: 0 });

  useEffect(() => {
    setLink(readLink());
    try { setPhone(localStorage.getItem(STORE_PHONE) || ""); } catch { /* private mode */ }
    setBrowser(inAppBrowser());
    if (window.location.hash || window.location.search) history.replaceState(null, "", window.location.pathname); // keep the key off the screen
  }, []);

  useEffect(() => {
    if (!link) return;
    setConnected("checking");
    ask(link, { action: "ping" })
      .then((a) => { if (a.ok) setConnected("yes"); else { setConnected("no"); setConnError(a.error || ""); } })
      .catch(() => { setConnected("no"); setConnError("No answer from the sheet. Check the internet."); });
  }, [link]);

  // ---------------------------------------------------------------- camera
  // genRef: every new scanning run gets a number; an older run that wakes up after it stops.
  // A watchdog restarts the camera if the picture freezes (track ended, video paused, or no
  // new frames for 2.5 s), and the camera is released when the screen locks and reopened after.

  const genRef = useRef(0);
  const wantCameraRef = useRef(false);
  const pausedForResultRef = useRef(false);
  const frameRef = useRef({ t: -1, at: 0 });
  const restartingRef = useRef(false);
  const checkRef = useRef<(v: string) => void>(() => {});

  const releaseStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const openStream = useCallback(async () => {
    releaseStream();
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
    streamRef.current = stream;
    const video = videoRef.current;
    if (video) {
      video.srcObject = stream;
      await video.play().catch(() => { /* the watchdog tries again */ });
    }
  }, []);

  const scanFrame = useCallback(async (gen: number) => {
    if (gen !== genRef.current || !scanningRef.current) return;
    const video = videoRef.current;
    const track = streamRef.current?.getVideoTracks()[0];
    if (!video || !track || track.readyState === "ended") { restartRef.current(); return; }
    if (video.paused) video.play().catch(() => {});
    const now = Date.now();
    if (video.currentTime !== frameRef.current.t) frameRef.current = { t: video.currentTime, at: now };
    else if (now - frameRef.current.at > 2500) { restartRef.current(); return; }

    if (video.readyState >= 2 && video.videoWidth) {
      let value = "";
      try {
        if (detectorRef.current) {
          const found = await detectorRef.current.detect(video);
          value = found[0]?.rawValue || "";
        } else {
          const canvas = canvasRef.current || (canvasRef.current = document.createElement("canvas"));
          const scale = Math.min(1, 640 / video.videoWidth);
          canvas.width = Math.round(video.videoWidth * scale);
          canvas.height = Math.round(video.videoHeight * scale);
          const g = canvas.getContext("2d", { willReadFrequently: true });
          if (g) {
            g.drawImage(video, 0, 0, canvas.width, canvas.height);
            const img = g.getImageData(0, 0, canvas.width, canvas.height);
            value = jsQR(img.data, img.width, img.height, { inversionAttempts: "dontInvert" })?.data || "";
          }
        }
      } catch { /* try the next frame */ }
      if (gen !== genRef.current || !scanningRef.current) return;
      value = value.trim();
      const ign = ignoreRef.current;
      if (value && value === ign.value && Date.now() < ign.until) value = "";
      if (value) { checkRef.current(value); return; }
    }
    setTimeout(() => scanFrame(gen), 120);
  }, []);

  const beginScanning = useCallback(() => {
    genRef.current += 1;
    scanningRef.current = true;
    pausedForResultRef.current = false;
    frameRef.current = { t: -1, at: Date.now() };
    scanFrame(genRef.current);
  }, [scanFrame]);

  const stopScanning = () => { genRef.current += 1; scanningRef.current = false; };

  const restart = useCallback(async () => {
    if (restartingRef.current || !wantCameraRef.current) return;
    restartingRef.current = true;
    stopScanning();
    try {
      await openStream();
      if (!pausedForResultRef.current) beginScanning();
    } catch {
      setCamera("error");
      setCameraError("The camera stopped. Tap Start scanning to turn it on again.");
      wantCameraRef.current = false;
    } finally {
      restartingRef.current = false;
    }
  }, [openStream, beginScanning]);
  const restartRef = useRef<() => void>(() => {});
  useEffect(() => { restartRef.current = () => { restart(); }; }, [restart]);

  const stopCamera = useCallback(() => {
    wantCameraRef.current = false;
    stopScanning();
    releaseStream();
    setCamera("off");
  }, []);
  useEffect(() => stopCamera, [stopCamera]);

  // Screen locked or app switched: let go of the camera, and take it back on return.
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) { stopScanning(); releaseStream(); }
      else if (wantCameraRef.current) restartRef.current();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const check = useCallback(async (value: string) => {
    if (!link) return;
    stopScanning();
    pausedForResultRef.current = true;
    setLastValue(value);
    setBusy(true);
    setAnswer(null);
    try {
      const a = await ask(link, { action: "scan", code: value, device: phone });
      setAnswer(a);
      if (a.ok && navigator.vibrate) navigator.vibrate(a.result === "registered" ? 120 : [90, 70, 90, 70, 90]);
    } catch {
      setAnswer({ ok: false, error: "No answer from the sheet. Check the internet and try again." });
    } finally {
      setBusy(false);
    }
  }, [link, phone]);
  useEffect(() => { checkRef.current = (v) => { check(v); }; }, [check]);

  const startCamera = useCallback(async () => {
    setCameraError("");
    wantCameraRef.current = true;
    try {
      await openStream();
      const W = window as unknown as { BarcodeDetector?: { new (o: object): BarcodeDetectorLike; getSupportedFormats?: () => Promise<string[]> } };
      if (!detectorRef.current && W.BarcodeDetector) {
        try {
          const formats = (await W.BarcodeDetector.getSupportedFormats?.()) || [];
          if (formats.includes("qr_code")) detectorRef.current = new W.BarcodeDetector({ formats: ["qr_code"] });
        } catch { /* use jsQR */ }
      }
      setCamera("on");
      beginScanning();
    } catch (e) {
      wantCameraRef.current = false;
      setCamera("error");
      setCameraError(e instanceof Error && e.name === "NotAllowedError"
        ? "Camera blocked. Allow the camera for ndesc.com in the browser settings, then tap Start again."
        : "The camera could not start. Close other apps using it and try again.");
    }
  }, [openStream, beginScanning]);

  const next = useCallback(() => {
    ignoreRef.current = { value: lastValue, until: Date.now() + 3000 };
    setAnswer(null);
    setTyped("");
    setTypedError("");
    pausedForResultRef.current = false;
    if (!wantCameraRef.current) return;
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track || track.readyState === "ended") { restartRef.current(); return; }
    videoRef.current?.play().catch(() => {});
    beginScanning();
  }, [lastValue, beginScanning]);

  const submitTyped = (e: React.FormEvent) => {
    e.preventDefault();
    const v = typed.trim();
    if (!v) { setTypedError("Type a Participant ID first, like NESSX-10000."); return; }
    setTypedError("");
    check(v);
  };

  // ---------------------------------------------------------------- screens

  const shell = (children: React.ReactNode) => (
    <main style={{ maxWidth: 520, margin: "0 auto", padding: "16px 16px 40px", boxSizing: "border-box", minHeight: "100dvh" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, color: C.haze }}>NESS X</div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Check-in scanner</div>
        </div>
        {link && phone && (
          <div style={{ textAlign: "right", fontSize: 13, color: C.haze }}>
            <div>
              {phone}{" "}
              <button type="button" onClick={() => { try { localStorage.removeItem(STORE_PHONE); } catch { /* private mode */ } setPhone(""); }}
                style={{ background: "none", border: "none", color: C.star, textDecoration: "underline", padding: "0 0 0 4px", font: "inherit", cursor: "pointer" }}>
                Change
              </button>
            </div>
            <div aria-live="polite">
              <span aria-hidden="true" style={{ display: "inline-block", width: 8, height: 8, borderRadius: 4, marginRight: 6,
                background: connected === "yes" ? C.sprout : connected === "no" ? "#F08A7E" : C.haze }} />
              {connected === "yes" ? "Connected" : connected === "no" ? "Not connected" : "Connecting…"}
            </div>
          </div>
        )}
      </header>
      {children}
    </main>
  );

  if (link === undefined) return shell(null);

  if (!link) {
    return shell(
      <section style={{ background: C.panel, borderRadius: 16, padding: 20, lineHeight: 1.6 }}>
        <h1 style={{ fontSize: 22, margin: "0 0 8px" }}>Open the scanner link</h1>
        <p style={{ margin: 0, color: C.haze }}>This page only works from the scanner link. In the NESS X Summit sheet, use the menu NESS X check-in, then Show the scanner link, and open that link on this phone.</p>
      </section>,
    );
  }

  if (browser.inApp && !tryHere) {
    const links = chromeLinks(link);
    return shell(
      <section style={{ background: C.panel, borderRadius: 16, padding: 20, lineHeight: 1.6 }}>
        <h1 style={{ fontSize: 22, margin: "0 0 8px" }}>Open this in Chrome</h1>
        <p style={{ margin: "0 0 16px", color: C.haze }}>This app's built-in browser blocks the camera, so the scanner can't work here.</p>
        {browser.android ? (
          <a href={links.intent} style={{ ...btn, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", width: "100%", boxSizing: "border-box" }}>
            Open in Chrome
          </a>
        ) : (
          <p style={{ margin: "0 0 12px" }}>Tap <b>⋯</b> or the share button at the top, then <b>Open in browser</b> (Safari or Chrome).</p>
        )}
        <button
          type="button"
          style={{ ...ghost, width: "100%", marginTop: 10 }}
          onClick={async () => {
            try { await navigator.clipboard.writeText(links.https); setCopied(true); } catch { setCopied(false); }
          }}
        >
          {copied ? "Link copied. Paste it into Chrome." : "Copy the scanner link"}
        </button>
        <p style={{ margin: "16px 0 0", fontSize: 14, color: C.haze }}>
          Keep this link private: anyone with it can check people in.{" "}
          <button type="button" onClick={() => setTryHere(true)} style={{ background: "none", border: "none", color: C.star, textDecoration: "underline", padding: 0, font: "inherit", cursor: "pointer" }}>
            Try here anyway
          </button>
        </p>
      </section>,
    );
  }

  if (!phone) {
    const choose = (p: string) => {
      try { localStorage.setItem(STORE_PHONE, p); } catch { /* private mode */ }
      setPhone(p);
    };
    return shell(
      <section style={{ background: C.panel, borderRadius: 16, padding: 20 }}>
        <h1 style={{ fontSize: 22, margin: "0 0 6px" }}>Whose phone is this?</h1>
        <p style={{ margin: "0 0 16px", color: C.haze, lineHeight: 1.5 }}>It shows in the sheet next to every scan.</p>
        {PHONES.map((p) => (
          <button key={p} type="button" style={{ ...btn, width: "100%", marginTop: 10 }} onClick={() => choose(p)}>{p}</button>
        ))}
      </section>,
    );
  }

  const res = answer?.ok ? answer.result : undefined;
  const panel = res && {
    registered: { bg: C.green, title: "Registered" },
    already: { bg: C.amber, title: "Already scanned" },
    unpaid: { bg: C.red, title: "Not registered" },
    not_registered: { bg: C.red, title: "Not registered" },
  }[res];

  return shell(
    <>
      {connected === "no" && (
        <p role="alert" style={{ background: "#3A1D24", border: "1px solid #7A3340", borderRadius: 12, padding: "10px 14px", margin: "0 0 12px", lineHeight: 1.5 }}>
          {connError || "Not connected to the sheet."}
        </p>
      )}

      {/* Camera view, hidden (but kept running) while a result is on screen */}
      <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "#000", aspectRatio: "1 / 1", display: answer || busy ? "none" : "block" }}>
        <video ref={videoRef} playsInline muted autoPlay style={{ width: "100%", height: "100%", objectFit: "cover", display: camera === "on" ? "block" : "none" }} />
        {camera === "on" && (
          <div aria-hidden="true" style={{ position: "absolute", inset: "18%", border: `3px solid ${C.sprout}`, borderRadius: 18, boxShadow: "0 0 0 2000px rgba(15,30,54,.35)" }} />
        )}
        {camera !== "on" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: 20, textAlign: "center" }}>
            <button type="button" style={btn} onClick={startCamera}>Start scanning</button>
            {cameraError && <p role="alert" style={{ margin: 0, color: "#F6B4AA", lineHeight: 1.5 }}>{cameraError}</p>}
          </div>
        )}
      </div>
      {camera === "on" && !answer && !busy && <p style={{ textAlign: "center", color: C.haze, margin: "10px 0 0" }}>Point the camera at the QR code</p>}

      {busy && (
        <div aria-live="polite" style={{ background: C.panel, borderRadius: 16, padding: "48px 20px", textAlign: "center", fontSize: 24, fontWeight: 700 }}>Checking…</div>
      )}

      {answer && (
        <section aria-live="assertive" style={{ background: panel ? panel.bg : C.panel, borderRadius: 16, padding: "26px 20px", color: "#fff" }}>
          {panel ? (
            <>
              <h1 style={{ fontSize: 38, lineHeight: 1.1, margin: 0, fontWeight: 800 }}>{panel.title}</h1>
              {res === "unpaid" && <p style={{ fontSize: 18, margin: "10px 0 0" }}>Payment not confirmed yet. Send them to the help desk.</p>}
              {answer.pass && res !== "unpaid" && <p style={{ fontSize: 28, fontWeight: 800, margin: "14px 0 0" }}>{answer.pass}</p>}
              {res === "already" && <p style={{ fontSize: 18, margin: "10px 0 0" }}>First scanned {answer.firstAt}{answer.firstBy ? ` on ${answer.firstBy}` : ""}</p>}
              {answer.name && (
                <p style={{ fontSize: 16, margin: "16px 0 0", opacity: 1, color: "rgba(255,255,255,.88)" }}>
                  {answer.name}{answer.participantId ? ` · ${answer.participantId}` : ""}
                </p>
              )}
            </>
          ) : (
            <>
              <h1 style={{ fontSize: 24, margin: 0 }}>Could not check</h1>
              <p style={{ margin: "8px 0 0", lineHeight: 1.5, color: C.haze }}>{answer.error}</p>
              {lastValue && <button type="button" style={{ ...ghost, marginTop: 14 }} onClick={() => check(lastValue)}>Try again</button>}
            </>
          )}
        </section>
      )}
      {answer && (
        <button type="button" style={{ ...btn, width: "100%", marginTop: 12, minHeight: 60, fontSize: 20 }} onClick={next} autoFocus>
          Scan next
        </button>
      )}

      <form onSubmit={submitTyped} style={{ marginTop: 22, display: answer || busy ? "none" : "block" }} noValidate>
        <label htmlFor="typed" style={{ display: "block", fontSize: 14, color: C.haze, marginBottom: 6 }}>QR won't scan? Type the Participant ID</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input id="typed" style={input} value={typed} placeholder="NESSX-10000" autoCapitalize="characters" autoComplete="off"
            onChange={(e) => { setTyped(e.target.value); setTypedError(""); }} aria-invalid={Boolean(typedError)} aria-describedby="typed-err" />
          <button type="submit" style={ghost}>Check</button>
        </div>
        {typedError && <p id="typed-err" role="alert" style={{ color: "#F6B4AA", fontSize: 14, margin: "6px 0 0" }}>{typedError}</p>}
      </form>

      {camera === "on" && !answer && !busy && (
        <p style={{ textAlign: "center", marginTop: 18 }}>
          <button type="button" style={{ ...ghost, minHeight: 44, fontSize: 15 }} onClick={stopCamera}>Stop camera</button>
        </p>
      )}
    </>,
  );
}
