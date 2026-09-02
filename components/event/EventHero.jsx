"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "../shared/Reveal";
import { MapPinIcon } from "@heroicons/react/24/outline";

const getTimeLeft = (target) => {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const Countdown = ({ date }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft(date));
    const id = setInterval(() => setTimeLeft(getTimeLeft(date)), 1000);
    return () => clearInterval(id);
  }, [date]);

  const units = [
    { label: "Days", value: timeLeft?.days },
    { label: "Hours", value: timeLeft?.hours },
    { label: "Minutes", value: timeLeft?.minutes },
    { label: "Seconds", value: timeLeft?.seconds },
  ];

  return (
    <div className="mx-auto mt-10 grid max-w-md grid-cols-4 gap-3">
      {units.map((u) => (
        <div key={u.label} className="card p-4 text-center">
          <div className="font-display text-2xl font-bold tabular-nums text-fg sm:text-3xl">
            {u.value === undefined ? "--" : String(u.value).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[11px] uppercase tracking-wider text-muted">{u.label}</div>
        </div>
      ))}
    </div>
  );
};

const EventHero = ({ eyebrow, headline, subhead, date, location, primaryCta, secondaryCta }) => (
  <section className="relative overflow-hidden pb-20 pt-28 sm:pt-36">
    <div
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(ellipse_at_top,_rgb(var(--accent)/0.22),_transparent_65%)]"
      aria-hidden="true"
    />
    <div className="mx-auto max-w-4xl px-6 text-center">
      <Reveal>
        <span className="eyebrow inline-flex items-center gap-1.5">
          <MapPinIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {eyebrow}
        </span>
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

      <Reveal delay={0.2}>
        <Countdown date={date} />
        <p className="mt-3 text-xs text-muted">{location}</p>
      </Reveal>
    </div>
  </section>
);

export default EventHero;
