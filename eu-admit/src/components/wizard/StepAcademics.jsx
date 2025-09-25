// StepAcademics.jsx
// Collects academic background inputs including GPA scale, GPA value, and standardized test scores.
const scaleOptions = [
  { label: '0 – 4.0', value: '4.0' },
  { label: '0 – 10', value: '10' },
];

const StepAcademics = ({ value, onChange, onTestChange, errors = {} }) => {
  const activeScale = value.scale ?? '4.0';
  const gpaId = 'wizard-gpa';
  const testIds = {
    ielts: 'wizard-ielts',
    toefl: 'wizard-toefl',
    sat: 'wizard-sat',
  };

  const gpaMax = activeScale === '10' ? 10 : 4;

  return (
    <section className="space-y-8" aria-labelledby="wizard-step-academics">
      <header className="space-y-2">
        <h2 id="wizard-step-academics" className="text-xl font-semibold text-slate-900">
          Academic profile
        </h2>
        <p className="text-sm text-slate-500">
          Share your GPA scale and recent test scores so we can surface realistic program matches.
        </p>
      </header>

      <div className="space-y-6">
        <div className="space-y-3">
          <span className="text-sm font-medium text-slate-700">GPA scale</span>
          <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="GPA scale">
            {scaleOptions.map((option) => {
              const isActive = activeScale === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => onChange({ scale: option.value })}
                  className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${
                    isActive
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor={gpaId} className="text-sm font-medium text-slate-700">
            GPA
          </label>
          <input
            id={gpaId}
            type="number"
            min={0}
            max={gpaMax}
            step="0.1"
            value={value.gpa ?? ''}
            onChange={(event) => onChange({ gpa: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400/40"
            aria-describedby={errors.gpa ? `${gpaId}-error` : undefined}
          />
          <p className="text-xs text-slate-500">Enter your cumulative GPA using the selected scale.</p>
          {errors.gpa && (
            <p id={`${gpaId}-error`} className="text-xs font-medium text-rose-600">
              {errors.gpa}
            </p>
          )}
        </div>

        <fieldset className="space-y-4">
          <legend className="text-sm font-medium text-slate-700">Recent test scores</legend>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor={testIds.ielts} className="text-xs font-medium uppercase tracking-wide text-slate-500">
                IELTS
              </label>
              <input
                id={testIds.ielts}
                type="number"
                min={0}
                max={9}
                step="0.5"
                value={value.tests?.ielts ?? ''}
                onChange={(event) => onTestChange('ielts', event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400/40"
                aria-describedby={errors.tests?.ielts ? `${testIds.ielts}-error` : undefined}
              />
              {errors.tests?.ielts && (
                <p id={`${testIds.ielts}-error`} className="text-xs font-medium text-rose-600">
                  {errors.tests.ielts}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor={testIds.toefl} className="text-xs font-medium uppercase tracking-wide text-slate-500">
                TOEFL
              </label>
              <input
                id={testIds.toefl}
                type="number"
                min={0}
                max={120}
                step="1"
                value={value.tests?.toefl ?? ''}
                onChange={(event) => onTestChange('toefl', event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400/40"
                aria-describedby={errors.tests?.toefl ? `${testIds.toefl}-error` : undefined}
              />
              {errors.tests?.toefl && (
                <p id={`${testIds.toefl}-error`} className="text-xs font-medium text-rose-600">
                  {errors.tests.toefl}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor={testIds.sat} className="text-xs font-medium uppercase tracking-wide text-slate-500">
                SAT
              </label>
              <input
                id={testIds.sat}
                type="number"
                min={400}
                max={1600}
                step="10"
                value={value.tests?.sat ?? ''}
                onChange={(event) => onTestChange('sat', event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400/40"
                aria-describedby={errors.tests?.sat ? `${testIds.sat}-error` : undefined}
              />
              {errors.tests?.sat && (
                <p id={`${testIds.sat}-error`} className="text-xs font-medium text-rose-600">
                  {errors.tests.sat}
                </p>
              )}
            </div>
          </div>
        </fieldset>
      </div>
    </section>
  );
};

export default StepAcademics;
