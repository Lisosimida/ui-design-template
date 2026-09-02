// Shared content for the template's own showcase/landing page (app/page.js).
// This is the template's own identity — not either demo's fictional brand.
const siteConfig = {
  templateName: "Launchbase",
  tagline: "One template, two ways to launch.",
  headline: "A design system for product launches and events — not two separate templates.",
  subhead:
    "Launchbase ships as one shared component system with swappable sections. See it fully populated for a SaaS product launch and a two-day conference, then get the same template for your own.",
  nav: [
    { label: "Product demo", href: "/demo/product" },
    { label: "Event demo", href: "/demo/event" },
  ],
  demos: [
    {
      label: "Product launch",
      href: "/demo/product",
      accent: "indigo",
      description: "Hero, social proof, bento features, pricing, testimonials, single-action CTA.",
    },
    {
      label: "Event / conference",
      href: "/demo/event",
      accent: "coral",
      description: "Countdown hero, speaker grid, tabbed agenda, venue map, tiered tickets.",
    },
  ],
  contactEmail: "lisoh03@gmail.com",
  footer: {
    note: "Launchbase is a config-driven Next.js template. Swap the config, not the code.",
  },
};

module.exports = siteConfig;
