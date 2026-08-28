import React from "react";
import { useTransition, useState } from "react";
import TabButton from "./TabButton";
import Image from "next/image";

const TAB_DATA = [
    {
        title: "AI / ML",
        id: "ai-ml",
        color: "bg-accent-mint",
        content: (
          <ul className="list-disc pl-4 text-paper-ink/70">
                <li>NLP, NER, LLMs, RAG</li>
                <li>CNNs, supervised learning, model evaluation</li>
                <li>Feature engineering and experimentation</li>
          </ul>
        ),
    },
    {
        title: "Engineering",
        id: "engineering",
        color: "bg-accent-blue",
        content: (
          <ul className="list-disc pl-4 text-paper-ink/70">
                <li>Python, Java, SQL, R</li>
                <li>Streamlit, LangChain, Ollama</li>
                <li>AWS, Microsoft Azure, Git</li>
          </ul>
        ),
    },
    {
        title: "Experience",
        id: "experience",
        color: "bg-accent-pink",
        content: (
          <ul className="list-disc pl-4 text-paper-ink/70">
            <li>AI Engineer Intern @ CelcomDigi (LLM chatbots, RAG, PDF Q&amp;A)</li>
            <li>Data Analyst Engineer @ Tencent Games (data workflows, case analysis)</li>
          </ul>
        ),
    },
    {
        title: "Education",
        id: "education",
        color: "bg-accent-yellow",
        content: (
          <ul className="list-disc pl-4 text-paper-ink/70">
                <li>APU — BSc (Hons) Computer Science (Data Analytics), First Class</li>
                <li>Vice Chancellor’s List (2022/2023)</li>
          </ul>
        ),
    }
];

const AboutMe = () => {
    const[tab, setTab] = useState("ai-ml");
    const[isPending, startTransition] = useTransition();

    const handleTabChange = (id) => {
        startTransition(() => {
            setTab(id);
        });
    };

    return(
        <section className="py-20" id="aboutMe">
            <div className="mb-10 flex items-center gap-3">
                <span className="h-px flex-1 border-t-2 border-dashed border-paper-ink/25" />
                <span className="font-hand text-lg text-paper-ink/60">about me!</span>
            </div>

            <div className="grid grid-cols-1 items-start gap-16 md:grid-cols-2">
                <div className="relative mx-auto h-72 w-64 sm:h-80 sm:w-72">
                    <div className="sticker absolute left-0 top-0 -rotate-3 bg-white p-3 sm:w-64">
                        <div className="relative h-56 w-full overflow-hidden sm:h-64 sm:w-56">
                            <Image src="/AboutMe.png" alt="Li Soh" fill sizes="256px" className="object-cover" />
                        </div>
                        <p className="mt-2 text-center font-hand text-sm text-paper-ink/70">me, thinking about RAG pipelines</p>
                        <span className="washi-tape -top-3 left-1/2 -translate-x-1/2 -rotate-2" />
                    </div>

                    <div className="sticker absolute bottom-0 right-0 w-40 rotate-6 bg-white p-2 sm:w-48">
                        <div className="relative h-32 w-full overflow-hidden sm:h-36">
                            <Image src="/Hero-Section.png" alt="Li Soh" fill sizes="192px" className="object-cover" />
                        </div>
                        <p className="mt-2 text-center font-hand text-xs text-paper-ink/70">my setup</p>
                        <span className="washi-tape -top-3 left-1/2 -translate-x-1/2 rotate-3" />
                    </div>
                </div>

                <div>
                    <div className="sticker-sm inline-block rounded-xl bg-paper-cream px-4 py-1.5">
                        <span className="font-hand text-lg text-paper-ink">what's up</span>
                    </div>

                    <p className="mt-5 font-hand text-xl leading-relaxed text-paper-ink/80 sm:text-2xl">
                        I&apos;m an early-career engineer who gets a little too excited about building practical AI systems. ✨
                        I care about the small details, the edge cases everyone forgets, and shipping work that genuinely
                        makes someone&apos;s day easier.
                    </p>

                    <p className="mt-4 text-sm leading-relaxed text-paper-ink/70">
                        I&apos;ve shipped real-world chatbot work during my internship at CelcomDigi (LLM + RAG, internal assistance, PDF
                        querying) and I&apos;m currently working as a Data Analyst Engineer at Tencent Games where I execute data workflows
                        and support policy-driven case analysis.
                    </p>

                    <div className="mt-8 flex flex-row flex-wrap gap-2">
                        {TAB_DATA.map((t) => (
                            <TabButton
                                key={t.id}
                                selectTab={() => handleTabChange(t.id)}
                                active={tab === t.id}
                                color={t.color}
                            >
                                {t.title}
                            </TabButton>
                        ))}
                    </div>

                    <div className="sticker mt-6 rounded-2xl bg-white p-5">
                        {TAB_DATA.find((t) => t.id === tab).content}
                    </div>
                </div>
            </div>
        </section>
    );
};
export default AboutMe;
