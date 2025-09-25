// StepReview.jsx
// Summarises the wizard inputs and lets the student make final adjustments before confirming.
import Badge from '../shared/Badge.jsx';

const formatCurrency = (value) =>
  typeof value === 'number'
    ? value.toLocaleString('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
    : '—';

const StepReview = ({ academics, preferences, shortlist, onRemove, confirmDisabled, reviewError }) => (
  <section className="space-y-8" aria-labelledby="wizard-step-review">
    <header className="space-y-2">
      <h2 id="wizard-step-review" className="text-xl font-semibold text-slate-900">
        Review & confirm
      </h2>
      <p className="text-sm text-slate-500">
        Double-check your profile information and shortlist. You can still adjust the shortlist before confirming.
      </p>
    </header>

    <div className="space-y-4">
      <details className="group rounded-3xl border border-slate-200 bg-white p-5" open>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-700">
          Academics
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400 group-open:text-brand-600">
            Collapse
          </span>
        </summary>
        <div className="mt-4 grid gap-4 text-sm text-slate-600 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">GPA</p>
            <p className="mt-1 text-slate-800">
              {academics.gpa} / {academics.scale}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tests</p>
            <ul className="mt-1 space-y-1">
              <li>IELTS: {academics.tests.ielts}</li>
              <li>TOEFL: {academics.tests.toefl}</li>
              <li>SAT: {academics.tests.sat}</li>
            </ul>
          </div>
        </div>
      </details>

      <details className="group rounded-3xl border border-slate-200 bg-white p-5" open>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-700">
          Preferences
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400 group-open:text-brand-600">
            Collapse
          </span>
        </summary>
        <div className="mt-4 space-y-4 text-sm text-slate-600">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Countries</p>
            <p className="mt-1 text-slate-800">{preferences.countries.join(', ')}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fields</p>
            <p className="mt-1 text-slate-800">{preferences.fields.join(', ')}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Languages</p>
            <p className="mt-1 text-slate-800">{preferences.languages.join(', ')}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Budget min</p>
              <p className="mt-1 text-slate-800">{formatCurrency(preferences.budgetMin)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Budget max</p>
              <p className="mt-1 text-slate-800">{formatCurrency(preferences.budgetMax)}</p>
            </div>
          </div>
        </div>
      </details>

      <details className="group rounded-3xl border border-slate-200 bg-white p-5" open>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-700">
          Shortlist
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400 group-open:text-brand-600">
            {shortlist.length} selected
          </span>
        </summary>
        <div className="mt-4 space-y-3">
          {shortlist.map((university) => (
            <div
              key={university.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-slate-900">{university.name}</span>
                <span className="text-xs text-slate-500">
                  {university.city}, {university.country}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="brand">Ranking #{university.ranking}</Badge>
                <button
                  type="button"
                  onClick={() => onRemove(university.id)}
                  className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {shortlist.length === 0 && (
            <p className="text-sm text-slate-500">No universities selected.</p>
          )}
        </div>
      </details>
    </div>

    {reviewError && <p className="text-sm font-semibold text-rose-600">{reviewError}</p>}
    {confirmDisabled && !reviewError && (
      <p className="text-sm text-amber-600">
        Select between 5 and 8 universities to confirm. Use the Back button to adjust your shortlist.
      </p>
    )}
  </section>
);

export default StepReview;
