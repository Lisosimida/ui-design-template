import React from "react";

const Avatar = ({ initials, size = 48 }) => (
  <div
    className="flex shrink-0 items-center justify-center rounded-full bg-accent/15 font-display font-bold text-accent"
    style={{ width: size, height: size, fontSize: size * 0.36 }}
  >
    {initials}
  </div>
);

export default Avatar;
