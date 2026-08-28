import React from "react";
import GithubIcon from "../public/github-icon.svg";
import LinkedinIcon from "../public/linkedin-icon.svg";
import InstagramIcon from "../public/instagram-icon.svg";
import Link from "next/link";
import Image from "next/image";
import GmailIcon from "../public/gmail-icon.svg";

const SOCIAL_LINKS = [
  { href: "https://github.com/Lisosimida", icon: GithubIcon, label: "GitHub", color: "bg-white" },
  { href: "https://www.linkedin.com/in/guan-li-soh-b019a7233/", icon: LinkedinIcon, label: "LinkedIn", color: "bg-accent-blue" },
  { href: "https://www.instagram.com/lisohlisoh/", icon: InstagramIcon, label: "Instagram", color: "bg-accent-pink" },
  { href: "mailto:lisoh03@gmail.com", icon: GmailIcon, label: "Email", color: "bg-accent-yellow" },
];

const EmailSection = () => {
  return (
    <section id="contact" className="py-20">
      <div className="mb-10 flex items-center gap-3">
        <span className="h-px flex-1 border-t-2 border-dashed border-paper-ink/25" />
        <span className="font-hand text-lg text-paper-ink/60">let&apos;s talk! 🙂</span>
      </div>

      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <span className="sticker-sm inline-flex items-center gap-2 rounded-full bg-accent-mint px-4 py-1.5 text-xs font-bold text-paper-ink">
            <span className="h-2 w-2 rounded-full bg-paper-ink" />
            Let&apos;s build something useful
          </span>

          <h2 className="mt-5 font-heading text-4xl uppercase tracking-tight text-paper-ink sm:text-5xl">
            Let&apos;s Connect
          </h2>

          <p className="mt-3 max-w-xl text-base leading-relaxed text-paper-ink/70 sm:text-lg">
            I&apos;m currently open to AI Engineer opportunities. If you&apos;re hiring, collaborating, or want to chat about LLM/RAG/NLP
            work, I&apos;ll reply as soon as I can.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="mailto:lisoh03@gmail.com" className="btn-contrast">
              Email me
            </Link>
            <Link href="#projects" className="btn-ghost">
              See Projects
            </Link>
          </div>
        </div>

        <div className="sticker rounded-2xl bg-white p-6">
          <h3 className="font-hand text-2xl text-paper-ink">Social</h3>
          <p className="mt-2 text-sm text-paper-ink/60">
            Quick links to my profiles.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {SOCIAL_LINKS.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`sticker-sm sticker-press inline-flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-paper-ink transition ${social.color}`}
                aria-label={`Open ${social.label}`}
              >
                <Image src={social.icon} alt={social.label} width={20} height={20} className="invert" />
                {social.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailSection;
