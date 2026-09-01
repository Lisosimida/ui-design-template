import React from "react";

const TabButton = ({ active, selectTab, children, color = "bg-accent-yellow" }) => {
  return (
    <button
      onClick={selectTab}
      className={`sticker-sm sticker-press rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition active:scale-95 ${
        active ? `${color} text-paper-ink` : "bg-paper-cream text-paper-ink/50"
      }`}
    >
      {children}
    </button>
  );
};
export default TabButton;
