// WizardPage.jsx
// Provides a placeholder entry point for the onboarding wizard requested by the landing CTA.
import Container from '../components/layout/Container.jsx';

const WizardPage = () => (
  <main className="bg-slate-50 py-16">
    <Container className="space-y-6">
      <h1 className="text-3xl font-semibold text-slate-900">Onboarding Wizard</h1>
      <p className="max-w-2xl text-slate-600">
        The guided onboarding wizard will walk students through academics, preferences, and requirements to personalize their
        experience. This placeholder keeps routing intact for the MVP.
      </p>
    </Container>
  </main>
);

export default WizardPage;
