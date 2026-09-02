import React from "react";
import SectionHeading from "../shared/SectionHeading";
import Reveal from "../shared/Reveal";
import Avatar from "../shared/Avatar";

const SpeakersGrid = ({ id, eyebrow, heading, subhead, items = [] }) => (
  <section id={id} className="py-20">
    <div className="mx-auto max-w-6xl px-6">
      <SectionHeading eyebrow={eyebrow} heading={heading} subhead={subhead} />
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((speaker, i) => (
          <Reveal key={speaker.name} delay={i * 0.05}>
            <div className="card flex flex-col items-center gap-3 p-5 text-center">
              <Avatar initials={speaker.initials} size={56} />
              <div>
                <p className="text-sm font-bold text-fg">{speaker.name}</p>
                <p className="mt-0.5 text-xs text-muted">{speaker.role}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default SpeakersGrid;
