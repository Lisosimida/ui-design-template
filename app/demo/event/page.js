import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import EventHero from '../../../components/event/EventHero';
import SpeakersGrid from '../../../components/event/SpeakersGrid';
import AgendaTabs from '../../../components/event/AgendaTabs';
import VenueMap from '../../../components/event/VenueMap';
import LogoStrip from '../../../components/shared/LogoStrip';
import AboutSection from '../../../components/shared/AboutSection';
import Gallery from '../../../components/shared/Gallery';
import TierGrid from '../../../components/shared/TierGrid';
import ContactForm from '../../../components/shared/ContactForm';
import event from '../../../config/event';

export const metadata = {
  title: `${event.brand} - ${event.hero.location}`,
  description: event.hero.subhead,
};

export default function EventDemoPage() {
  return (
    <div data-accent={event.accent}>
      <Navbar
        brand={event.brand}
        homeHref="/demo/event"
        items={event.nav.map((n) => ({ label: n.label, href: `#${n.id}` }))}
        cta={{ label: 'Get your ticket', href: '#tickets' }}
        scrollSpy
      />

      <EventHero {...event.hero} />
      <AboutSection id="about" {...event.about} />
      <SpeakersGrid id="speakers" {...event.speakers} />
      <AgendaTabs id="agenda" {...event.agenda} />
      <Gallery id="gallery" {...event.gallery} />
      <VenueMap id="venue" {...event.venue} />
      <TierGrid id="tickets" {...event.tickets} tiers={event.tickets.items} />
      <LogoStrip {...event.sponsors} />
      <ContactForm heading="Questions about Converge Summit?" subhead="Group tickets, sponsorship, or press — reach out and we'll get back to you." />

      <Footer brand={event.brand} note="A demo page built on the Launchbase template." />
    </div>
  );
}
