// LandingPage.jsx
// Composes the marketing landing page with hero, product value sections, and footer.
import Hero from '../components/marketing/Hero.jsx';
import ValueProps from '../components/marketing/ValueProps.jsx';
import CountriesStrip from '../components/marketing/CountriesStrip.jsx';
import FeatureHighlights from '../components/marketing/FeatureHighlights.jsx';
import Testimonials from '../components/marketing/Testimonials.jsx';
import CTA from '../components/marketing/CTA.jsx';
import SiteFooter from '../components/marketing/SiteFooter.jsx';

const LandingPage = () => (
  <main>
    <Hero />
    <ValueProps />
    <CountriesStrip />
    <FeatureHighlights />
    <Testimonials />
    <CTA />
    <SiteFooter />
  </main>
);

export default LandingPage;
