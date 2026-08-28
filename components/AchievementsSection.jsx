import React from "react";

const achievementsList = [
  { metric: "Projects", value: "5+", color: "bg-accent-yellow" },
  { metric: "Certificates", value: "2+", color: "bg-accent-mint" },
  { metric: "Years", value: "2", color: "bg-accent-blue" },
];

const AchievementsSection = () => {
  return (
    <section className="py-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {achievementsList.map((achievement, index) => (
          <div
            key={index}
            className={`sticker sticker-press flex flex-col items-center justify-center gap-1 rounded-2xl px-6 py-8 text-center ${achievement.color}`}
          >
            <div className="font-heading text-4xl text-paper-ink">
              {achievement.value}
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-paper-ink/80">
              {achievement.metric}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AchievementsSection;
