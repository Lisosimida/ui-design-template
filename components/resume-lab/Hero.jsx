import React from "react";
import Link from "next/link";
import Reveal from "../shared/Reveal";

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3z" />
    </svg>
  );
}

function CloudUploadIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--rl-orange-ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 16V4" />
      <path d="M7 9l5-5 5 5" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  );
}

function CardIconSm() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

// Small trust/privacy signal under the hero CTAs — asking for an upload of
// something personal before any value is shown benefits from an upfront
// reassurance rather than burying it in a footer.
function TrustLine({ icon, label }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--rl-muted)", fontSize: 13, fontWeight: 600 }}>
      {icon}
      {label}
    </div>
  );
}

// Splits the headline so the final word (the "punchline") gets the
// hand-drawn squiggle underline, matching the Resume Lab canvas mockup.
function HeadlineWithSquiggle({ headline }) {
  const words = headline.trim().split(" ");
  const last = words.pop();
  const lead = words.join(" ");

  return (
    <>
      {lead}
      {lead ? <br /> : null}
      <span style={{ position: "relative", display: "inline-block" }}>
        {last}
        <svg width="100%" height="14" viewBox="0 0 220 14" style={{ position: "absolute", left: 0, bottom: -6, width: "100%" }} preserveAspectRatio="none">
          <path d="M2 10 C 40 2, 80 2, 110 8 S 180 14, 218 4" fill="none" stroke="var(--rl-orange)" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </span>
    </>
  );
}

const Hero = ({ eyebrow, headline, subhead, primaryCta, secondaryCta }) => (
  <section style={{ position: "relative", padding: "56px 24px 40px" }}>
    <div
      className="rl-hero-grid"
      style={{
        maxWidth: 1040,
        margin: "0 auto",
        display: "grid",
        gap: 48,
        alignItems: "center",
      }}
    >
      <Reveal>
        <div className="rl-eyebrow">
          <SparkleIcon />
          {eyebrow}
        </div>

        <h1 className="rl-display" style={{ margin: "24px 0 0", fontSize: "clamp(34px, 5vw, 52px)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.01em" }}>
          <HeadlineWithSquiggle headline={headline} />
        </h1>

        <p style={{ margin: "20px 0 0", fontSize: 17, color: "var(--rl-muted)", maxWidth: "50ch", fontWeight: 500 }}>{subhead}</p>

        <div style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: 14 }}>
          <Link href={primaryCta.href} className="rl-btn rl-btn-primary">
            {primaryCta.label}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </Link>
          <Link href={secondaryCta.href} className="rl-btn rl-btn-outline" style={{ border: "3px solid var(--rl-ink)" }}>
            {secondaryCta.label}
          </Link>
        </div>

        <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 20px" }}>
          <TrustLine icon={<LockIcon />} label="Private by default" />
          <TrustLine icon={<CardIconSm />} label="No credit card required" />
        </div>
      </Reveal>

      <Reveal delay={0.12}>
        <div style={{ position: "relative", maxWidth: 380, margin: "0 auto" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--rl-ink)",
              borderRadius: 28,
              transform: "rotate(1.2deg) translate(9px, 9px)",
            }}
          />
          <div
            className="rl-card"
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              padding: "40px 24px",
              borderRadius: 28,
              borderStyle: "dashed",
              transform: "rotate(-0.6deg)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 64,
                borderRadius: 999,
                background: "var(--rl-orange)",
                border: "3px solid var(--rl-ink)",
                boxShadow: "5px 5px 0 var(--rl-ink)",
              }}
            >
              <CloudUploadIcon />
            </div>
            <div style={{ textAlign: "center" }}>
              <p className="rl-display" style={{ margin: 0, fontSize: 19, fontWeight: 700 }}>
                Drag & drop your resume
              </p>
              <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--rl-muted)", fontWeight: 500 }}>or browse from your computer</p>
            </div>
            <span className="rl-btn rl-btn-primary" style={{ padding: "12px 26px", fontSize: 14 }}>
              Browse files
            </span>
          </div>

          <div
            className="rl-sticker"
            style={{ position: "absolute", top: -16, right: -12, background: "var(--rl-lime)", color: "var(--rl-lime-ink)", transform: "rotate(6deg)" }}
          >
            <LockIcon />
            Private &amp; yours only
          </div>
          <div
            className="rl-sticker"
            style={{ position: "absolute", bottom: -14, left: -14, background: "var(--rl-pink)", color: "var(--rl-orange-ink)", transform: "rotate(-5deg)" }}
          >
            <BoltIcon />
            Results in ~30 sec
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default Hero;
