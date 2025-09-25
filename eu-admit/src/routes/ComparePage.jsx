// ComparePage.jsx
// Displays a responsive comparison table across selected universities with key attributes.
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Container from '../components/layout/Container.jsx';
import Badge from '../components/shared/Badge.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';
import { useAppContext } from '../context/AppContext.jsx';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);

const ComparePage = () => {
  const location = useLocation();
  const routeCompare = location.state?.compare ?? [];
  const { universities, compareIds, toggleCompare, clearCompare } = useAppContext();
  const compareList = routeCompare.length ? routeCompare : compareIds;

  const comparedUniversities = useMemo(
    () => universities.filter((uni) => compareList.includes(uni.id)),
    [universities, compareList],
  );

  const attributes = [
    {
      label: 'Tuition',
      render: (uni) =>
        uni.tuitionEUR.min === uni.tuitionEUR.max
          ? formatCurrency(uni.tuitionEUR.min)
          : `${formatCurrency(uni.tuitionEUR.min)} - ${formatCurrency(uni.tuitionEUR.max)}`,
    },
    {
      label: 'Languages',
      render: (uni) => (uni.languages ?? [uni.language]).join(', '),
    },
    {
      label: 'Ranking',
      render: (uni) => `#${uni.ranking}`,
    },
    {
      label: 'Next deadline',
      render: (uni) =>
        uni.deadlines?.[0]?.date
          ? new Date(uni.deadlines[0].date).toLocaleDateString()
          : 'TBC',
    },
    {
      label: 'Entry criteria highlights',
      render: (uni) => uni.entryCriteria.map((c) => c.value).slice(0, 2).join(' • '),
    },
  ];

  if (comparedUniversities.length === 0) {
    return (
      <Container className="space-y-6">
        <h1 className="text-2xl font-semibold text-slate-900">Compare universities</h1>
        <EmptyState
          title="No universities selected"
          subtitle="Select at least two universities from the search results to compare them side by side."
          actionLabel="Browse search"
          onAction={() => window.history.back()}
        />
      </Container>
    );
  }

  return (
    <Container className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Compare universities</h1>
          <p className="text-sm text-slate-500">Assess programs side by side to find your best fit.</p>
        </div>
        <button
          type="button"
          onClick={clearCompare}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-500 hover:text-brand-600"
        >
          Clear selection
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-x-4 border-spacing-y-3">
          <thead>
            <tr>
              <th className="w-44 align-top text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Attribute
              </th>
              {comparedUniversities.map((uni) => (
                <th key={uni.id} className="w-72 align-top">
                  <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-card">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{uni.name}</p>
                      <p className="text-xs text-slate-500">
                        {uni.city}, {uni.country}
                      </p>
                      <Badge tone="brand" className="mt-2">Ranking #{uni.ranking}</Badge>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleCompare(uni.id, false)}
                      className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500 hover:bg-slate-200"
                    >
                      Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attributes.map((attribute) => (
              <tr key={attribute.label} className="align-top">
                <th className="w-44 pb-6 text-left text-sm font-semibold text-slate-600">{attribute.label}</th>
                {comparedUniversities.map((uni) => (
                  <td key={uni.id} className="w-72 pb-6">
                    <div className="rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
                      {attribute.render(uni)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
};

export default ComparePage;
