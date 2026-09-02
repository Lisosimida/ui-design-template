"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "./shared/Logo";

const Navbar = ({ brand, homeHref = "/", items = [], cta, scrollSpy = false }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(scrollSpy ? items[0]?.href.replace("#", "") : "");

  const sectionIds = useMemo(
    () => (scrollSpy ? items.map((i) => i.href.replace("#", "")) : []),
    [items, scrollSpy]
  );

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);

      if (!scrollSpy || sectionIds.length === 0) return;

      const y = window.scrollY + 120;
      let current = sectionIds[0];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= y) current = id;
      }

      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sectionIds, scrollSpy]);

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

  const isActive = (href) => scrollSpy && href.replace("#", "") === active;

  return (
    <div className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <nav
        className={`mx-auto flex h-16 max-w-5xl items-center justify-between rounded-full border border-border/10 px-4 transition sm:px-6 ${
          scrolled ? "bg-surface/90 backdrop-blur" : "bg-surface/60 backdrop-blur"
        }`}
      >
        <Link href={homeHref} className="shrink-0">
          <Logo name={brand} />
        </Link>

        <div className="hidden items-center gap-1 text-sm md:flex">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`relative rounded-full px-4 py-2 font-semibold transition ${
                isActive(item.href) ? "text-fg" : "text-muted hover:text-fg"
              }`}
            >
              {isActive(item.href) && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="absolute inset-0 rounded-full bg-surface-2"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </Link>
          ))}
        </div>

        {cta && (
          <Link href={cta.href} className="btn-primary hidden !px-4 !py-2 text-xs md:inline-flex">
            {cta.label}
          </Link>
        )}

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-full border border-border/15 p-2 text-fg transition active:scale-95"
          >
            {open ? <XMarkIcon className="h-5 w-5" aria-hidden="true" /> : <Bars3Icon className="h-5 w-5" aria-hidden="true" />}
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
            className="card mx-auto mt-2 max-w-5xl p-3 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-bold transition active:scale-95 ${
                    isActive(item.href) ? "bg-surface-2 text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {cta && (
                <Link
                  href={cta.href}
                  onClick={() => setOpen(false)}
                  className="btn-primary mt-1"
                >
                  {cta.label}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
