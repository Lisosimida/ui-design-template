import React from "react";

function SparkleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3z" />
    </svg>
  );
}

const Footer = ({ brand, note, links = [] }) => (
  <footer style={{ borderTop: "2px dashed rgba(15, 12, 8, 0.2)", padding: "28px 24px" }}>
    <div
      className="flex flex-col items-center text-center gap-3 sm:flex-row sm:justify-between sm:text-left"
      style={{ maxWidth: 1040, margin: "0 auto" }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700 }} className="rl-display">
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 20,
            height: 20,
            borderRadius: 999,
            background: "var(--rl-orange)",
            color: "var(--rl-orange-ink)",
            border: "2px solid var(--rl-ink)",
          }}
        >
          <SparkleIcon />
        </span>
        {brand}
      </span>

      {note && (
        <p style={{ margin: 0, fontSize: 13, color: "var(--rl-muted)", fontWeight: 500 }}>{note}</p>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {links.map((l) => (
          <a key={l.label} href={l.href} style={{ fontSize: 13, fontWeight: 600, color: "var(--rl-muted)" }}>
            {l.label}
          </a>
        ))}
        <span style={{ fontSize: 12, color: "var(--rl-muted)", fontWeight: 500 }}>
          © {new Date().getFullYear()} {brand}
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
