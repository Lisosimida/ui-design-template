import React from "react";
import Logo from "./shared/Logo";

const Footer = ({ brand, note, links = [] }) => (
  <footer className="border-t border-border/10">
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
      <Logo name={brand} />
      {note && <p className="text-sm text-muted">{note}</p>}
      <div className="flex items-center gap-4">
        {links.map((l) => (
          <a key={l.label} href={l.href} className="text-sm text-muted transition hover:text-fg">
            {l.label}
          </a>
        ))}
        <span className="text-xs text-muted">© {new Date().getFullYear()} {brand}</span>
      </div>
    </div>
  </footer>
);

export default Footer;
