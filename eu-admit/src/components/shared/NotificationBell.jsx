// NotificationBell.jsx
// Renders a bell icon with an interactive dropdown for mock reminders that can be dismissed individually.
import { useEffect, useMemo, useState } from 'react';

const BellIcon = ({ className = 'h-6 w-6' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={className}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14 21a2 2 0 1 1-4 0m8-6V11a6 6 0 0 0-5-5.91V4a1 1 0 0 0-2 0v1.09A6 6 0 0 0 6 11v4l-1.67 2.5A1 1 0 0 0 5.2 19h13.6a1 1 0 0 0 .87-1.5z"
    />
  </svg>
);

const NotificationBell = ({ items = [] }) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(items);

  useEffect(() => {
    setNotifications(items);
  }, [items]);

  const unseenCount = useMemo(() => notifications.length, [notifications]);

  const handleDismiss = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative inline-flex items-center rounded-full bg-white/70 px-3 py-2 text-slate-600 shadow-sm transition hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        aria-label={open ? 'Close notifications' : 'Open notifications'}
      >
        <BellIcon />
        {unseenCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-1 text-xs font-semibold text-white">
            {unseenCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-3 w-80 max-w-sm rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
          <div className="flex items-center justify-between pb-2">
            <p className="text-sm font-semibold text-slate-800">Reminders</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-xs text-slate-400 transition hover:text-slate-600"
            >
              Close
            </button>
          </div>
          {notifications.length === 0 ? (
            <p className="py-3 text-sm text-slate-500">You’re all caught up! 🎉</p>
          ) : (
            <ul className="space-y-3">
              {notifications.map((item) => (
                <li key={item.id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-800">{item.text}</p>
                      <p className="text-xs text-slate-500">{item.timeAgo}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDismiss(item.id)}
                      className="rounded-full p-1 text-slate-400 transition hover:bg-white hover:text-rose-500"
                      aria-label="Dismiss notification"
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
