import React from "react";
import Reveal from "./Reveal";

const AboutSection = ({ id, eyebrow, heading, body, stats = [] }) => (
  <section id={id} className="py-20">
    <div className="mx-auto max-w-6xl px-6">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">{heading}</h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{body}</p>
        </Reveal>
        <Reveal delay={0.1} className="grid grid-cols-2 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="card p-6">
              <div className="font-display text-3xl font-bold text-accent">{s.value}</div>
              <div className="mt-1 text-sm text-muted">{s.label}</div>
            </div>
          ))}
        </Reveal>
      </div>
    </div>
  </section>
);

export default AboutSection;
