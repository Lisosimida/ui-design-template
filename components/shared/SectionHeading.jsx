import React from "react";
import Reveal from "./Reveal";

const SectionHeading = ({ eyebrow, heading, subhead, align = "left" }) => (
  <Reveal className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
    {eyebrow && <span className="eyebrow">{eyebrow}</span>}
    <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">{heading}</h2>
    {subhead && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{subhead}</p>}
  </Reveal>
);

export default SectionHeading;
