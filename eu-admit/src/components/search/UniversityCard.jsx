// UniversityCard.jsx
// Summarises a university with key stats, highlight badges, and compare toggles.
import { Link } from 'react-router-dom';
import Badge from '../shared/Badge.jsx';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);

const computeDeadlineBadge = (dateString) => {
  if (!dateString) return { tone: 'gray', label: 'Deadline TBC' };
  const deadline = new Date(dateString);
  const now = new Date();
  const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
  if (diffDays <= 7) return { tone: 'red', label: `Due ${deadline.toLocaleDateString()}` };
  if (diffDays <= 21) return { tone: 'orange', label: `Due ${deadline.toLocaleDateString()}` };
  return { tone: 'green', label: `Due ${deadline.toLocaleDateString()}` };
};

const UniversityCard = ({ u, onToggleCompare, checkedForCompare }) => {
  const nextDeadline = u.deadlines?.[0]?.date;
  const deadlineBadge = computeDeadlineBadge(nextDeadline);

  return (
    <article className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lg focus-within:ring-2 focus-within:ring-brand-300">
      <div className="flex items-center gap-4">
        <img src={u.logo} alt={`${u.name} logo`} className="h-14 w-14 rounded-xl object-cover" />
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{u.name}</h3>
          <p className="text-sm text-slate-500">
            {u.city}, {u.country}
          </p>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-4 text-sm text-slate-600">
        <div>
          <dt className="font-semibold text-slate-700">Ranking</dt>
          <dd>#{u.ranking}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-700">Tuition</dt>
          <dd>
            {u.tuitionEUR.min === u.tuitionEUR.max
              ? formatCurrency(u.tuitionEUR.min)
              : `${formatCurrency(u.tuitionEUR.min)} - ${formatCurrency(u.tuitionEUR.max)}`}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-700">Languages</dt>
          <dd>{u.languages?.join(', ') ?? u.language}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-700">Fields</dt>
          <dd>{u.fields.slice(0, 2).join(', ')}{u.fields.length > 2 ? '…' : ''}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Badge tone={deadlineBadge.tone}>{deadlineBadge.label}</Badge>
        <Badge tone="brand">#{u.ranking} in EU</Badge>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <input
            type="checkbox"
            checked={checkedForCompare}
            onChange={(event) => onToggleCompare(u.id, event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-400"
          />
          Compare
        </label>
        <Link
          to={`/university/${u.id}`}
          className="text-sm font-semibold text-brand-600 transition hover:text-brand-700"
        >
          View details →
        </Link>
      </div>
    </article>
  );
};

export default UniversityCard;
