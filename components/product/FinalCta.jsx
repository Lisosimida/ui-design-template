import React from "react";
import Link from "next/link";
import Reveal from "../shared/Reveal";

const FinalCta = ({ headline, subhead, cta }) => (
  <section className="py-20">
    <div className="mx-auto max-w-4xl px-6">
      <Reveal className="card flex flex-col items-center gap-6 bg-gradient-to-br from-accent/15 via-surface to-surface p-10 text-center sm:p-16">
        <h2 className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">{headline}</h2>
        {subhead && <p className="max-w-xl text-base text-muted sm:text-lg">{subhead}</p>}
        <Link href={cta.href} className="btn-primary">
          {cta.label}
        </Link>
      </Reveal>
    </div>
  </section>
);

export default FinalCta;
