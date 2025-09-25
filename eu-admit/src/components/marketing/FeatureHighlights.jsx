// FeatureHighlights.jsx
// Summarizes the product pillars with iconography and descriptive copy.
import Container from '../layout/Container.jsx';

const highlights = [
  {
    title: 'Search & Compare',
    description: 'Discover EU universities with flexible filters and side-by-side comparisons.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className="h-6 w-6 text-brand-500">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 6.75a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Zm9 14.25-4.5-4.5"
        />
      </svg>
    ),
  },
  {
    title: 'Application Dashboard',
    description: 'Track statuses, deadlines, and tasks in one proactive command center.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className="h-6 w-6 text-brand-500">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 5.25h15a1.5 1.5 0 0 1 1.5 1.5v10.5a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5V6.75a1.5 1.5 0 0 1 1.5-1.5Zm3 3.75h3v7.5h-3Zm6 0h6v3.75h-6Z"
        />
      </svg>
    ),
  },
  {
    title: 'Profile Wizard',
    description: 'Answer a few questions to unlock tailored recommendations and alerts.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className="h-6 w-6 text-brand-500">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 1.5c-3.75 0-7.5 1.875-7.5 4.5V21h15v-3c0-2.625-3.75-4.5-7.5-4.5Z"
        />
      </svg>
    ),
  },
];

const FeatureHighlights = () => (
  <section className="bg-slate-50 py-16 sm:py-24">
    <Container>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Everything you need in one platform</h2>
        <p className="mt-4 text-base text-slate-600">
          Power up your search, stay accountable, and move forward with clarity.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {highlights.map((feature) => (
          <article key={feature.title} className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50">{feature.icon}</div>
            <h3 className="mt-6 text-xl font-semibold text-slate-900">{feature.title}</h3>
            <p className="mt-3 text-sm text-slate-600">{feature.description}</p>
          </article>
        ))}
      </div>
    </Container>
  </section>
);

export default FeatureHighlights;
