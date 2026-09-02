import React from "react";
import Link from "next/link";
import Reveal from "../shared/Reveal";
import { MapPinIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

const VenueMap = ({ id, eyebrow, heading, name, address, description, mapHref }) => (
  <section id={id} className="py-20">
    <div className="mx-auto max-w-6xl px-6">
      <div className="grid gap-8 overflow-hidden rounded-2xl border border-border/10 bg-surface lg:grid-cols-2">
        <Reveal className="flex flex-col justify-center p-8 sm:p-12">
          <span className="eyebrow w-fit">{eyebrow}</span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">{heading}</h2>
          <p className="mt-4 flex items-start gap-2 text-sm text-muted">
            <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            {address}
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted">{description}</p>
          <Link href={mapHref} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-6 w-fit">
            Get directions
            <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>
        <Reveal
          delay={0.1}
          className="flex min-h-[280px] items-center justify-center bg-[linear-gradient(135deg,_rgb(var(--accent)/0.25),_transparent_60%)] p-8"
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/15">
              <MapPinIcon className="h-8 w-8 text-accent" aria-hidden="true" />
            </div>
            <p className="font-display text-lg font-bold text-fg">{name}</p>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

export default VenueMap;
