// ApplicationCard.jsx
// Displays a single application summary with status chip, progress indicator, and next deadline badge.
import Badge from '../shared/Badge.jsx';

const statusConfig = {
  in_progress: { label: 'In progress', tone: 'blue' },
  submitted: { label: 'Submitted', tone: 'green' },
  accepted: { label: 'Accepted', tone: 'green' },
  rejected: { label: 'Rejected', tone: 'gray' },
};

const ApplicationCard = ({ application, university, onOpen }) => {
  const totalTasks = application.tasks.length;
  const completedTasks = application.tasks.filter((task) => task.done).length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const status = statusConfig[application.status] ?? statusConfig.in_progress;

  const deadlineDate = application.nextDeadlineDate
    ? new Date(application.nextDeadlineDate).toLocaleDateString()
    : 'TBC';

  return (
    <article className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src={university.logo} alt="" className="h-12 w-12 rounded-xl border border-slate-100 bg-white object-cover" />
          <div>
            <h3 className="text-base font-semibold text-slate-800">{university.name}</h3>
            <p className="text-xs text-slate-500">
              {university.city}, {university.country}
            </p>
          </div>
        </div>
        <Badge tone={status.tone}>{status.label}</Badge>
      </div>

      <div className="mt-6 space-y-3 text-sm text-slate-600">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Progress</p>
          <div className="mt-2 h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-brand-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {totalTasks > 0
              ? `${completedTasks}/${totalTasks} tasks completed`
              : 'No tasks added yet'}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Next deadline</span>
          <Badge tone="orange">{deadlineDate}</Badge>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpen(application.id)}
        className="mt-6 inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-400 hover:text-brand-600"
      >
        View checklist
      </button>
    </article>
  );
};

export default ApplicationCard;
