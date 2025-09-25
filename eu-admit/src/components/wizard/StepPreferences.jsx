// StepPreferences.jsx
// Captures desired fields of study, countries, instruction languages, and budget expectations.
const SelectChip = ({ checked, label, onClick, id }) => (
  <button
    type="button"
    data-checked={checked}
    onClick={onClick}
    id={id}
    className={`inline-flex items-center rounded-full border px-3 py-1 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${
      checked
        ? 'border-brand-500 bg-brand-50 text-brand-700'
        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
    }`}
    aria-pressed={checked}
  >
    {label}
  </button>
);

const StepPreferences = ({ value, onChange, onToggle, options, errors = {} }) => {
  const budgetMinId = 'wizard-budget-min';
  const budgetMaxId = 'wizard-budget-max';

  return (
    <section className="space-y-8" aria-labelledby="wizard-step-preferences">
      <header className="space-y-2">
        <h2 id="wizard-step-preferences" className="text-xl font-semibold text-slate-900">
          Preferences & fit
        </h2>
        <p className="text-sm text-slate-500">
          Tell us where and what you want to study so the shortlist reflects your ambitions.
        </p>
      </header>

      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-slate-700">Preferred countries</p>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Preferred countries">
            {options.countries.map((country) => {
              const isChecked = value.countries?.includes(country);
              return (
                <SelectChip
                  key={country}
                  label={country}
                  checked={isChecked}
                  onClick={() => onToggle('countries', country)}
                />
              );
            })}
          </div>
          {errors.countries && <p className="mt-2 text-xs font-medium text-rose-600">{errors.countries}</p>}
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700">Fields of study</p>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Preferred fields">
            {options.fields.map((field) => {
              const isChecked = value.fields?.includes(field);
              return (
                <SelectChip
                  key={field}
                  label={field}
                  checked={isChecked}
                  onClick={() => onToggle('fields', field)}
                />
              );
            })}
          </div>
          {errors.fields && <p className="mt-2 text-xs font-medium text-rose-600">{errors.fields}</p>}
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700">Instruction languages</p>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Preferred instruction languages">
            {options.languages.map((language) => {
              const isChecked = value.languages?.includes(language);
              return (
                <SelectChip
                  key={language}
                  label={language}
                  checked={isChecked}
                  onClick={() => onToggle('languages', language)}
                />
              );
            })}
          </div>
          {errors.languages && <p className="mt-2 text-xs font-medium text-rose-600">{errors.languages}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor={budgetMinId} className="text-sm font-medium text-slate-700">
              Budget minimum (EUR)
            </label>
            <input
              id={budgetMinId}
              type="number"
              min={0}
              step="500"
              value={value.budgetMin ?? ''}
              onChange={(event) => onChange({ budgetMin: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400/40"
              aria-describedby={errors.budget ? `${budgetMinId}-error` : undefined}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor={budgetMaxId} className="text-sm font-medium text-slate-700">
              Budget maximum (EUR)
            </label>
            <input
              id={budgetMaxId}
              type="number"
              min={0}
              step="500"
              value={value.budgetMax ?? ''}
              onChange={(event) => onChange({ budgetMax: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400/40"
              aria-describedby={errors.budget ? `${budgetMaxId}-error` : undefined}
            />
          </div>
          {errors.budget && (
            <p id={`${budgetMinId}-error`} className="text-xs font-medium text-rose-600 sm:col-span-2">
              {errors.budget}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default StepPreferences;
