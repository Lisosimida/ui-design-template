import React from 'react';

const Logo = ({ className = "", size = 28 }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span
        className="rounded-full bg-accent-pink"
        style={{ width: size * 0.4, height: size * 0.4 }}
      />
      <span className="text-lg font-extrabold tracking-tight text-paper-ink">
        Li Soh
      </span>
    </div>
  );
};

export default Logo;
