// Fictional SaaS product used to populate the /demo/product page.
// All names, people, and companies below are invented for demo purposes.
const productConfig = {
  brand: "Nimbus",
  accent: "indigo",
  nav: [
    { id: "features", label: "Features" },
    { id: "how-it-works", label: "How it works" },
    { id: "pricing", label: "Pricing" },
    { id: "testimonials", label: "Reviews" },
  ],
  hero: {
    eyebrow: "Now in public beta",
    headline: "Ship product launches your whole team can see coming.",
    subhead:
      "Nimbus turns scattered launch checklists into one shared timeline, so marketing, engineering, and support stop finding out about a slipped date in a hallway conversation.",
    primaryCta: { label: "Start free trial", href: "#pricing" },
    secondaryCta: { label: "See how it works", href: "#how-it-works" },
    stats: [
      { value: "2,400+", label: "teams onboarded" },
      { value: "98%", label: "launches on time" },
      { value: "4.9/5", label: "average rating" },
    ],
  },
  socialProof: {
    label: "Trusted by product teams at",
    logos: ["Orbitwave", "Fernway", "Haloform", "Quicksand", "Brightloop", "Ridgeline"],
  },
  about: {
    eyebrow: "Why Nimbus",
    heading: "Launches fail from silence, not from bad plans.",
    body: "Most launch checklists live in a spreadsheet only one person opens. Nimbus makes the timeline, owners, and blockers visible to everyone who needs them, so the plan survives contact with reality.",
    stats: [
      { value: "6 hrs", label: "saved per launch on status updates" },
      { value: "3x", label: "fewer last-minute surprises" },
    ],
  },
  features: {
    eyebrow: "Features",
    heading: "Everything your launch already needs",
    subhead: "No new process to learn — Nimbus wraps around how your team already ships.",
    items: [
      { title: "Shared launch timeline", description: "Every team sees the same countdown, the same owners, the same blockers.", icon: "CalendarDaysIcon", span: "lg" },
      { title: "Automatic status rollups", description: "Nimbus pings owners before a task goes red, not after.", icon: "BellAlertIcon", span: "sm" },
      { title: "Slack + email digests", description: "A 60-second daily summary lands wherever your team already looks.", icon: "ChatBubbleLeftRightIcon", span: "sm" },
      { title: "Launch templates", description: "Start from a proven checklist for GA releases, betas, or campaigns.", icon: "RectangleGroupIcon", span: "sm" },
      { title: "Retro-ready reporting", description: "Every launch closes with a timeline you can actually learn from.", icon: "ChartBarIcon", span: "lg" },
    ],
  },
  howItWorks: {
    eyebrow: "How it works",
    heading: "Three steps to your first tracked launch",
    subhead: "",
    items: [
      { step: "01", title: "Import your checklist", description: "Bring in tasks from a spreadsheet, or start from a Nimbus template." },
      { step: "02", title: "Assign and schedule", description: "Owners and dates sync automatically to one shared timeline." },
      { step: "03", title: "Launch with confidence", description: "Live status and blockers, visible to everyone who needs them." },
    ],
  },
  gallery: {
    eyebrow: "Inside Nimbus",
    heading: "A timeline everyone actually looks at",
    subhead: "",
    items: [
      { title: "Timeline view", caption: "Every workstream, one countdown." },
      { title: "Owner rollups", caption: "Know exactly who owns what, always." },
      { title: "Retro reports", caption: "Turn every launch into a lesson." },
    ],
  },
  pricing: {
    eyebrow: "Pricing",
    heading: "Plans that scale with your launch calendar",
    subhead: "",
    items: [
      {
        name: "Starter",
        price: "$0",
        period: "/mo",
        description: "For small teams shipping their first tracked launch.",
        features: ["Up to 3 active launches", "Shared timeline", "Email digests"],
        cta: "Start free",
        highlighted: false,
      },
      {
        name: "Growth",
        price: "$39",
        period: "/mo per seat",
        description: "For teams running launches every month.",
        features: ["Unlimited launches", "Slack + email digests", "Launch templates", "Retro reporting"],
        cta: "Start free trial",
        highlighted: true,
      },
      {
        name: "Scale",
        price: "Custom",
        period: "",
        description: "For orgs coordinating launches across many teams.",
        features: ["Everything in Growth", "SSO & audit log", "Dedicated success manager", "Custom integrations"],
        cta: "Talk to sales",
        highlighted: false,
      },
    ],
  },
  testimonials: {
    eyebrow: "Reviews",
    heading: "Teams that stopped finding out the hard way",
    subhead: "",
    items: [
      { quote: "We used to find out about a slipped launch date in a hallway conversation. Now it's just visible.", name: "Priya Nandan", role: "Head of Product, Fernway" },
      { quote: "The daily digest alone paid for itself. No more status-update meetings.", name: "Marcus Idun", role: "VP Engineering, Haloform" },
      { quote: "Retro reports turned our launch process from tribal knowledge into something we can actually improve.", name: "Sana Okafor", role: "Ops Lead, Brightloop" },
    ],
  },
  finalCta: {
    headline: "Run your next launch without the surprises.",
    subhead: "Free to start. No credit card required.",
    cta: { label: "Start free trial", href: "#pricing" },
  },
};

module.exports = productConfig;
