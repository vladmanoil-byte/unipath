// RecommendationStrip.jsx
// Horizontally scrollable list of suggested universities tailored to the user's profile preferences.
import Badge from '../shared/Badge.jsx';

const RecommendationStrip = ({ items, onToggleCompare, compareIds }) => {
  if (!items?.length) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">Recommended for you</h2>
        <p className="text-xs text-slate-500">Curated using your profile preferences</p>
      </div>
      <div className="-mx-4 overflow-x-auto pb-3 sm:mx-0">
        <div className="flex min-w-full gap-4 px-4 sm:px-0">
          {items.map((uni) => (
            <article
              key={uni.id}
              className="flex w-72 shrink-0 flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-card"
            >
              <div className="flex items-center gap-3">
                <img src={uni.logo} alt="" className="h-12 w-12 rounded-xl object-cover" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">{uni.name}</h3>
                  <p className="text-xs text-slate-500">
                    {uni.city}, {uni.country}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                {uni.fields.slice(0, 3).join(' • ')}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge tone="brand">Ranking #{uni.ranking}</Badge>
                <Badge tone="gray">{uni.languages?.[0] ?? uni.language}</Badge>
              </div>
              <label className="mt-5 flex items-center gap-2 text-xs font-medium text-brand-600">
                <input
                  type="checkbox"
                  checked={compareIds.includes(uni.id)}
                  onChange={(event) => onToggleCompare(uni.id, event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-400"
                />
                Compare
              </label>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendationStrip;
