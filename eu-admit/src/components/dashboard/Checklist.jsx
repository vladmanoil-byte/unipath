// Checklist.jsx
// Renders application tasks with completion toggles, inline editing, and add/remove controls.
import { useMemo, useState } from 'react';

const defaultDraft = { label: '', dueDate: '' };

const Checklist = ({ tasks, onToggle, onAdd, onEdit, onRemove }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(defaultDraft);

  const sortedTasks = useMemo(
    () =>
      [...tasks].sort((a, b) => {
        if (a.done === b.done) return 0;
        return a.done ? 1 : -1;
      }),
    [tasks],
  );

  const resetDraft = () => {
    setDraft(defaultDraft);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!draft.label.trim()) return;

    const payload = {
      label: draft.label.trim(),
      dueDate: draft.dueDate ? draft.dueDate : null,
    };

    if (editingId) {
      onEdit?.(editingId, payload);
    } else {
      onAdd?.(payload);
    }

    resetDraft();
  };

  const startAdd = () => {
    setDraft(defaultDraft);
    setIsAdding(true);
    setEditingId(null);
  };

  const startEdit = (task) => {
    setDraft({
      label: task.label,
      dueDate: task.dueDate ?? '',
    });
    setEditingId(task.id);
    setIsAdding(false);
  };

  const actionLabel = editingId ? 'Cancel edit' : isAdding ? 'Cancel' : 'Add task';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Task management</p>
        <button
          type="button"
          onClick={() => {
            if (editingId) {
              resetDraft();
            } else if (isAdding) {
              resetDraft();
            } else {
              startAdd();
            }
          }}
          className="rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-semibold text-brand-600 transition hover:border-brand-400 hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
        >
          {actionLabel}
        </button>
      </div>

      {(isAdding || editingId) && (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
        >
          <div>
            <label htmlFor="task-label" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Task label
            </label>
            <input
              id="task-label"
              type="text"
              value={draft.label}
              onChange={(event) => setDraft((prev) => ({ ...prev, label: event.target.value }))}
              placeholder="e.g. Upload transcripts"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40"
              required
            />
          </div>
          <div>
            <label htmlFor="task-due" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Due date (optional)
            </label>
            <input
              id="task-due"
              type="date"
              value={draft.dueDate ?? ''}
              onChange={(event) => setDraft((prev) => ({ ...prev, dueDate: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={resetDraft}
              className="rounded-full px-3 py-1 text-sm font-medium text-slate-500 hover:bg-slate-200/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-brand-500 px-4 py-1.5 text-sm font-semibold text-white shadow hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
            >
              {editingId ? 'Save changes' : 'Add task'}
            </button>
          </div>
        </form>
      )}

      <ul className="space-y-3">
        {sortedTasks.map((task) => {
          const isOverdue = task.dueDate && !task.done && new Date(task.dueDate) < new Date();
          const isEditing = editingId === task.id;
          return (
            <li
              key={task.id}
              className={`flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm transition ${
                isOverdue ? 'border-l-4 border-rose-400 pl-[15px]' : ''
              } ${isEditing ? 'ring-2 ring-brand-300' : ''}`}
            >
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => onToggle?.(task.id)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-400"
                aria-label={`Mark ${task.label} as ${task.done ? 'incomplete' : 'complete'}`}
              />
              <div className={`flex-1 ${task.done ? 'text-slate-400 line-through' : ''}`}>
                <p className="font-medium text-slate-700">{task.label}</p>
                {task.dueDate && (
                  <p className="text-xs text-slate-400">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                )}
                {isOverdue && <p className="text-xs font-semibold text-rose-500">Overdue</p>}
              </div>
              <div className="flex items-center gap-2 self-start">
                <button
                  type="button"
                  onClick={() => startEdit(task)}
                  className="rounded-full px-2 py-1 text-xs font-semibold text-brand-600 hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (editingId === task.id) {
                      resetDraft();
                    }
                    onRemove?.(task.id);
                  }}
                  className="rounded-full px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
        {sortedTasks.length === 0 && (
          <li className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            No tasks yet. Add your first requirement to get started.
          </li>
        )}
      </ul>
    </div>
  );
};

export default Checklist;
