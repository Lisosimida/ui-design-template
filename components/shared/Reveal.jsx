"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

// Expo-out (matches --rl-ease-out in resume-lab.css): fast start, gentle
// settle — reads as "arriving" rather than a linear slide.
const EASE_OUT = [0.16, 1, 0.3, 1];

const Reveal = ({ children, delay = 0, className = "" }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: shouldReduceMotion ? 0.01 : 0.5, ease: EASE_OUT, delay: shouldReduceMotion ? 0 : delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
