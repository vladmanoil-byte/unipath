// CountriesStrip.jsx
// Displays a horizontally scrollable list of focus countries for the admissions platform.
import Container from '../layout/Container.jsx';

const countries = ['DE', 'NL', 'FR', 'SE', 'DK', 'FI', 'ES', 'IT', 'IE', 'AT'];

const CountriesStrip = () => (
  <section className="bg-slate-900 py-10">
    <Container>
      <div className="flex items-center justify-between gap-3 overflow-x-auto py-2">
        {countries.map((country) => (
          <span
            key={country}
            className="whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-slate-100"
          >
            {country}
          </span>
        ))}
      </div>
    </Container>
  </section>
);

export default CountriesStrip;
