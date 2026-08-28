import React from "react";

const Footer = () => {
  return (
    <footer className="border-t-2 border-dashed border-paper-ink/25">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-6 py-8 text-paper-ink/50 sm:flex-row">
        <span className="font-hand text-lg">Li Soh</span>
        <p className="text-sm">Copyright © {new Date().getFullYear()} • All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
