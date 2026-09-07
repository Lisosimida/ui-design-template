import React from "react";
import Link from "next/link";
import Reveal from "../shared/Reveal";

const FinalCta = ({ headline, subhead, cta }) => (
  <section style={{ padding: "40px 24px 80px" }}>
    <div style={{ maxWidth: 1040, margin: "0 auto" }}>
      <Reveal>
        <div
          style={{
            background: "var(--rl-ink)",
            color: "var(--rl-paper)",
            borderRadius: 28,
            padding: "48px 32px",
            textAlign: "center",
            transform: "rotate(-0.3deg)",
          }}
        >
          <h2 className="rl-display" style={{ margin: 0, fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 700, letterSpacing: "-0.01em" }}>
            {headline}
          </h2>
          {subhead && <p style={{ margin: "14px auto 0", fontSize: 16, opacity: 0.75, maxWidth: "48ch", fontWeight: 500 }}>{subhead}</p>}
          <Link
            href={cta.href}
            className="rl-btn"
            style={{
              marginTop: 28,
              background: "var(--rl-orange)",
              color: "var(--rl-orange-ink)",
              border: "3px solid var(--rl-paper)",
              boxShadow: "4px 4px 0 var(--rl-paper)",
              padding: "14px 30px",
              fontSize: 15,
            }}
          >
            {cta.label}
          </Link>
        </div>
      </Reveal>
    </div>
  </section>
);

export default FinalCta;
