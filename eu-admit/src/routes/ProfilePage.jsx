// ProfilePage.jsx
// Displays saved academic profile, allows lightweight edits, and surfaces fit insights with a resume preview modal.
import { useMemo, useState } from 'react';
import Container from '../components/layout/Container.jsx';
import Badge from '../components/shared/Badge.jsx';
import { useAppContext } from '../context/AppContext.jsx';

const ProfilePage = () => {
  const { profile, saveProfile } = useAppContext();
  const [editingSection, setEditingSection] = useState(null);
  const [draftAcademics, setDraftAcademics] = useState(() => ({
    ...profile.academics,
    tests: { ...profile.academics?.tests },
  }));
  const [draftPreferences, setDraftPreferences] = useState(() => ({ ...profile.preferences }));
  const [showResumeModal, setShowResumeModal] = useState(false);

  const insights = useMemo(() => {
    const pills = [];
    if (profile.preferences?.budgetMax <= 6000) {
      pills.push('Budget < €6k/year → prioritise DE & ES public options');
    }
    if (profile.academics?.tests?.ielts && profile.academics.tests.ielts < 6.5) {
      pills.push('IELTS below 6.5 → limited NL & SE English programs');
    }
    if (profile.preferences?.languages?.includes('German')) {
      pills.push('German proficiency opens DACH study tracks');
    }
    if ((profile.preferences?.countries?.length ?? 0) > 3) {
      pills.push('Broad country mix → filter by deadlines to stay focused');
    }
    if (pills.length === 0) {
      pills.push('Complete onboarding for tailored insights');
    }
    return pills;
  }, [profile]);

  const handleSave = (section) => {
    if (section === 'academics') {
      saveProfile({ academics: draftAcademics });
    }
    if (section === 'preferences') {
      saveProfile({ preferences: draftPreferences });
    }
    setEditingSection(null);
  };

  return (
    <Container className="space-y-8">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
          <p className="text-sm text-slate-500">Update academics and preferences to fine-tune recommendations.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={profile.completedOnboarding ? 'green' : 'red'}>
            {profile.completedOnboarding ? 'Onboarding complete' : 'Complete onboarding'}
          </Badge>
          <button
            type="button"
            onClick={() => setShowResumeModal(true)}
            className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            Export resume preview
          </button>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Academics</h2>
            {editingSection === 'academics' ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSave('academics')}
                  className="rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setDraftAcademics({ ...profile.academics, tests: { ...profile.academics?.tests } });
                  setEditingSection('academics');
                }}
                className="text-xs font-semibold text-brand-600"
              >
                Edit
              </button>
            )}
          </div>
          {editingSection === 'academics' ? (
            <div className="mt-4 space-y-4 text-sm">
              <div>
                <label htmlFor="profile-gpa" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  GPA ({draftAcademics.scale})
                </label>
                <input
                  id="profile-gpa"
                  type="number"
                  value={draftAcademics.gpa}
                  onChange={(event) =>
                    setDraftAcademics((prev) => ({ ...prev, gpa: Number(event.target.value) }))
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300/60"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['ielts', 'toefl', 'sat'].map((test) => (
                  <div key={test}>
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">{test.toUpperCase()}</label>
                    <input
                      type="number"
                      value={draftAcademics.tests?.[test] ?? ''}
                      onChange={(event) =>
                        setDraftAcademics((prev) => ({
                          ...prev,
                          tests: { ...prev.tests, [test]: Number(event.target.value) || '' },
                        }))
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300/60"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>
                GPA: <span className="font-semibold text-slate-800">{profile.academics?.gpa}</span> /{' '}
                {profile.academics?.scale}
              </p>
              <div className="flex flex-wrap gap-3 text-xs">
                <Badge tone="gray">IELTS {profile.academics?.tests?.ielts ?? '—'}</Badge>
                <Badge tone="gray">TOEFL {profile.academics?.tests?.toefl ?? '—'}</Badge>
                <Badge tone="gray">SAT {profile.academics?.tests?.sat ?? '—'}</Badge>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Preferences</h2>
            {editingSection === 'preferences' ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSave('preferences')}
                  className="rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setDraftPreferences({ ...profile.preferences });
                  setEditingSection('preferences');
                }}
                className="text-xs font-semibold text-brand-600"
              >
                Edit
              </button>
            )}
          </div>
          {editingSection === 'preferences' ? (
            <div className="mt-4 space-y-4 text-sm">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Countries</label>
                <textarea
                  value={draftPreferences.countries?.join(', ') ?? ''}
                  onChange={(event) =>
                    setDraftPreferences((prev) => ({
                      ...prev,
                      countries: event.target.value.split(',').map((country) => country.trim()).filter(Boolean),
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300/60"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Fields</label>
                <textarea
                  value={draftPreferences.fields?.join(', ') ?? ''}
                  onChange={(event) =>
                    setDraftPreferences((prev) => ({
                      ...prev,
                      fields: event.target.value.split(',').map((field) => field.trim()).filter(Boolean),
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300/60"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Budget min</label>
                  <input
                    type="number"
                    value={draftPreferences.budgetMin ?? ''}
                    onChange={(event) =>
                      setDraftPreferences((prev) => ({ ...prev, budgetMin: Number(event.target.value) }))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300/60"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Budget max</label>
                  <input
                    type="number"
                    value={draftPreferences.budgetMax ?? ''}
                    onChange={(event) =>
                      setDraftPreferences((prev) => ({ ...prev, budgetMax: Number(event.target.value) }))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300/60"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Languages</label>
                <input
                  type="text"
                  value={draftPreferences.languages?.join(', ') ?? ''}
                  onChange={(event) =>
                    setDraftPreferences((prev) => ({
                      ...prev,
                      languages: event.target.value.split(',').map((lang) => lang.trim()).filter(Boolean),
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300/60"
                />
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>Countries: {profile.preferences?.countries?.join(', ') || '—'}</p>
              <p>Fields: {profile.preferences?.fields?.join(', ') || '—'}</p>
              <p>Languages: {profile.preferences?.languages?.join(', ') || '—'}</p>
              <p>
                Budget range: €{profile.preferences?.budgetMin?.toLocaleString() ?? '—'} – €
                {profile.preferences?.budgetMax?.toLocaleString() ?? '—'}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="text-lg font-semibold text-slate-800">Fit insights</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {insights.map((insight) => (
            <span key={insight} className="rounded-full bg-brand-100 px-4 py-2 text-xs font-semibold text-brand-700">
              {insight}
            </span>
          ))}
        </div>
      </section>

      {showResumeModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Resume preview</h3>
              <button
                type="button"
                onClick={() => setShowResumeModal(false)}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-500 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div>
                <h4 className="text-base font-semibold text-slate-800">Academic summary</h4>
                <p>
                  GPA {profile.academics?.gpa} / {profile.academics?.scale} • Tests: IELTS {profile.academics?.tests?.ielts ?? '—'},
                  TOEFL {profile.academics?.tests?.toefl ?? '—'}, SAT {profile.academics?.tests?.sat ?? '—'}
                </p>
              </div>
              <div>
                <h4 className="text-base font-semibold text-slate-800">Preferences</h4>
                <p>
                  Fields: {profile.preferences?.fields?.join(', ') || '—'}
                </p>
                <p>
                  Countries: {profile.preferences?.countries?.join(', ') || '—'}
                </p>
                <p>
                  Budget: €{profile.preferences?.budgetMin?.toLocaleString() ?? '—'} – €
                  {profile.preferences?.budgetMax?.toLocaleString() ?? '—'}
                </p>
              </div>
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
                <p>Exporting will soon generate a polished PDF with your achievements and preferences.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default ProfilePage;
