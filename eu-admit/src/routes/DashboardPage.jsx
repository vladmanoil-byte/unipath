// DashboardPage.jsx
// Application tracking hub with KPI summary, cards, checklist drawer, and shared calendar.
import { useMemo, useState } from 'react';
import Container from '../components/layout/Container.jsx';
import ApplicationCard from '../components/dashboard/ApplicationCard.jsx';
import Checklist from '../components/dashboard/Checklist.jsx';
import CalendarWidget from '../components/dashboard/CalendarWidget.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';
import Badge from '../components/shared/Badge.jsx';
import { useAppContext } from '../context/AppContext.jsx';

const statusLabels = {
  in_progress: 'In progress',
  submitted: 'Submitted',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

const DashboardPage = () => {
  const { applications, universities, toggleTask, addTask, updateTask, removeTask } = useAppContext();
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [notes, setNotes] = useState({});

  const kpis = useMemo(() => {
    const grouped = { in_progress: 0, submitted: 0, accepted: 0, rejected: 0 };
    applications.forEach((application) => {
      grouped[application.status] += 1;
    });
    return grouped;
  }, [applications]);

  const selectedApplication = applications.find((app) => app.id === selectedAppId) ?? null;
  const selectedUniversity = selectedApplication
    ? universities.find((uni) => uni.id === selectedApplication.universityId)
    : null;

  const calendarEvents = useMemo(() => {
    const now = new Date();
    const events = [];
    applications.forEach((app) => {
      if (app.nextDeadlineDate) {
        const deadline = new Date(app.nextDeadlineDate);
        const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
        const severity = diffDays <= 7 ? 'high' : diffDays <= 14 ? 'medium' : 'low';
        const uni = universities.find((uni) => uni.id === app.universityId);
        events.push({
          id: `${app.id}-deadline`,
          date: app.nextDeadlineDate,
          label: `${uni?.name ?? 'University'} deadline`,
          severity,
        });
      }
      app.tasks
        .filter((task) => task.dueDate)
        .forEach((task) => {
          const due = new Date(task.dueDate);
          const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
          const severity = diffDays <= 7 ? 'high' : diffDays <= 14 ? 'medium' : 'low';
          const uni = universities.find((uni) => uni.id === app.universityId);
          events.push({
            id: `${app.id}-${task.id}`,
            date: task.dueDate,
            label: `${task.label} (${uni?.name ?? 'University'})`,
            severity,
          });
        });
    });
    return events;
  }, [applications, universities]);

  if (applications.length === 0) {
    return (
      <Container className="space-y-6">
        <h1 className="text-2xl font-semibold text-slate-900">Application dashboard</h1>
        <EmptyState
          title="No applications tracked yet"
          subtitle="Start from the search page to add universities you are interested in and monitor their deadlines."
          actionLabel="Find universities"
          onAction={() => window.history.back()}
        />
      </Container>
    );
  }

  return (
    <Container className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold text-slate-900">Application dashboard</h1>
        <p className="text-sm text-slate-500">Track every requirement and stay ahead of deadlines.</p>
      </header>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Object.entries(kpis).map(([key, value]) => (
          <div key={key} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{statusLabels[key]}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-800">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {applications.map((application) => {
              const university = universities.find((uni) => uni.id === application.universityId);
              if (!university) return null;
              return (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  university={university}
                  onOpen={setSelectedAppId}
                />
              );
            })}
          </div>
        </div>
        <CalendarWidget events={calendarEvents} />
      </section>

      {selectedApplication && selectedUniversity && (
        <div className="fixed inset-0 z-40 flex justify-end bg-slate-900/30 backdrop-blur-sm">
          <div className="flex h-full w-full max-w-lg flex-col gap-6 rounded-l-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Checklist</p>
                <h2 className="text-xl font-semibold text-slate-900">{selectedUniversity.name}</h2>
                <Badge tone="brand" className="mt-2">
                  Next deadline {selectedApplication.nextDeadlineDate
                    ? new Date(selectedApplication.nextDeadlineDate).toLocaleDateString()
                    : 'TBC'}
                </Badge>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAppId(null)}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-500 hover:bg-slate-200"
              >
                Close
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto pr-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Tasks</h3>
                <Checklist
                  tasks={selectedApplication.tasks}
                  onToggle={(taskId) => toggleTask(selectedApplication.id, taskId)}
                  onAdd={(payload) => addTask(selectedApplication.id, payload)}
                  onEdit={(taskId, payload) => updateTask(selectedApplication.id, taskId, payload)}
                  onRemove={(taskId) => removeTask(selectedApplication.id, taskId)}
                />
              </div>

              <div>
                <label htmlFor="notes" className="text-sm font-semibold text-slate-800">
                  Notes
                </label>
                <textarea
                  id="notes"
                  value={notes[selectedApplication.id] ?? ''}
                  onChange={(event) =>
                    setNotes((prev) => ({ ...prev, [selectedApplication.id]: event.target.value }))
                  }
                  placeholder="Capture reminders, contact details, or counselor feedback."
                  className="mt-2 h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
              <span>Progress updates sync instantly.</span>
              <button
                type="button"
                onClick={() => setNotes((prev) => ({ ...prev, [selectedApplication.id]: '' }))}
                className="rounded-full bg-white px-3 py-1 font-semibold text-brand-600"
              >
                Clear notes
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default DashboardPage;
