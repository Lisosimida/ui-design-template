import React from "react";

const Logo = ({ name, className = "" }) => (
  <span className={`inline-flex items-center gap-2 font-display text-lg font-bold tracking-tight text-fg ${className}`}>
    <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
    {name}
  </span>
);

export default Logo;
