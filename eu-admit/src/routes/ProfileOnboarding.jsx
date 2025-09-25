// ProfileOnboarding.jsx
// Guides the user through a three-step onboarding form with validation before saving profile preferences.
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/layout/Container.jsx';
import { useAppContext } from '../context/AppContext.jsx';

const steps = [
  { key: 'academics', title: 'Academics' },
  { key: 'interests', title: 'Interests & Countries' },
  { key: 'preferences', title: 'Preferences' },
];

const ProfileOnboarding = () => {
  const navigate = useNavigate();
  const { universities, profile, completeOnboarding } = useAppContext();
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});

  const uniqueFields = useMemo(
    () => Array.from(new Set(universities.flatMap((uni) => uni.fields))).sort(),
    [universities],
  );
  const uniqueCountries = useMemo(
    () => Array.from(new Set(universities.map((uni) => uni.country))).sort(),
    [universities],
  );
  const uniqueLanguages = useMemo(
    () => Array.from(new Set(universities.flatMap((uni) => uni.languages ?? [uni.language]))).sort(),
    [universities],
  );

  const [form, setForm] = useState({
    gpa: profile.academics?.gpa ?? '',
    scale: profile.academics?.scale ?? '4.0',
    tests: {
      ielts: profile.academics?.tests?.ielts ?? '',
      toefl: profile.academics?.tests?.toefl ?? '',
      sat: profile.academics?.tests?.sat ?? '',
    },
    fields: profile.preferences?.fields ?? [],
    countries: profile.preferences?.countries ?? [],
    languages: profile.preferences?.languages ?? [],
    budgetMin: profile.preferences?.budgetMin ?? 0,
    budgetMax: profile.preferences?.budgetMax ?? 12000,
  });

  const validateStep = (stepIndex) => {
    const stepErrors = {};
    if (stepIndex === 0) {
      const gpaValue = Number(form.gpa);
      if (!form.gpa || Number.isNaN(gpaValue)) {
        stepErrors.gpa = 'GPA is required';
      } else {
        const maxScale = Number(form.scale);
        if (gpaValue < 0 || gpaValue > maxScale) {
          stepErrors.gpa = `Enter a value between 0 and ${maxScale}`;
        }
      }
      if (form.tests.ielts && (form.tests.ielts < 0 || form.tests.ielts > 9)) {
        stepErrors.ielts = 'IELTS must be between 0 and 9';
      }
      if (form.tests.toefl && (form.tests.toefl < 0 || form.tests.toefl > 120)) {
        stepErrors.toefl = 'TOEFL must be between 0 and 120';
      }
      if (form.tests.sat && (form.tests.sat < 400 || form.tests.sat > 1600)) {
        stepErrors.sat = 'SAT must be between 400 and 1600';
      }
    }
    if (stepIndex === 1) {
      if (form.fields.length === 0) {
        stepErrors.fields = 'Select at least one field';
      }
      if (form.countries.length === 0) {
        stepErrors.countries = 'Select at least one country';
      }
    }
    if (stepIndex === 2) {
      if (form.languages.length === 0) {
        stepErrors.languages = 'Choose languages you prefer studying in';
      }
      if (Number(form.budgetMin) > Number(form.budgetMax)) {
        stepErrors.budget = 'Minimum budget cannot exceed maximum';
      }
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const toggleMulti = (key, value) => {
    setForm((prev) => {
      const set = new Set(prev[key]);
      if (set.has(value)) {
        set.delete(value);
      } else {
        set.add(value);
      }
      return { ...prev, [key]: Array.from(set) };
    });
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setErrors({});
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    if (!validateStep(activeStep)) return;
    const payload = {
      academics: {
        gpa: Number(form.gpa),
        scale: form.scale,
        tests: {
          ielts: form.tests.ielts ? Number(form.tests.ielts) : null,
          toefl: form.tests.toefl ? Number(form.tests.toefl) : null,
          sat: form.tests.sat ? Number(form.tests.sat) : null,
        },
      },
      preferences: {
        fields: form.fields,
        countries: form.countries,
        languages: form.languages,
        budgetMin: Number(form.budgetMin),
        budgetMax: Number(form.budgetMax),
      },
    };
    completeOnboarding(payload);
    navigate('/search', { state: { toastMessage: 'Profile saved! Recommendations updated.' } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-100 py-28">
      <Container className="max-w-4xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
          <div className="mb-6 flex items-center justify-between text-sm text-slate-500">
            <span className="font-medium text-brand-600">Step {activeStep + 1} of {steps.length}</span>
            <span>Tell us about your journey</span>
          </div>
          <div className="mb-10 flex items-center gap-4">
            {steps.map((step, index) => (
              <div key={step.key} className="flex items-center gap-2">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold ${
                    index === activeStep
                      ? 'border-brand-500 bg-brand-500 text-white'
                      : index < activeStep
                      ? 'border-brand-300 bg-brand-100 text-brand-700'
                      : 'border-slate-200 bg-slate-50 text-slate-400'
                  }`}
                >
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-slate-600">{step.title}</span>
                {index < steps.length - 1 && <div className="h-px w-12 bg-slate-200" aria-hidden="true" />}
              </div>
            ))}
          </div>

          {activeStep === 0 && (
            <section className="space-y-6">
              <div>
                <label htmlFor="gpa" className="text-sm font-semibold text-slate-700">
                  Current GPA
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    id="gpa"
                    type="number"
                    step="0.1"
                    min="0"
                    value={form.gpa}
                    onChange={(event) => setForm((prev) => ({ ...prev, gpa: event.target.value }))}
                    className="w-32 rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300/60"
                    aria-describedby="gpa-help"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        scale: prev.scale === '4.0' ? '10.0' : '4.0',
                      }))
                    }
                    className="rounded-full border border-brand-200 px-4 py-2 text-xs font-semibold text-brand-600"
                  >
                    Scale {form.scale}
                  </button>
                </div>
                <p id="gpa-help" className="mt-1 text-xs text-slate-400">
                  Toggle between 4.0 and 10.0 scales to match your transcript.
                </p>
                {errors.gpa && <p className="mt-1 text-xs text-rose-500">{errors.gpa}</p>}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {['ielts', 'toefl', 'sat'].map((test) => (
                  <div key={test}>
                    <label className="text-sm font-semibold text-slate-700" htmlFor={test}>
                      {test.toUpperCase()}
                    </label>
                    <input
                      id={test}
                      type="number"
                      value={form.tests[test]}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          tests: { ...prev.tests, [test]: event.target.value },
                        }))
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300/60"
                      placeholder="Optional"
                    />
                    {errors[test] && <p className="mt-1 text-xs text-rose-500">{errors[test]}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeStep === 1 && (
            <section className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-slate-700">Preferred fields</p>
                <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3">
                  {uniqueFields.map((field) => (
                    <label key={field} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
                      <input
                        type="checkbox"
                        checked={form.fields.includes(field)}
                        onChange={() => toggleMulti('fields', field)}
                        className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-400"
                      />
                      {field}
                    </label>
                  ))}
                </div>
                {errors.fields && <p className="mt-2 text-xs text-rose-500">{errors.fields}</p>}
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700">Countries of interest</p>
                <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
                  {uniqueCountries.map((country) => (
                    <label key={country} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
                      <input
                        type="checkbox"
                        checked={form.countries.includes(country)}
                        onChange={() => toggleMulti('countries', country)}
                        className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-400"
                      />
                      {country}
                    </label>
                  ))}
                </div>
                {errors.countries && <p className="mt-2 text-xs text-rose-500">{errors.countries}</p>}
              </div>
            </section>
          )}

          {activeStep === 2 && (
            <section className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-slate-700">Languages</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {uniqueLanguages.map((language) => (
                    <label key={language} className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                      <input
                        type="checkbox"
                        checked={form.languages.includes(language)}
                        onChange={() => toggleMulti('languages', language)}
                        className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-400"
                      />
                      {language}
                    </label>
                  ))}
                </div>
                {errors.languages && <p className="mt-2 text-xs text-rose-500">{errors.languages}</p>}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="budgetMin" className="text-sm font-semibold text-slate-700">
                    Budget minimum (€)
                  </label>
                  <input
                    id="budgetMin"
                    type="number"
                    value={form.budgetMin}
                    onChange={(event) => setForm((prev) => ({ ...prev, budgetMin: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300/60"
                  />
                </div>
                <div>
                  <label htmlFor="budgetMax" className="text-sm font-semibold text-slate-700">
                    Budget maximum (€)
                  </label>
                  <input
                    id="budgetMax"
                    type="number"
                    value={form.budgetMax}
                    onChange={(event) => setForm((prev) => ({ ...prev, budgetMax: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300/60"
                  />
                </div>
              </div>
              {errors.budget && <p className="text-xs text-rose-500">{errors.budget}</p>}

              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
                <p>Residency status: EU citizen</p>
                <p className="mt-1">We tailor tuition expectations and deadlines based on EU requirements.</p>
              </div>
            </section>
          )}

          <div className="mt-10 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={activeStep === 0}
              className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-400 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>
            {activeStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
              >
                Next step
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
              >
                Finish onboarding
              </button>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProfileOnboarding;
