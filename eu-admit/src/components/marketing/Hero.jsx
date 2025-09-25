// Hero.jsx
// Renders the landing page hero with primary messaging and dual calls-to-action.
import { Link } from 'react-router-dom';
import Container from '../layout/Container.jsx';

const statChips = [
  { label: '15 countries' },
  { label: '120+ deadlines tracked' },
  { label: '1,000+ programs' },
];

const Hero = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.35),transparent_60%)]" aria-hidden="true" />
    <Container className="relative flex flex-col gap-12 py-16 lg:flex-row lg:items-center lg:py-24">
      <div className="max-w-xl space-y-8">
        <p className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-wide text-cyan-200">
          Built for EU-bound students
        </p>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Find, track, and ace your EU university applications
          </h1>
          <p className="text-lg text-slate-200">
            Personalized matches, deadline tracking, and a guided workflow—built for EU undergrads.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            to="/wizard"
            className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Get started
          </Link>
          <Link
            to="/search"
            className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Explore universities
          </Link>
        </div>
      </div>
      <div className="flex w-full justify-center lg:justify-end">
        <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-br from-brand-400 via-sky-400 to-indigo-500 p-6 shadow-2xl">
          <div className="absolute -top-6 -left-6 h-20 w-20 rounded-3xl bg-white/10 blur-2xl" aria-hidden="true" />
          <div className="absolute -bottom-10 right-8 h-32 w-32 rounded-full bg-white/20 blur-3xl" aria-hidden="true" />
          <div className="space-y-4 text-left text-white">
            <p className="text-sm uppercase tracking-widest text-white/70">Your playbook</p>
            <p className="text-2xl font-semibold leading-snug">
              Plan every deadline, curate your shortlist, and stay on track with confidence.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {statChips.map((chip) => (
                <div
                  key={chip.label}
                  className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-center text-sm font-medium"
                >
                  {chip.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  </section>
);

export default Hero;
