import React from "react";
import Link from "next/link";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { CheckIcon } from "@heroicons/react/24/outline";

const TierGrid = ({ id, eyebrow, heading, subhead, tiers = [] }) => (
  <section id={id} className="py-20">
    <div className="mx-auto max-w-6xl px-6">
      <SectionHeading eyebrow={eyebrow} heading={heading} subhead={subhead} align="center" />
      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {tiers.map((tier, i) => (
          <Reveal key={tier.name} delay={i * 0.08}>
            <div
              className={`flex h-full flex-col rounded-2xl border p-8 ${
                tier.highlighted ? "border-accent bg-surface-2" : "border-border/10 bg-surface"
              }`}
            >
              {tier.highlighted && <span className="eyebrow mb-4 w-fit">Most popular</span>}
              <h3 className="font-display text-xl font-bold text-fg">{tier.name}</h3>
              <p className="mt-2 text-sm text-muted">{tier.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold text-fg">{tier.price}</span>
                {tier.period && <span className="text-sm text-muted">{tier.period}</span>}
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="#contact"
                className={`mt-8 text-center ${tier.highlighted ? "btn-primary" : "btn-secondary"}`}
              >
                {tier.cta}
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default TierGrid;
