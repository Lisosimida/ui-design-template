import React from "react";
import Reveal from "./Reveal";

const LogoStrip = ({ label, logos = [] }) => (
  <section className="py-14">
    <Reveal className="mx-auto max-w-5xl px-6">
      {label && <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {logos.map((name) => (
          <span key={name} className="font-display text-lg font-bold tracking-tight text-muted/70">
            {name}
          </span>
        ))}
      </div>
    </Reveal>
  </section>
);

export default LogoStrip;
