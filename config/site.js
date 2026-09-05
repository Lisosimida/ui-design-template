// Shared content for the marketing homepage (app/page.js).
const siteConfig = {
  productName: "ResumeReview",
  tagline: "AI-powered resume review",
  headline: "Find out what your resume isn't saying.",
  subhead:
    "Upload a PDF or Word resume and get instant, structured feedback on clarity, impact, and gaps — plus a clean breakdown of your skills, experience, and education.",
  nav: [
    { label: "How it works", href: "#how-it-works" },
    { label: "Sign in", href: "/sign-in" },
  ],
  primaryCta: { label: "Get your free review", href: "/sign-up" },
  secondaryCta: { label: "Sign in", href: "/sign-in" },
  features: [
    {
      icon: "DocumentTextIcon",
      title: "Structured breakdown",
      description: "Skills, experience, and education extracted automatically — no manual re-typing.",
    },
    {
      icon: "SparklesIcon",
      title: "Feedback that's actually specific",
      description: "Notes on clarity, impact, and the gaps a recruiter would flag — not generic tips.",
    },
    {
      icon: "LockClosedIcon",
      title: "Private by default",
      description: "Your resume is scoped to your account with row-level security — nobody else can see it.",
    },
  ],
  howItWorks: [
    { step: "1", title: "Sign up", description: "Create a free account — takes about 10 seconds." },
    { step: "2", title: "Upload your resume", description: "Drop in a PDF or DOCX file from your dashboard." },
    { step: "3", title: "Get your results", description: "See your structured data and written feedback in under a minute." },
  ],
  finalCta: {
    headline: "Ready to see your resume differently?",
    subhead: "Free to try. No credit card required.",
    cta: { label: "Create your account", href: "/sign-up" },
  },
  contactEmail: "lisoh03@gmail.com",
  footer: {
    note: "ResumeReview — AI-powered resume feedback.",
  },
};

module.exports = siteConfig;
