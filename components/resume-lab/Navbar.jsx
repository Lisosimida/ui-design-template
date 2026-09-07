"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3z" />
    </svg>
  );
}

function MenuIcon({ open }) {
  return open ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

const Navbar = ({ brand, homeHref = "/", items = [], cta }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50, padding: "16px 16px 0" }}>
      <nav
        className="rl-card"
        style={{
          maxWidth: 1040,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          borderRadius: 999,
          padding: "10px 10px 10px 22px",
        }}
      >
        <Link href={homeHref} style={{ display: "inline-flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 26,
              height: 26,
              borderRadius: 999,
              background: "var(--rl-orange)",
              color: "var(--rl-orange-ink)",
              border: "2px solid var(--rl-ink)",
              flexShrink: 0,
            }}
          >
            <SparkleIcon />
          </span>
          <span className="rl-display" style={{ fontSize: 17, fontWeight: 700, color: "var(--rl-ink)" }}>
            {brand}
          </span>
        </Link>

        <div className="hidden items-center gap-1 text-sm md:flex">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rl-nav-link"
              style={{
                padding: "8px 16px",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 14,
                color: "var(--rl-muted)",
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {cta && (
          <div className="hidden md:block">
            <Link href={cta.href} className="rl-btn rl-btn-primary" style={{ padding: "10px 22px", fontSize: 13 }}>
              {cta.label}
            </Link>
          </div>
        )}

        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center md:hidden"
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            border: "2.5px solid var(--rl-ink)",
            color: "var(--rl-ink)",
            background: "var(--rl-surface)",
            flexShrink: 0,
          }}
        >
          <MenuIcon open={open} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.16, ease: [0.7, 0, 0.84, 0] } }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
            className="rl-card md:hidden"
            style={{ maxWidth: 1040, margin: "10px auto 0", padding: 12, borderRadius: 20 }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  style={{ padding: "12px 16px", borderRadius: 14, fontWeight: 700, fontSize: 14, color: "var(--rl-ink)" }}
                >
                  {item.label}
                </Link>
              ))}
              {cta && (
                <Link
                  href={cta.href}
                  onClick={() => setOpen(false)}
                  className="rl-btn rl-btn-primary"
                  style={{ marginTop: 6, padding: "12px 20px", fontSize: 14, justifyContent: "center" }}
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
