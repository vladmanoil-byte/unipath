// Wizard.jsx
// Implements the four-step onboarding wizard that collects profile data, recommends universities, and persists progress.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/layout/Container.jsx';
import StepAcademics from '../components/wizard/StepAcademics.jsx';
import StepPreferences from '../components/wizard/StepPreferences.jsx';
import StepRecommendations from '../components/wizard/StepRecommendations.jsx';
import StepReview from '../components/wizard/StepReview.jsx';
import WizardStepper from '../components/wizard/WizardStepper.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import { clearWizardDraft, loadWizardDraft, saveWizardDraft } from '../lib/storage.js';

const steps = ['Academics', 'Preferences', 'Recommendations', 'Review'];

const defaultState = {
  academics: {
    scale: '4.0',
    gpa: '',
    tests: { ielts: '', toefl: '', sat: '' },
  },
  preferences: {
    countries: [],
    fields: [],
    languages: [],
    budgetMin: '',
    budgetMax: '',
  },
  shortlistIds: [],
};

const mergeWizardState = (stored) => ({
  academics: {
    scale: stored?.academics?.scale ?? defaultState.academics.scale,
    gpa: stored?.academics?.gpa ?? defaultState.academics.gpa,
    tests: {
      ielts: stored?.academics?.tests?.ielts ?? defaultState.academics.tests.ielts,
      toefl: stored?.academics?.tests?.toefl ?? defaultState.academics.tests.toefl,
      sat: stored?.academics?.tests?.sat ?? defaultState.academics.tests.sat,
    },
  },
  preferences: {
    countries: Array.isArray(stored?.preferences?.countries)
      ? stored.preferences.countries
      : [...defaultState.preferences.countries],
    fields: Array.isArray(stored?.preferences?.fields)
      ? stored.preferences.fields
      : [...defaultState.preferences.fields],
    languages: Array.isArray(stored?.preferences?.languages)
      ? stored.preferences.languages
      : [...defaultState.preferences.languages],
    budgetMin:
      stored?.preferences?.budgetMin !== undefined
        ? stored.preferences.budgetMin
        : defaultState.preferences.budgetMin,
    budgetMax:
      stored?.preferences?.budgetMax !== undefined
        ? stored.preferences.budgetMax
        : defaultState.preferences.budgetMax,
  },
  shortlistIds: Array.isArray(stored?.shortlistIds) ? stored.shortlistIds : [],
});

const sanitizeStepIndex = (index) => {
  if (Number.isInteger(index)) {
    return Math.min(Math.max(index, 0), steps.length - 1);
  }
  return 0;
};

const Wizard = () => {
  const navigate = useNavigate();
  const headingRef = useRef(null);
  const { universities, completeOnboarding, addApplicationDraft } = useAppContext();

  const [wizardState, setWizardState] = useState(defaultState);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [reviewError, setReviewError] = useState('');
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const draft = loadWizardDraft();
    if (draft?.state) {
      setWizardState(mergeWizardState(draft.state));
      setCurrentStep(sanitizeStepIndex(draft.stepIndex));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveWizardDraft({ state: wizardState, stepIndex: currentStep });
  }, [wizardState, currentStep, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    setLoadingRecommendations(true);
    const timeout = setTimeout(() => setLoadingRecommendations(false), 350);
    return () => clearTimeout(timeout);
  }, [wizardState.preferences, hydrated]);

  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, [currentStep]);

  const preferenceOptions = useMemo(() => {
    const countrySet = new Set();
    const fieldSet = new Set();
    const languageSet = new Set();

    universities.forEach((university) => {
      if (university.country) countrySet.add(university.country);
      (university.fields ?? []).forEach((field) => fieldSet.add(field));
      const languageSource =
        Array.isArray(university.languages) && university.languages.length > 0
          ? university.languages
          : [university.language].filter(Boolean);
      languageSource.forEach((language) => languageSet.add(language));
    });

    return {
      countries: Array.from(countrySet).sort(),
      fields: Array.from(fieldSet).sort(),
      languages: Array.from(languageSet).sort(),
    };
  }, [universities]);

  const recommendations = useMemo(() => {
    const pref = wizardState.preferences;
    const minBudget = Number(pref.budgetMin);
    const maxBudget = Number(pref.budgetMax);

    const baseList = universities
      .map((university) => {
        let score = 0;
        if (pref.countries.includes(university.country)) score += 3;
        if ((university.fields ?? []).some((field) => pref.fields.includes(field))) score += 2;
        const uniLanguages =
          Array.isArray(university.languages) && university.languages.length > 0
            ? university.languages
            : [university.language].filter(Boolean);
        if (uniLanguages.some((language) => pref.languages.includes(language))) score += 2;

        const tuition = university.tuitionEUR;
        if (tuition && !Number.isNaN(minBudget) && !Number.isNaN(maxBudget) && pref.budgetMin !== '' && pref.budgetMax !== '') {
          const within = tuition.max >= minBudget && tuition.min <= maxBudget;
          if (within) {
            score += 1.5;
            if (tuition.max <= maxBudget) score += 0.5;
          }
        }

        const ranking = typeof university.ranking === 'number' ? university.ranking : 200;
        const rankingBonus = Math.max(0, 200 - ranking) / 200;
        score += rankingBonus;

        return { university, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);

    const additionalSelected = wizardState.shortlistIds
      .map((id) => universities.find((uni) => uni.id === id))
      .filter((uni) => uni && !baseList.some((item) => item.university.id === uni.id))
      .map((uni) => ({ university: uni, score: 0 }));

    return [...baseList, ...additionalSelected];
  }, [universities, wizardState.preferences, wizardState.shortlistIds]);

  const shortlistUniversities = useMemo(
    () =>
      wizardState.shortlistIds
        .map((id) => universities.find((uni) => uni.id === id))
        .filter((university) => Boolean(university)),
    [universities, wizardState.shortlistIds],
  );

  const progress = ((currentStep + 1) / steps.length) * 100;

  const updateAcademics = (updates) => {
    setWizardState((prev) => ({
      ...prev,
      academics: {
        ...prev.academics,
        ...updates,
      },
    }));
  };

  const updateAcademicTest = (testKey, value) => {
    setWizardState((prev) => ({
      ...prev,
      academics: {
        ...prev.academics,
        tests: {
          ...prev.academics.tests,
          [testKey]: value,
        },
      },
    }));
  };

  const updatePreferences = (updates) => {
    setWizardState((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...updates,
      },
    }));
  };

  const togglePreferenceOption = (key, option) => {
    setWizardState((prev) => {
      const existing = prev.preferences[key] ?? [];
      const hasOption = existing.includes(option);
      const nextList = hasOption ? existing.filter((value) => value !== option) : [...existing, option];
      return {
        ...prev,
        preferences: {
          ...prev.preferences,
          [key]: nextList,
        },
      };
    });
  };

  const toggleShortlist = (id, checked) => {
    setWizardState((prev) => {
      const existing = prev.shortlistIds;
      if (checked && !existing.includes(id)) {
        return { ...prev, shortlistIds: [...existing, id] };
      }
      if (!checked) {
        return { ...prev, shortlistIds: existing.filter((item) => item !== id) };
      }
      return prev;
    });
  };

  const selectAllShortlist = () => {
    setWizardState((prev) => ({
      ...prev,
      shortlistIds: recommendations.map((item) => item.university.id),
    }));
  };

  const clearShortlist = () => {
    setWizardState((prev) => ({ ...prev, shortlistIds: [] }));
  };

  const removeFromShortlist = (id) => {
    setWizardState((prev) => ({
      ...prev,
      shortlistIds: prev.shortlistIds.filter((item) => item !== id),
    }));
  };

  const validateStep = (stepIndex, state) => {
    if (stepIndex === 0) {
      const stepErrors = {};
      const testsErrors = {};
      const gpaValue = Number(state.academics.gpa);
      const max = state.academics.scale === '10' ? 10 : 4;
      if (state.academics.gpa === '') {
        stepErrors.gpa = 'Enter your GPA.';
      } else if (Number.isNaN(gpaValue)) {
        stepErrors.gpa = 'Provide a numeric GPA.';
      } else if (gpaValue < 0 || gpaValue > max) {
        stepErrors.gpa = `GPA must be between 0 and ${max}.`;
      }

      const testRanges = {
        ielts: { min: 0, max: 9 },
        toefl: { min: 0, max: 120 },
        sat: { min: 400, max: 1600 },
      };

      Object.entries(testRanges).forEach(([key, range]) => {
        const raw = state.academics.tests?.[key];
        const value = Number(raw);
        if (raw === '' || raw === undefined || raw === null) {
          testsErrors[key] = 'Required.';
        } else if (Number.isNaN(value)) {
          testsErrors[key] = 'Enter a number.';
        } else if (value < range.min || value > range.max) {
          testsErrors[key] = `Must be between ${range.min} and ${range.max}.`;
        }
      });

      if (Object.keys(testsErrors).length > 0) {
        stepErrors.tests = testsErrors;
      }

      return Object.keys(stepErrors).length > 0 ? stepErrors : null;
    }

    if (stepIndex === 1) {
      const stepErrors = {};
      if (!state.preferences.countries || state.preferences.countries.length === 0) {
        stepErrors.countries = 'Choose at least one country.';
      }
      if (!state.preferences.fields || state.preferences.fields.length === 0) {
        stepErrors.fields = 'Choose at least one field.';
      }
      if (!state.preferences.languages || state.preferences.languages.length === 0) {
        stepErrors.languages = 'Choose at least one language.';
      }

      const minRaw = state.preferences.budgetMin;
      const maxRaw = state.preferences.budgetMax;
      const min = Number(minRaw);
      const max = Number(maxRaw);

      if (minRaw === '' || maxRaw === '') {
        stepErrors.budget = 'Enter both a minimum and maximum budget.';
      } else if (Number.isNaN(min) || Number.isNaN(max)) {
        stepErrors.budget = 'Budget must be numeric values.';
      } else if (min < 0 || max < 0 || min > max) {
        stepErrors.budget = 'Ensure the minimum is less than the maximum and both are non-negative.';
      }

      return Object.keys(stepErrors).length > 0 ? stepErrors : null;
    }

    if (stepIndex === 2) {
      if (state.shortlistIds.length < 5 || state.shortlistIds.length > 8) {
        return {
          shortlist: 'Pick between 5 and 8 universities to continue.',
        };
      }
      return null;
    }

    return null;
  };

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      handleConfirm();
      return;
    }

    const stepErrors = validateStep(currentStep, wizardState);
    if (stepErrors) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});
    setReviewError('');
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setErrors({});
    setReviewError('');
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleConfirm = () => {
    const shortlistValidation = validateStep(2, wizardState);
    if (shortlistValidation) {
      setReviewError(shortlistValidation.shortlist);
      return;
    }

    setReviewError('');

    const gpaValue = Number(wizardState.academics.gpa);
    const profilePayload = {
      academics: {
        gpa: Number.isNaN(gpaValue) ? null : gpaValue,
        scale: wizardState.academics.scale,
        tests: {
          ielts: Number(wizardState.academics.tests.ielts),
          toefl: Number(wizardState.academics.tests.toefl),
          sat: Number(wizardState.academics.tests.sat),
        },
      },
      preferences: {
        countries: wizardState.preferences.countries,
        fields: wizardState.preferences.fields,
        languages: wizardState.preferences.languages,
        budgetMin: Number(wizardState.preferences.budgetMin),
        budgetMax: Number(wizardState.preferences.budgetMax),
      },
    };

    completeOnboarding(profilePayload);
    wizardState.shortlistIds.forEach((id) => addApplicationDraft(id));
    clearWizardDraft();

    navigate('/dashboard', {
      replace: true,
      state: { toast: 'Profile saved & shortlist created' },
    });
  };

  const handleSaveExit = () => {
    saveWizardDraft({ state: wizardState, stepIndex: currentStep });
    navigate('/');
  };

  return (
    <main className="bg-slate-50 py-16">
      <Container className="max-w-4xl space-y-10">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="text-3xl font-semibold text-slate-900 focus:outline-none"
            >
              Guided profile setup
            </h1>
            <p className="text-sm text-slate-500">
              Complete the steps below to personalise your dashboard and start planning applications.
            </p>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-brand-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <WizardStepper steps={steps} currentStep={currentStep} />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          {currentStep === 0 && (
            <StepAcademics
              value={wizardState.academics}
              onChange={updateAcademics}
              onTestChange={updateAcademicTest}
              errors={errors}
            />
          )}

          {currentStep === 1 && (
            <StepPreferences
              value={wizardState.preferences}
              onChange={updatePreferences}
              onToggle={togglePreferenceOption}
              options={preferenceOptions}
              errors={errors}
            />
          )}

          {currentStep === 2 && (
            <StepRecommendations
              recommendations={recommendations}
              shortlistedIds={wizardState.shortlistIds}
              onToggle={toggleShortlist}
              onSelectAll={selectAllShortlist}
              onClear={clearShortlist}
              loading={loadingRecommendations}
              errors={errors}
            />
          )}

          {currentStep === 3 && (
            <StepReview
              academics={wizardState.academics}
              preferences={wizardState.preferences}
              shortlist={shortlistUniversities}
              onRemove={removeFromShortlist}
              confirmDisabled={wizardState.shortlistIds.length < 5 || wizardState.shortlistIds.length > 8}
              reviewError={reviewError}
            />
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            Back
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSaveExit}
              className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              Save & exit
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={currentStep === 3 && (wizardState.shortlistIds.length < 5 || wizardState.shortlistIds.length > 8)}
            >
              {currentStep === steps.length - 1 ? 'Confirm' : 'Next'}
            </button>
          </div>
        </div>
      </Container>
    </main>
  );
};

export default Wizard;
