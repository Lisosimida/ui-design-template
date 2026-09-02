import React from "react";
import SectionHeading from "../shared/SectionHeading";
import Reveal from "../shared/Reveal";
import Avatar from "../shared/Avatar";

const initialsOf = (name) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const Testimonials = ({ id, eyebrow, heading, subhead, items = [] }) => (
  <section id={id} className="py-20">
    <div className="mx-auto max-w-6xl px-6">
      <SectionHeading eyebrow={eyebrow} heading={heading} subhead={subhead} align="center" />
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {items.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08}>
            <div className="card flex h-full flex-col p-6">
              <p className="flex-1 text-sm leading-relaxed text-fg">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <Avatar initials={initialsOf(t.name)} size={40} />
                <div>
                  <p className="text-sm font-bold text-fg">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
