import React from "react";
import Link from "next/link";

const ProjectCard = ({ imgUrl, title, description, gitUrl, bgPosition, bgSize, number = 1, style }) => {
  const { bg, text, sub } = style;

  return (
    <div className={`sticker relative flex flex-col overflow-hidden rounded-2xl ${bg} p-5`}>
      <span className={`font-hand text-sm font-bold uppercase tracking-wide ${sub}`}>
        Project 0{number}
      </span>

      <div className="sticker-sm relative mt-4 h-40 -rotate-1 overflow-hidden rounded-xl bg-white p-1.5">
        <div
          className="h-full w-full rounded-md bg-no-repeat"
          style={{
            backgroundImage: `url(${imgUrl})`,
            backgroundSize: bgSize || "cover",
            backgroundPosition: bgPosition || "center",
          }}
          role="img"
          aria-label={`${title} preview`}
        />
        <span className="washi-tape -top-2 left-1/2 -translate-x-1/2 rotate-2" />
      </div>

      <h3 className={`mt-5 text-lg font-extrabold ${text}`}>{title}</h3>
      <p className={`mt-2 flex-1 text-sm leading-relaxed ${sub}`}>{description}</p>

      <Link
        href={gitUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-4 inline-flex w-fit items-center gap-1 text-sm font-bold underline decoration-2 underline-offset-4 transition active:scale-[0.97] ${text}`}
      >
        View Project →
      </Link>
    </div>
  );
};

export default ProjectCard;
