"use client";

import React from "react";
import { motion } from "framer-motion";

const Reveal = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.55, ease: "easeOut", delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export default Reveal;
