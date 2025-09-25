// ValueProps.jsx
// Highlights the core benefits of the platform with concise marketing cards.
import Container from '../layout/Container.jsx';

const valueProps = [
  {
    title: 'Personalized matches',
    description: 'Surface universities that align with your academic profile and dream destinations.',
  },
  {
    title: 'Smart tracking',
    description: 'Stay organized with application status, requirements, and next steps in one view.',
  },
  {
    title: 'Clear deadlines',
    description: 'Deadlines, reminders, and alerts across countries so you never miss a cutoff.',
  },
  {
    title: 'Collaborate soon',
    description: 'Future features will invite parents and counselors to support your journey.',
  },
];

const ValueProps = () => (
  <section className="bg-white py-16 sm:py-24">
    <Container>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Built to support every step</h2>
        <p className="mt-4 text-base text-slate-600">
          From shortlisting to submitting your applications, UniPath keeps you focused on what matters most.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {valueProps.map((prop) => (
          <article
            key={prop.title}
            className="rounded-2xl bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-within:shadow-lg"
          >
            <h3 className="text-xl font-semibold text-slate-900">{prop.title}</h3>
            <p className="mt-3 text-sm text-slate-600">{prop.description}</p>
          </article>
        ))}
      </div>
    </Container>
  </section>
);

export default ValueProps;
