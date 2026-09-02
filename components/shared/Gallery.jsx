import React from "react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const Gallery = ({ id, eyebrow, heading, subhead, items = [] }) => (
  <section id={id} className="py-20">
    <div className="mx-auto max-w-6xl px-6">
      <SectionHeading eyebrow={eyebrow} heading={heading} subhead={subhead} />
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.05}>
            <div className="card aspect-[4/3] overflow-hidden p-0">
              <div className="flex h-full w-full items-end bg-gradient-to-br from-accent/25 via-surface to-surface-2 p-5">
                <div>
                  <p className="font-display text-lg font-bold text-fg">{item.title}</p>
                  <p className="mt-1 text-sm text-muted">{item.caption}</p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Gallery;
