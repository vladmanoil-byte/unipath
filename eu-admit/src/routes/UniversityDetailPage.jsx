// UniversityDetailPage.jsx
// Presents an in-depth overview for a university with tabs, key facts, and quick actions.
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Container from '../components/layout/Container.jsx';
import Skeleton from '../components/shared/Skeleton.jsx';
import Badge from '../components/shared/Badge.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';
import { useAppContext } from '../context/AppContext.jsx';

const tabs = ['Overview', 'Entry Criteria', 'Programs', 'Deadlines'];

const UniversityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { universities, addApplicationDraft, compareIds, toggleCompare } = useAppContext();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isLoading, setIsLoading] = useState(true);

  const university = useMemo(() => universities.find((uni) => uni.id === id), [id, universities]);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timeout);
  }, [id]);

  if (!university && !isLoading) {
    return (
      <Container className="space-y-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          ← Back to search
        </button>
        <EmptyState
          title="University not found"
          subtitle="This institution may have been removed. Try searching again."
          actionLabel="Go to search"
          onAction={() => navigate('/search')}
        />
      </Container>
    );
  }

  if (isLoading || !university) {
    return (
      <Container className="space-y-6">
        <Skeleton variant="card" className="h-64" />
        <Skeleton variant="text" lines={6} />
      </Container>
    );
  }

  const primaryDeadline = university.deadlines?.[0]?.date;
  const tuitionRange =
    university.tuitionEUR.min === university.tuitionEUR.max
      ? new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
          university.tuitionEUR.min,
        )
      : `${
          new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
            university.tuitionEUR.min,
          )
        } - ${
          new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
            university.tuitionEUR.max,
          )
        }`;

  return (
    <div>
      <div className="relative h-72 w-full overflow-hidden">
        <img
          src={university.heroImage}
          alt="Campus view"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-slate-900/10" />
        <Container className="absolute bottom-6 left-0 right-0 flex flex-col gap-4 text-white">
          <div className="flex items-center gap-4">
            <img src={university.logo} alt="" className="h-16 w-16 rounded-2xl border border-white/30 bg-white/80 p-2" />
            <div>
              <h1 className="text-3xl font-bold">{university.name}</h1>
              <p className="text-sm text-slate-200">
                {university.city}, {university.country}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge tone="brand">Ranking #{university.ranking}</Badge>
            <Badge tone="green">Tuition {tuitionRange}</Badge>
            <Badge tone="gray">Languages: {(university.languages ?? [university.language]).join(', ')}</Badge>
          </div>
        </Container>
      </div>

      <Container className="mt-10 grid gap-10 md:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'Overview' && (
            <section className="space-y-4 text-sm text-slate-600">
              <p>
                {university.name} blends academic rigor with real-world experience through programs in {university.fields
                  .slice(0, 3)
                  .join(', ')}. Students benefit from industry partnerships, research labs, and vibrant campus life across {university.city}.
              </p>
              <p>
                Instruction is offered in {(university.languages ?? [university.language]).join(', ')} with dedicated support for international students, including buddy programs and housing guidance.
              </p>
            </section>
          )}

          {activeTab === 'Entry Criteria' && (
            <section>
              <table className="w-full text-left text-sm text-slate-600">
                <tbody>
                  {university.entryCriteria.map((criteria) => (
                    <tr key={criteria.label} className="border-b border-slate-100">
                      <th scope="row" className="py-3 font-semibold text-slate-700">
                        {criteria.label}
                      </th>
                      <td className="py-3">{criteria.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {activeTab === 'Programs' && (
            <section className="space-y-4">
              {university.programs.map((program) => (
                <div key={program.name} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <h3 className="text-base font-semibold text-slate-800">{program.name}</h3>
                  <p className="text-xs uppercase tracking-wide text-slate-400">{program.degree}</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Expect project-based learning, mentorship, and exchange opportunities tailored to {program.degree} students.
                  </p>
                </div>
              ))}
            </section>
          )}

          {activeTab === 'Deadlines' && (
            <section className="space-y-4">
              {university.deadlines.map((deadline) => (
                <div key={deadline.label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <div>
                    <p className="font-semibold text-slate-800">{deadline.label}</p>
                    <p>{new Date(deadline.date).toLocaleDateString()}</p>
                  </div>
                  <Badge tone="orange">Mark your calendar</Badge>
                </div>
              ))}
            </section>
          )}
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="text-sm font-semibold text-slate-800">Next deadline</h2>
            <p className="mt-1 text-2xl font-semibold text-brand-600">
              {primaryDeadline ? new Date(primaryDeadline).toLocaleDateString() : 'TBC'}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Prepare materials early to avoid last-minute rush.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card space-y-4">
            <button
              type="button"
              onClick={() => addApplicationDraft(university.id)}
              className="w-full rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-700"
            >
              Add to applications
            </button>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <input
                type="checkbox"
                checked={compareIds.includes(university.id)}
                onChange={(event) => toggleCompare(university.id, event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-400"
              />
              Add to compare
            </label>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-400 hover:text-brand-600"
            >
              View dashboard
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-card">
            <h3 className="text-sm font-semibold text-slate-800">Why students choose {university.name}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Career services with EU internship connections</li>
              <li>Vibrant international community and societies</li>
              <li>Research labs focused on {university.fields[0]}</li>
            </ul>
          </div>
        </aside>
      </Container>
    </div>
  );
};

export default UniversityDetailPage;
