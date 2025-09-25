// CTA.jsx
// Provides a prominent call-to-action to start the onboarding wizard.
import { Link } from 'react-router-dom';
import Container from '../layout/Container.jsx';

const CTA = () => (
  <section className="relative py-16 sm:py-24">
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-500/20 via-sky-400/20 to-indigo-500/20" aria-hidden="true" />
    <Container>
      <div className="rounded-3xl bg-slate-900 p-10 text-center text-white shadow-2xl sm:p-14">
        <h2 className="text-3xl font-semibold sm:text-4xl">Ready to start your profile?</h2>
        <p className="mt-4 text-base text-slate-200">
          Launch the guided wizard to unlock personalized recommendations and alerts tailored to you.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Link
            to="/wizard"
            className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Start your profile
          </Link>
          <Link
            to="/search"
            className="inline-flex items-center justify-center rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Explore universities
          </Link>
        </div>
      </div>
    </Container>
  </section>
);

export default CTA;
