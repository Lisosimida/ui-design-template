import React from "react";
import Navbar from "./Navbar";
import { motion } from "framer-motion";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen sm:px-6 sm:py-8">
      <div className="paper-grid relative mx-auto w-full max-w-6xl sm:rounded-3xl">
        <Navbar />

        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mx-auto w-full max-w-5xl px-6 pb-16"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;
