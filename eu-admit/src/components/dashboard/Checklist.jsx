// Checklist.jsx
// Renders application tasks with completion toggles and overdue styling.
const Checklist = ({ tasks, onToggle }) => (
  <ul className="space-y-3">
    {tasks.map((task) => {
      const isOverdue = task.dueDate && !task.done && new Date(task.dueDate) < new Date();
      return (
        <li
          key={task.id}
          className={`flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm ${
            isOverdue ? 'border-l-4 border-rose-400 pl-[15px]' : ''
          }`}
        >
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => onToggle(task.id)}
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
        </li>
      );
    })}
  </ul>
);

export default Checklist;
