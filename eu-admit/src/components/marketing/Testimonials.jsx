// Testimonials.jsx
// Presents social proof quotes from different personas endorsing the product.
import Container from '../layout/Container.jsx';

const testimonials = [
  {
    quote:
      'UniPath gave me clarity on which EU schools fit my goals and budget—I submitted confident applications ahead of deadlines.',
    name: 'Lena Fischer',
    role: 'Student, Germany',
  },
  {
    quote:
      'The dashboard helped my son stay calm and organized. We knew what to tackle each week.',
    name: 'Marco Santoro',
    role: 'Parent, Italy',
  },
  {
    quote:
      'Finally a tool that lets counselors monitor deadlines without spreadsheets. My students love it.',
    name: 'Aisling Byrne',
    role: 'Counselor, Ireland',
  },
];

const Testimonials = () => (
  <section className="bg-white py-16 sm:py-24">
    <Container>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Students and mentors trust UniPath</h2>
        <p className="mt-4 text-base text-slate-600">
          Hear how future EU undergrads and their supporters keep the process manageable.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {testimonials.map((item) => (
          <figure key={item.name} className="flex h-full flex-col justify-between rounded-2xl bg-slate-50 p-6 shadow-sm">
            <blockquote className="text-sm text-slate-600">“{item.quote}”</blockquote>
            <figcaption className="mt-6 text-left">
              <p className="text-sm font-semibold text-slate-900">{item.name}</p>
              <p className="text-xs text-slate-500">{item.role}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </Container>
  </section>
);

export default Testimonials;
