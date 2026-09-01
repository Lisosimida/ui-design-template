import React from "react";
import ProjectCard from "./ProjectCard";

const projectData = [
    {
        id: 1,
        title: "NLP Resume Parsing and Job Matching",
        description: "Used NLP techniques to build resume parsing and job matching system",
        image: "/projects/hr.jpg",
        gitUrl: "https://github.com/Lisosimida/parslyst-resume-system",
        bgPosition: "left center",
        bgSize: "80%",
    },
    {
        id: 2,
        title: "Deep Learning CNN for classification of fashion images",
        description: " The dataset consists of approximately 44,000 color images of fashion items categorized under categories including footwear, tops, dresses and accessories.",
        image: "/projects/fashion.jpg",
        gitUrl: "https://github.com/Lisosimida/deep-learning-cnn",
        bgPosition: "center",
    },
    {
        id: 3,
        title: "Stock Broker Simulation",
        description: "Builded a stock broker simulation system to simulate real-time stock trading environment",
        image: "/projects/stock.jpg",
        gitUrl: "https://github.com/sebasdiii/RTS",
        bgPosition: "center",
    },
    {
        id: 4,
        title: "Spam Email Classification using NLP",
        description: "Used NLP techniques to build a spam email classification system",
        image: "/projects/email.jpg",
        gitUrl: "https://github.com/sebasdiii/NLP-Spam-Email-Classification",
        bgPosition: "center",
    },
    {
        id: 5,
        title: "CelcomDigi Home Fibre Bot",
        description: "This chatbot handles user complaints and recommends home fibre plans based on user preferences.",
        image: "/projects/chatbot.jpg",
        gitUrl: "https://github.com/Lisosimida/homefiberbot1",
        bgPosition: "center top",
        bgSize: "80%",
    },
];

const CARD_STYLES = [
  { bg: "bg-paper-ink", text: "text-paper-cream", sub: "text-paper-cream/60" },
  { bg: "bg-accent-yellow", text: "text-paper-ink", sub: "text-paper-ink/70" },
  { bg: "bg-accent-pink", text: "text-paper-ink", sub: "text-paper-ink/70" },
  { bg: "bg-accent-mint", text: "text-paper-ink", sub: "text-paper-ink/70" },
  { bg: "bg-accent-blue", text: "text-paper-ink", sub: "text-paper-ink/70" },
];

const Project = () => {
  return (
    <section id="projects" className="py-20">
      <div className="mb-6 flex items-center gap-3">
        <span className="font-hand text-lg text-paper-ink/60">selected projects!</span>
        <span className="h-px flex-1 border-t-2 border-dashed border-paper-ink/25" />
      </div>

      <h2 className="font-heading text-4xl uppercase tracking-tight text-paper-ink sm:text-5xl">
        Featured Work
      </h2>

      <p className="mt-3 max-w-2xl text-paper-ink/70">
        AI-focused builds with clear problem framing, evaluation, and end-to-end implementation.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projectData.map((project, index) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            imgUrl={project.image}
            gitUrl={project.gitUrl}
            bgPosition={project.bgPosition}
            bgSize={project.bgSize}
            number={index + 1}
            style={CARD_STYLES[index % CARD_STYLES.length]}
          />
        ))}
      </div>
    </section>
  );
};

export default Project;
