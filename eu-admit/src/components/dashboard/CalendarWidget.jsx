// CalendarWidget.jsx
// Month view calendar that highlights event days with severity dots and lists deadlines on selection.
import { useMemo, useState } from 'react';

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const severityMap = {
  high: 'bg-rose-500',
  medium: 'bg-amber-400',
  low: 'bg-slate-400',
};

const CalendarWidget = ({ events = [] }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(null);

  const eventMap = useMemo(() => {
    const map = new Map();
    events.forEach((event) => {
      if (!map.has(event.date)) {
        map.set(event.date, []);
      }
      map.get(event.date).push(event);
    });
    return map;
  }, [events]);

  const daysInCalendar = useMemo(() => {
    const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startWeekday = (start.getDay() + 6) % 7; // convert Sunday=0 to Monday=0
    const days = [];

    for (let i = 0; i < startWeekday; i += 1) {
      days.push(null);
    }
    for (let day = 1; day <= end.getDate(); day += 1) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    }

    while (days.length % 7 !== 0) {
      days.push(null);
    }

    return days;
  }, [currentMonth]);

  const monthLabel = currentMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const selectedEvents = selectedDate ? eventMap.get(selectedDate.toISOString().slice(0, 10)) ?? [] : [];

  const changeMonth = (offset) => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    setSelectedDate(null);
  };

  const getSeverity = (date) => {
    const iso = date.toISOString().slice(0, 10);
    const eventForDay = eventMap.get(iso);
    if (!eventForDay) return null;
    if (eventForDay.some((item) => item.severity === 'high')) return 'high';
    if (eventForDay.some((item) => item.severity === 'medium')) return 'medium';
    return 'low';
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-500 hover:bg-slate-200"
          aria-label="Previous month"
        >
          ←
        </button>
        <div className="text-sm font-semibold text-slate-700">{monthLabel}</div>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-500 hover:bg-slate-200"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
        {dayNames.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2 text-sm">
        {daysInCalendar.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="h-10 rounded-xl bg-transparent" aria-hidden />;
          }
          const iso = date.toISOString().slice(0, 10);
          const severity = getSeverity(date);
          const isToday = iso === today.toISOString().slice(0, 10);
          const isSelected = selectedDate && iso === selectedDate.toISOString().slice(0, 10);
          return (
            <button
              key={iso}
              type="button"
              onClick={() => setSelectedDate(date)}
              className={`relative flex h-10 flex-col items-center justify-center rounded-xl border transition ${
                isSelected
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-brand-400 hover:text-brand-600'
              }`}
            >
              <span className={`text-xs font-medium ${isToday ? 'text-brand-600' : ''}`}>{date.getDate()}</span>
              {severity && (
                <span className={`mt-1 h-1.5 w-1.5 rounded-full ${severityMap[severity]}`} aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <h3 className="text-sm font-semibold text-slate-800">{selectedDate ? selectedDate.toLocaleDateString() : 'Select a date'}</h3>
        {selectedEvents.length === 0 ? (
          <p className="mt-2 text-xs text-slate-400">No deadlines for this date.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {selectedEvents.map((event) => (
              <li key={event.id ?? `${event.date}-${event.label}`} className="rounded-xl bg-white px-3 py-2 shadow-sm">
                <p className="text-sm font-medium text-slate-700">{event.label}</p>
                <p className="text-xs text-slate-400">{event.severity === 'high' ? 'Urgent' : event.severity === 'medium' ? 'Upcoming' : 'Reminder'}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CalendarWidget;
