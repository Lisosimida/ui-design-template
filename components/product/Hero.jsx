import React from "react";
import Link from "next/link";
import Reveal from "../shared/Reveal";

const Hero = ({ eyebrow, headline, subhead, primaryCta, secondaryCta, stats = [] }) => (
  <section className="relative overflow-hidden pb-20 pt-28 sm:pt-36">
    <div
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(ellipse_at_top,_rgb(var(--accent)/0.22),_transparent_65%)]"
      aria-hidden="true"
    />
    <div className="mx-auto max-w-4xl px-6 text-center">
      <Reveal>
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight text-fg sm:text-6xl">
          {headline}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{subhead}</p>
      </Reveal>

      <Reveal delay={0.1} className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href={primaryCta.href} className="btn-primary w-full sm:w-auto">
          {primaryCta.label}
        </Link>
        <Link href={secondaryCta.href} className="btn-secondary w-full sm:w-auto">
          {secondaryCta.label}
        </Link>
      </Reveal>

      {stats.length > 0 && (
        <Reveal delay={0.2} className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-4 border-t border-border/10 pt-8">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-display text-2xl font-bold text-fg sm:text-3xl">{s.value}</div>
              <div className="mt-1 text-xs text-muted sm:text-sm">{s.label}</div>
            </div>
          ))}
        </Reveal>
      )}
    </div>
  </section>
);

export default Hero;
