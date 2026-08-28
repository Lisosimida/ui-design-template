import React from "react";
import Link from "next/link";

const ResumeSection = () => {
  return (
    <section id="resume" className="py-20">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <span className="sticker-sm inline-flex items-center gap-2 rounded-full bg-accent-mint px-4 py-1.5 text-xs font-bold text-paper-ink">
            <span className="h-2 w-2 rounded-full bg-paper-ink" />
            Open to AI Engineer opportunities
          </span>

          <h2 className="mt-5 font-heading text-4xl uppercase tracking-tight text-paper-ink sm:text-5xl">
            Resume Snapshot
          </h2>
          <p className="mt-3 text-base leading-relaxed text-paper-ink/70 sm:text-lg">
            NLP + LLM applications with real-world internship delivery. Strong focus on end-to-end systems: data pipelines,
            modeling, evaluation, and product-ready interfaces.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sticker rounded-2xl bg-accent-yellow p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-paper-ink/70">Award</div>
              <div className="mt-1 text-lg font-extrabold text-paper-ink">Best Student Project</div>
              <div className="mt-1 text-sm text-paper-ink/70">APU (FYP)</div>
            </div>
            <div className="sticker rounded-2xl bg-accent-blue p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-paper-ink/70">Focus</div>
              <div className="mt-1 text-lg font-extrabold text-paper-ink">NLP • LLM • RAG</div>
              <div className="mt-1 text-sm text-paper-ink/70">NER, parsing, matching</div>
            </div>
            <div className="sticker rounded-2xl bg-accent-pink p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-paper-ink/70">Strength</div>
              <div className="mt-1 text-lg font-extrabold text-paper-ink">Experimentation</div>
              <div className="mt-1 text-sm text-paper-ink/70">Model comparison & eval</div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-xl">
          <div className="sticker rounded-2xl bg-white p-6">
            <h3 className="font-hand text-2xl text-paper-ink">Flagship Work</h3>

            <div className="mt-4 space-y-4">
              <div className="rounded-xl border-2 border-paper-ink/15 bg-paper-cream p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-base font-extrabold text-paper-ink">
                    Resume Parsing & Job Matching (NLP)
                  </div>
                  <div className="text-xs font-bold text-paper-ink/60">Python • NLP • ML • Streamlit</div>
                </div>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-paper-ink/70">
                  <li>End-to-end pipeline: parsing → entity extraction → structured representation → matching</li>
                  <li>Implemented NER to extract skills, education, and experience</li>
                  <li>Trained and evaluated multiple ML approaches with systematic experiments</li>
                </ul>
              </div>

              <div className="rounded-xl border-2 border-paper-ink/15 bg-paper-cream p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-base font-extrabold text-paper-ink">Home Fibre Chatbot (RAG)</div>
                  <div className="text-xs font-bold text-paper-ink/60">LLM • LangChain • RAG</div>
                </div>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-paper-ink/70">
                  <li>Conversational complaint handling and plan recommendation</li>
                  <li>Retrieval-augmented answers for higher relevance and consistency</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="https://drive.google.com/file/d/18TXsY-gFpmgBx-jva8k7ffbZxOxmSUma/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-contrast flex-1"
              >
                View Resume (PDF)
              </Link>
              <Link
                href="#projects"
                className="btn-ghost flex-1"
              >
                See Projects
              </Link>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-paper-ink/50">
              Tip: For AI Engineer roles, hiring managers scan for end-to-end delivery, evaluation discipline, and production
              awareness. This section is designed to make those signals obvious in under 10 seconds.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeSection;
