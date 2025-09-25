// FilterPanel.jsx
// Presents multi-select filters, tuition sliders, and sorting controls for the university search experience.
const SortOptions = [
  { value: 'ranking-asc', label: 'Ranking ↑' },
  { value: 'ranking-desc', label: 'Ranking ↓' },
  { value: 'tuition-asc', label: 'Tuition ↑' },
  { value: 'tuition-desc', label: 'Tuition ↓' },
  { value: 'deadline-asc', label: 'Deadline soonest' },
];

const FilterPanel = ({
  filters,
  onChange,
  onReset,
  countries,
  fields,
  languages,
  tuitionBounds,
}) => {
  const updateFilter = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleValue = (key, value) => {
    const current = new Set(filters[key]);
    if (current.has(value)) {
      current.delete(value);
    } else {
      current.add(value);
    }
    updateFilter(key, Array.from(current));
  };

  return (
    <aside className="flex h-full w-full flex-col gap-6 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Reset all
        </button>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700">Countries</p>
        <div className="mt-3 grid max-h-48 gap-2 overflow-y-auto pr-1 text-sm">
          {countries.map((country) => (
            <label key={country} className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-400"
                checked={filters.countries.includes(country)}
                onChange={() => toggleValue('countries', country)}
              />
              <span>{country}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700">Fields of study</p>
        <div className="mt-3 grid max-h-44 gap-2 overflow-y-auto pr-1 text-sm">
          {fields.map((field) => (
            <label key={field} className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-400"
                checked={filters.fields.includes(field)}
                onChange={() => toggleValue('fields', field)}
              />
              <span>{field}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700">Languages</p>
        <div className="mt-3 grid gap-2 text-sm">
          {languages.map((language) => (
            <label key={language} className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-400"
                checked={filters.languages.includes(language)}
                onChange={() => toggleValue('languages', language)}
              />
              <span>{language}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700">Tuition per year (€)</p>
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>Min {Math.round(filters.tuition[0]).toLocaleString()}</span>
            <input
              type="range"
              min={tuitionBounds[0]}
              max={filters.tuition[1]}
              value={filters.tuition[0]}
              step={250}
              onChange={(event) => updateFilter('tuition', [Number(event.target.value), filters.tuition[1]])}
              className="w-full accent-brand-500"
            />
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>Max {Math.round(filters.tuition[1]).toLocaleString()}</span>
            <input
              type="range"
              min={filters.tuition[0]}
              max={tuitionBounds[1]}
              value={filters.tuition[1]}
              step={250}
              onChange={(event) => updateFilter('tuition', [filters.tuition[0], Number(event.target.value)])}
              className="w-full accent-brand-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700" htmlFor="sort-order">
          Sort by
        </label>
        <select
          id="sort-order"
          value={filters.sort}
          onChange={(event) => updateFilter('sort', event.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400/60"
        >
          {SortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
};

export default FilterPanel;
