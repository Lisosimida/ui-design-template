import React from "react";
import SectionHeading from "../shared/SectionHeading";
import Reveal from "../shared/Reveal";
import {
  CalendarDaysIcon,
  BellAlertIcon,
  ChatBubbleLeftRightIcon,
  RectangleGroupIcon,
  ChartBarIcon,
  DocumentTextIcon,
  SparklesIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

const ICONS = {
  CalendarDaysIcon,
  BellAlertIcon,
  ChatBubbleLeftRightIcon,
  RectangleGroupIcon,
  ChartBarIcon,
  DocumentTextIcon,
  SparklesIcon,
  LockClosedIcon,
};

const SPAN = {
  lg: "sm:col-span-2",
  sm: "sm:col-span-1",
};

const FeaturesBento = ({ id, eyebrow, heading, subhead, items = [] }) => (
  <section id={id} className="py-20">
    <div className="mx-auto max-w-6xl px-6">
      <SectionHeading eyebrow={eyebrow} heading={heading} subhead={subhead} />
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((feature, i) => {
          const Icon = ICONS[feature.icon] ?? RectangleGroupIcon;
          return (
            <Reveal key={feature.title} delay={i * 0.05} className={SPAN[feature.span] ?? SPAN.sm}>
              <div className="card h-full p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15">
                  <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-fg">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{feature.description}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

export default FeaturesBento;
