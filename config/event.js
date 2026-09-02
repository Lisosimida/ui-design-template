// Fictional conference used to populate the /demo/event page.
// All names, people, and companies below are invented for demo purposes.
const eventConfig = {
  brand: "Converge Summit",
  accent: "coral",
  nav: [
    { id: "speakers", label: "Speakers" },
    { id: "agenda", label: "Agenda" },
    { id: "venue", label: "Venue" },
    { id: "tickets", label: "Tickets" },
  ],
  hero: {
    eyebrow: "March 12–13, 2027 · Lisbon, Portugal",
    headline: "Two days on where product, design, and AI actually meet.",
    subhead:
      "Converge Summit brings 60+ practitioners together for hands-on workshops, honest talks, and the hallway conversations that outlast the conference.",
    date: "2027-03-12T09:00:00",
    location: "Lisbon, Portugal",
    primaryCta: { label: "Get your ticket", href: "#tickets" },
    secondaryCta: { label: "View agenda", href: "#agenda" },
  },
  about: {
    eyebrow: "Why Converge",
    heading: "Built for the conversation after the talk, not just the talk.",
    body: "No breakout tracks to choose between, no vendor-only keynotes. Converge Summit runs a single shared track so the whole room can go deeper together, with long breaks built in on purpose.",
    stats: [
      { value: "60+", label: "speakers and facilitators" },
      { value: "400", label: "practitioners in the room" },
    ],
  },
  speakers: {
    eyebrow: "Speakers",
    heading: "Practitioners, not just headliners",
    subhead: "Every speaker is shipping the thing they're talking about.",
    items: [
      { name: "Elena Marsh", role: "VP Design, Northfold", initials: "EM" },
      { name: "Tomas Reyes", role: "Founder, Driftwork", initials: "TR" },
      { name: "Aiko Tanaka", role: "Head of AI, Loomstack", initials: "AT" },
      { name: "Karim Belhaj", role: "Staff Engineer, Vantable", initials: "KB" },
      { name: "Nadia Petrova", role: "Product Lead, Solstice", initials: "NP" },
      { name: "Owen Clarke", role: "CTO, Portside", initials: "OC" },
    ],
  },
  agenda: {
    eyebrow: "Agenda",
    heading: "Two days, one shared track",
    subhead: "",
    days: [
      {
        id: "day1",
        label: "Day 1 · Mar 12",
        sessions: [
          { time: "09:00", title: "Opening keynote: The next decade of product work", speaker: "Elena Marsh" },
          { time: "10:15", title: "Building AI features users actually trust", speaker: "Aiko Tanaka" },
          { time: "13:00", title: "Workshop: Rapid prototyping under real constraints", speaker: "Tomas Reyes" },
          { time: "15:30", title: "Panel: Engineering and design, finally in sync", speaker: "Karim Belhaj & Nadia Petrova" },
        ],
      },
      {
        id: "day2",
        label: "Day 2 · Mar 13",
        sessions: [
          { time: "09:00", title: "Scaling a product org without losing the plot", speaker: "Owen Clarke" },
          { time: "11:00", title: "Case study: a launch that actually shipped on time", speaker: "Nadia Petrova" },
          { time: "14:00", title: "Workshop: Writing specs people actually read", speaker: "Karim Belhaj" },
          { time: "16:00", title: "Closing conversation & what's next", speaker: "Elena Marsh & Tomas Reyes" },
        ],
      },
    ],
  },
  gallery: {
    eyebrow: "Last year",
    heading: "What the room actually felt like",
    subhead: "",
    items: [
      { title: "2026 opening night", caption: "400 attendees, one shared room." },
      { title: "Workshop floor", caption: "Hands-on sessions, not just slides." },
      { title: "Closing night", caption: "Where the real conversations happen." },
    ],
  },
  venue: {
    eyebrow: "Venue",
    heading: "Cordoaria Nacional",
    name: "Cordoaria Nacional",
    address: "Av. da Índia 88, 1300-299 Lisboa, Portugal",
    description:
      "A converted 18th-century rope factory on the Lisbon waterfront — full-day natural light, five minutes from the tram line.",
    mapHref: "https://www.google.com/maps/search/?api=1&query=Cordoaria+Nacional+Lisbon",
  },
  tickets: {
    eyebrow: "Tickets",
    heading: "Save your seat",
    subhead: "",
    items: [
      { name: "Early Bird", price: "€349", description: "Full two-day access. Limited quantity.", features: ["All talks & workshops", "Lunch both days", "Closing night reception"], cta: "Get ticket", highlighted: false },
      { name: "Standard", price: "€449", description: "Full two-day access.", features: ["All talks & workshops", "Lunch both days", "Closing night reception"], cta: "Get ticket", highlighted: true },
      { name: "Team (4-pack)", price: "€1,499", description: "Bring your team, save per seat.", features: ["4 standard passes", "Reserved team seating", "Priority workshop signup"], cta: "Get team ticket", highlighted: false },
    ],
  },
  sponsors: {
    label: "Backed by",
    logos: ["Northfold", "Driftwork", "Loomstack", "Vantable", "Solstice", "Portside"],
  },
};

module.exports = eventConfig;
