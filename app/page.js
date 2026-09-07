import Navbar from '../components/resume-lab/Navbar';
import Footer from '../components/resume-lab/Footer';
import Hero from '../components/resume-lab/Hero';
import Features from '../components/resume-lab/Features';
import HowItWorks from '../components/resume-lab/HowItWorks';
import FinalCta from '../components/resume-lab/FinalCta';
import site from '../config/site';

export default function HomePage() {
  return (
    <div className="resume-lab rl-page">
      <Navbar brand={site.productName} items={site.nav} cta={{ label: 'Sign up', href: '/sign-up' }} />

      <Hero
        eyebrow={site.tagline}
        headline={site.headline}
        subhead={site.subhead}
        primaryCta={site.primaryCta}
        secondaryCta={site.secondaryCta}
      />

      <Features
        id="features"
        eyebrow="Why it helps"
        heading="More than a spell-check."
        subhead="A structured read of your resume, plus the specific notes a recruiter would actually give you."
        items={site.features}
      />

      <HowItWorks
        id="how-it-works"
        eyebrow="How it works"
        heading="From upload to feedback in under a minute."
        items={site.howItWorks}
      />

      <FinalCta
        headline={site.finalCta.headline}
        subhead={site.finalCta.subhead}
        cta={site.finalCta.cta}
      />

      <Footer brand={site.productName} note={site.footer.note} />
    </div>
  );
}
