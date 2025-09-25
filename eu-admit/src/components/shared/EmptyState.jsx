// EmptyState.jsx
// Provides a friendly empty placeholder with icon, description, and optional call-to-action button.
const EmptyState = ({
  icon = '🎓',
  title,
  subtitle,
  actionLabel,
  onAction,
}) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
    <div className="mb-4 text-4xl" aria-hidden="true">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
    {subtitle && <p className="mt-2 max-w-sm text-sm text-slate-500">{subtitle}</p>}
    {actionLabel && (
      <button
        type="button"
        onClick={onAction}
        className="mt-6 inline-flex items-center rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
