import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Hero from '../../../components/product/Hero';
import FeaturesBento from '../../../components/product/FeaturesBento';
import HowItWorks from '../../../components/product/HowItWorks';
import Testimonials from '../../../components/product/Testimonials';
import FinalCta from '../../../components/product/FinalCta';
import LogoStrip from '../../../components/shared/LogoStrip';
import AboutSection from '../../../components/shared/AboutSection';
import Gallery from '../../../components/shared/Gallery';
import TierGrid from '../../../components/shared/TierGrid';
import ContactForm from '../../../components/shared/ContactForm';
import product from '../../../config/product';

export const metadata = {
  title: `${product.brand} - Launch Tracking for Product Teams`,
  description: product.hero.subhead,
};

export default function ProductDemoPage() {
  return (
    <div data-accent={product.accent}>
      <Navbar
        brand={product.brand}
        homeHref="/demo/product"
        items={product.nav.map((n) => ({ label: n.label, href: `#${n.id}` }))}
        cta={{ label: 'Start free trial', href: '#pricing' }}
        scrollSpy
      />

      <Hero {...product.hero} />
      <LogoStrip {...product.socialProof} />
      <AboutSection id="about" {...product.about} />
      <FeaturesBento id="features" {...product.features} />
      <HowItWorks id="how-it-works" {...product.howItWorks} />
      <Gallery id="gallery" {...product.gallery} />
      <TierGrid id="pricing" {...product.pricing} tiers={product.pricing.items} />
      <Testimonials id="testimonials" {...product.testimonials} />
      <FinalCta {...product.finalCta} />
      <ContactForm heading="Talk to the Nimbus team" subhead="Questions about pricing or rollout? We're happy to help." />

      <Footer brand={product.brand} note="A demo page built on the Launchbase template." />
    </div>
  );
}
