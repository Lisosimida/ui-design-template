import React from "react";
import Reveal from "../shared/Reveal";
import { DocumentTextIcon, SparklesIcon, LockClosedIcon, RectangleGroupIcon } from "@heroicons/react/24/outline";

const ICONS = { DocumentTextIcon, SparklesIcon, LockClosedIcon };

const CARD_STYLE = [
  { bg: "var(--rl-orange)", fg: "var(--rl-orange-ink)", rotate: -0.6 },
  { bg: "var(--rl-blue)", fg: "var(--rl-blue-fg)", rotate: 0.6 },
  { bg: "var(--rl-lime)", fg: "var(--rl-lime-ink)", rotate: -0.4 },
];

const Features = ({ id, eyebrow, heading, subhead, items = [] }) => (
  <section id={id} style={{ padding: "40px 24px" }}>
    <div style={{ maxWidth: 1040, margin: "0 auto" }}>
      <Reveal>
        <div className="rl-eyebrow">{eyebrow}</div>
        <h2 className="rl-display" style={{ margin: "20px 0 0", fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 700, letterSpacing: "-0.01em" }}>
          {heading}
        </h2>
        {subhead && <p style={{ margin: "14px 0 0", fontSize: 16, color: "var(--rl-muted)", maxWidth: "60ch", fontWeight: 500 }}>{subhead}</p>}
      </Reveal>

      <div style={{ marginTop: 36, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
        {items.map((feature, i) => {
          const Icon = ICONS[feature.icon] ?? RectangleGroupIcon;
          const style = CARD_STYLE[i % CARD_STYLE.length];
          return (
            <Reveal key={feature.title} delay={i * 0.05}>
              <div className="rl-card rl-card-hover" style={{ height: "100%", padding: 24, "--rl-rotate": `${style.rotate}deg` }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: style.bg,
                    color: style.fg,
                    border: "2.5px solid var(--rl-ink)",
                  }}
                >
                  <Icon style={{ width: 22, height: 22 }} aria-hidden="true" />
                </div>
                <h3 className="rl-display" style={{ margin: "16px 0 0", fontSize: 18, fontWeight: 700 }}>
                  {feature.title}
                </h3>
                <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.55, color: "var(--rl-muted)", fontWeight: 500 }}>{feature.description}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

export default Features;
