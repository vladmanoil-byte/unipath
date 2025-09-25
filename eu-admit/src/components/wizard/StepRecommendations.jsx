// StepRecommendations.jsx
// Surfaces recommended universities ranked by fit and allows the student to curate their shortlist.
import Skeleton from '../shared/Skeleton.jsx';
import Badge from '../shared/Badge.jsx';

const StepRecommendations = ({
  recommendations,
  shortlistedIds,
  onToggle,
  onSelectAll,
  onClear,
  loading,
  errors = {},
}) => {
  const selectedCount = shortlistedIds.length;

  return (
    <section className="space-y-8" aria-labelledby="wizard-step-recommendations">
      <header className="space-y-2">
        <h2 id="wizard-step-recommendations" className="text-xl font-semibold text-slate-900">
          Build your shortlist
        </h2>
        <p className="text-sm text-slate-500">
          Choose 5–8 universities to kick-start application planning. We ranked these based on your preferences.
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
        <span className="font-medium text-slate-700">Selected: {selectedCount}</span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onSelectAll}
            className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-600 transition hover:border-brand-400 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            Select all
          </button>
          <button
            type="button"
            onClick={onClear}
            className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-600 transition hover:border-rose-300 hover:text-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            Clear
          </button>
        </div>
      </div>

      {errors.shortlist && (
        <p className="text-sm font-medium text-rose-600">{errors.shortlist}</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {loading &&
          Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} variant="card" className="h-56" />)}

        {!loading && recommendations.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
            We couldn’t find matches yet. Try expanding your preferences or budget.
          </div>
        )}

        {!loading &&
          recommendations.map(({ university, score }) => {
            const isSelected = shortlistedIds.includes(university.id);
            const deadline = university.deadlines?.[0]?.date;
            const tuition = university.tuitionEUR;
            const tuitionLabel =
              tuition && typeof tuition.min === 'number' && typeof tuition.max === 'number'
                ? `${tuition.min.toLocaleString('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })} – ${tuition.max.toLocaleString('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}`
                : 'Varies';

            return (
              <article
                key={university.id}
                className={`flex h-full flex-col justify-between rounded-3xl border p-5 transition ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/70 shadow-card'
                    : 'border-slate-200 bg-white hover:border-brand-200 hover:shadow-sm'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={university.logo}
                        alt=""
                        className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                      />
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">{university.name}</h3>
                        <p className="text-xs text-slate-500">
                          {university.city}, {university.country}
                        </p>
                      </div>
                    </div>
                    <Badge tone="brand">Score {score.toFixed(1)}</Badge>
                  </div>

                  <dl className="grid grid-cols-2 gap-3 text-xs text-slate-500">
                    <div className="space-y-1">
                      <dt className="font-semibold text-slate-600">Ranking</dt>
                      <dd>#{university.ranking}</dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="font-semibold text-slate-600">Tuition</dt>
                      <dd>{tuitionLabel}</dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="font-semibold text-slate-600">Language</dt>
                      <dd>{university.language}</dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="font-semibold text-slate-600">Next deadline</dt>
                      <dd>{deadline ? new Date(deadline).toLocaleDateString() : 'TBC'}</dd>
                    </div>
                  </dl>
                </div>

                <label className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    checked={isSelected}
                    onChange={(event) => onToggle(university.id, event.target.checked)}
                  />
                  Include in shortlist
                </label>
              </article>
            );
          })}
      </div>
    </section>
  );
};

export default StepRecommendations;
