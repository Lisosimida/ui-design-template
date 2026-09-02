"use client";

import React, { useState } from "react";
import Reveal from "./Reveal";

const ContactForm = ({ id = "contact", heading = "Get in touch", subhead }) => {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (data.get("company")) return;

    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <section id={id} className="py-20">
      <div className="mx-auto max-w-2xl px-6">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">{heading}</h2>
          {subhead && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{subhead}</p>}
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={handleSubmit} className="card mt-10 space-y-5 p-6 sm:p-8">
            <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-fg">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-2 w-full rounded-xl border border-border/15 bg-bg px-4 py-3 text-fg placeholder:text-muted focus:border-accent"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-fg">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-xl border border-border/15 bg-bg px-4 py-3 text-fg placeholder:text-muted focus:border-accent"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-fg">Message</label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                className="mt-2 w-full rounded-xl border border-border/15 bg-bg px-4 py-3 text-fg placeholder:text-muted focus:border-accent"
                placeholder="Tell us about your launch or event..."
              />
            </div>

            <button type="submit" disabled={status === "loading"} className="btn-primary w-full disabled:opacity-60">
              {status === "loading" ? "Sending..." : "Send message"}
            </button>

            {status === "success" && (
              <p className="text-center text-sm font-semibold text-accent">Thanks — we&apos;ll get back to you shortly.</p>
            )}
            {status === "error" && <p className="text-center text-sm font-semibold text-red-400">{error}</p>}
          </form>
        </Reveal>
      </div>
    </section>
  );
};

export default ContactForm;
