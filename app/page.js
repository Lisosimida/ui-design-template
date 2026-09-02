import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactForm from '../components/shared/ContactForm';
import Reveal from '../components/shared/Reveal';
import site from '../config/site';

export default function ShowcasePage() {
  return (
    <>
      <Navbar
        brand={site.templateName}
        items={site.nav.map((n) => ({ label: n.label, href: n.href }))}
        cta={{ label: 'Get this template', href: '#contact' }}
      />

      <section className="relative overflow-hidden pb-20 pt-28 sm:pt-36">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(ellipse_at_top,_rgb(var(--accent)/0.22),_transparent_65%)]"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <span className="eyebrow">{site.tagline}</span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight text-fg sm:text-6xl">
              {site.headline}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{site.subhead}</p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="#demos" className="btn-primary w-full sm:w-auto">
              See the demos
            </Link>
            <Link href="#contact" className="btn-secondary w-full sm:w-auto">
              Get this template
            </Link>
          </Reveal>
        </div>
      </section>

      <section id="demos" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">One template, two demos</span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
              Same components. Different config.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
              Both pages below share the same design system — only the config file changes.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {site.demos.map((demo, i) => (
              <Reveal key={demo.href} delay={i * 0.1}>
                <div data-accent={demo.accent} className="card group flex h-full flex-col p-8">
                  <span className="eyebrow w-fit">{demo.label}</span>
                  <p className="mt-4 flex-1 text-base leading-relaxed text-muted">{demo.description}</p>
                  <Link
                    href={demo.href}
                    className="btn-primary mt-6 w-fit"
                  >
                    View demo
                    <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ContactForm heading="Get this template" subhead="Tell us about your product launch or event — we'll get you set up with your own copy." />

      <Footer brand={site.templateName} note={site.footer.note} />
    </>
  );
}
