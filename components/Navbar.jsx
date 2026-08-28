import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserIcon, DocumentTextIcon, FolderIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import Logo from "./Logo";

const NAV_ITEMS = [
  { id: "aboutMe", label: "About", icon: UserIcon },
  { id: "resume", label: "Resume", icon: DocumentTextIcon },
  { id: "projects", label: "Projects", icon: FolderIcon },
];

const CONTACT_ITEM = { id: "contact", label: "Contact", icon: EnvelopeIcon };

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("aboutMe");

  const sectionIds = useMemo(() => [...NAV_ITEMS.map((x) => x.id), CONTACT_ITEM.id], []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);

      const y = window.scrollY + 120;
      let current = sectionIds[0];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        // getBoundingClientRect is document-relative regardless of any ancestor
        // that becomes positioned (e.g. the Framer Motion SectionReveal wrapper
        // in pages/index.js before its whileInView reveal fires).
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= y) current = id;
      }

      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sectionIds]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const mobileLinkClass = (id) =>
    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition active:scale-95 ${
      active === id ? "bg-accent-yellow text-paper-ink" : "text-paper-ink hover:bg-paper-desk"
    }`;

  return (
    <div className="sticky top-3 z-50 px-3 sm:top-4 sm:px-6">
      <nav
        className={`mx-auto flex h-16 max-w-4xl items-center justify-between rounded-full bg-paper-cream px-3 transition sm:px-4 ${
          scrolled ? "sticker" : "border-2 border-paper-ink/70"
        }`}
      >
        <a href="#top" className="shrink-0">
          <Logo size={28} />
        </a>

        <div className="hidden items-center gap-1 text-sm md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 font-bold transition active:scale-95 ${
                active === item.id ? "text-paper-ink" : "text-paper-ink/60 hover:text-paper-ink"
              }`}
            >
              {active === item.id && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="absolute inset-0 rounded-full bg-accent-yellow"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                />
              )}
              <item.icon className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{item.label}</span>
            </a>
          ))}
        </div>

        <a
          href={`#${CONTACT_ITEM.id}`}
          className="btn-contrast hidden !rounded-full !px-4 !py-2 text-xs md:inline-flex"
        >
          <EnvelopeIcon className="h-4 w-4" />
          Contact
        </a>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-full border-2 border-paper-ink p-2 text-paper-ink transition active:scale-95"
          >
            <span className="sr-only">Menu</span>
            <div className="flex flex-col gap-1">
              <span className={`h-0.5 w-5 bg-paper-ink transition ${open ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`h-0.5 w-5 bg-paper-ink transition ${open ? "opacity-0" : ""}`} />
              <span className={`h-0.5 w-5 bg-paper-ink transition ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="sticker mx-auto mt-2 max-w-4xl rounded-3xl bg-paper-cream p-3 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {[...NAV_ITEMS, CONTACT_ITEM].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className={mobileLinkClass(item.id)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
