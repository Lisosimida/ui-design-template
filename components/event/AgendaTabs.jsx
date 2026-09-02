"use client";

import React, { useState } from "react";
import SectionHeading from "../shared/SectionHeading";
import Reveal from "../shared/Reveal";

const AgendaTabs = ({ id, eyebrow, heading, subhead, days = [] }) => {
  const [activeDay, setActiveDay] = useState(days[0]?.id);
  const current = days.find((d) => d.id === activeDay) ?? days[0];

  return (
    <section id={id} className="py-20">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeading eyebrow={eyebrow} heading={heading} subhead={subhead} align="center" />

        <div className="mt-8 flex justify-center gap-2">
          {days.map((day) => (
            <button
              key={day.id}
              type="button"
              onClick={() => setActiveDay(day.id)}
              className={`rounded-full px-5 py-2 text-sm font-bold transition active:scale-95 ${
                activeDay === day.id ? "bg-accent text-accent-fg" : "border border-border/15 text-muted hover:text-fg"
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>

        <Reveal className="mt-10 space-y-3" key={current?.id}>
          {current?.sessions.map((session) => (
            <div key={session.time + session.title} className="card flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:gap-6">
              <span className="w-16 shrink-0 font-display text-sm font-bold text-accent">{session.time}</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-fg sm:text-base">{session.title}</p>
                <p className="mt-0.5 text-xs text-muted">{session.speaker}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
};

export default AgendaTabs;
