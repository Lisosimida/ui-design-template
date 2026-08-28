import React from "react";
import TypeWritter from "typewriter-effect";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const HeroSection = () => {
  return (
    <main id="top" className="pt-10 sm:pt-16">
      <section className="py-10 text-center sm:py-16">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="squiggle-underline font-hand text-xl text-paper-ink/70 sm:text-2xl"
        >
          my name is
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative mx-auto mt-8 flex max-w-2xl items-center justify-center"
        >
          <div className="absolute left-0 hidden -rotate-6 sm:block">
            <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-dashed border-accent-orange bg-paper-cream">
              <Image
                src="/Hero-Section.png"
                alt="Li Soh"
                width={80}
                height={80}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>

          <div className="relative px-8 py-6 sm:px-12 sm:py-8">
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 300 130"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M22,66 C18,24 62,6 152,7 C238,8 282,26 280,65 C278,104 236,122 148,121 C60,120 26,106 22,66 Z"
                fill="none"
                stroke="#FB7A3C"
                strokeWidth="3"
              />
            </svg>
            <h1 className="relative font-display text-4xl leading-none text-paper-ink sm:text-6xl">
              LI SOH
            </h1>
          </div>

          <div className="absolute right-0 hidden rotate-6 sm:block">
            <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-dashed border-accent-blue bg-paper-cream">
              <Image
                src="/Hero-Section.png"
                alt="Li Soh"
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3"
        >
          <span className="sticker-sm rounded-full bg-accent-yellow px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-paper-ink">
            AI Engineer
          </span>
          <span className="sticker-sm inline-flex items-center gap-2 rounded-full bg-paper-cream px-4 py-1.5 text-xs font-bold text-paper-ink">
            <span className="h-2 w-2 rounded-full bg-accent-mint" />
            Open to AI Engineer roles
          </span>
          <span className="sticker-sm rounded-full bg-accent-mint px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-paper-ink">
            Ships Fast
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 text-2xl font-extrabold text-paper-ink sm:text-3xl"
        >
          <TypeWritter
            options={{ autoStart: true, loop: true }}
            onInit={(typewriter) => {
              typewriter
                .typeString('<span style="color:#5B8DEF">AI Engineer</span>')
                .pauseFor(1400)
                .deleteAll()
                .typeString('<span style="color:#E8558B">LLM / RAG Builder</span>')
                .pauseFor(1400)
                .deleteAll()
                .typeString('<span style="color:#FB7A3C">NLP Engineer</span>')
                .pauseFor(1400)
                .deleteAll()
                .start();
            }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-paper-ink/70 sm:text-lg"
        >
          I build AI features that ship: data pipelines, NLP/LLM applications, evaluation, and clean UI. 🤖
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link href="#resume" className="btn-contrast">
            Resume Snapshot
          </Link>
          <Link href="#projects" className="btn-ghost">
            View Projects
          </Link>
        </motion.div>
      </section>
    </main>
  );
};

export default HeroSection;
