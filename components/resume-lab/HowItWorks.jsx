import React from "react";
import Reveal from "../shared/Reveal";

const DOT_COLORS = ["var(--rl-blue)", "var(--rl-orange)", "var(--rl-lime)"];

const HowItWorks = ({ id, eyebrow, heading, items = [] }) => (
  <section id={id} style={{ padding: "40px 24px" }}>
    <div style={{ maxWidth: 1040, margin: "0 auto", textAlign: "center" }}>
      <Reveal>
        <div className="rl-eyebrow" style={{ margin: "0 auto" }}>
          {eyebrow}
        </div>
        <h2
          className="rl-display"
          style={{ margin: "20px auto 0", fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 700, letterSpacing: "-0.01em", maxWidth: "36ch" }}
        >
          {heading}
        </h2>
      </Reveal>

      <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, textAlign: "left" }}>
        {items.map((item, i) => (
          <Reveal key={item.step} delay={i * 0.05}>
            <div className="rl-card rl-card-hover" style={{ height: "100%", padding: 24 }}>
              <span
                className="rl-display"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  background: DOT_COLORS[i % DOT_COLORS.length],
                  border: "2.5px solid var(--rl-ink)",
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                {item.step}
              </span>
              <h3 className="rl-display" style={{ margin: "16px 0 0", fontSize: 18, fontWeight: 700 }}>
                {item.title}
              </h3>
              <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.55, color: "var(--rl-muted)", fontWeight: 500 }}>{item.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
