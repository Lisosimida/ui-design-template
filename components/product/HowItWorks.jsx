import React from "react";
import SectionHeading from "../shared/SectionHeading";
import Reveal from "../shared/Reveal";

const HowItWorks = ({ id, eyebrow, heading, subhead, items = [] }) => (
  <section id={id} className="py-20">
    <div className="mx-auto max-w-6xl px-6">
      <SectionHeading eyebrow={eyebrow} heading={heading} subhead={subhead} align="center" />
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.step} delay={i * 0.08}>
            <div className="card h-full p-6">
              <span className="font-display text-3xl font-bold text-accent">{item.step}</span>
              <h3 className="mt-4 font-display text-lg font-bold text-fg">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
