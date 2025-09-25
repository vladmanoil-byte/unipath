// NavBar.jsx
// Sticky top navigation with primary routes, a profile shortcut, and notification bell seeded from applications data.
import { Link, NavLink } from 'react-router-dom';
import { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';
import Container from './Container.jsx';
import NotificationBell from '../shared/NotificationBell.jsx';

const navLinks = [
  { to: '/search', label: 'Search' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/profile', label: 'Profile' },
];

const NavBar = () => {
  const { applications, universities } = useAppContext();

  const notificationItems = useMemo(() => {
    const now = new Date();
    const makeDaysAwayLabel = (dateString) => {
      if (!dateString) return 'Date TBC';
      const date = new Date(dateString);
      const diff = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
      if (diff <= 0) return 'Due now';
      if (diff === 1) return '1 day left';
      if (diff < 7) return `${diff} days left`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    const items = [];

    applications.forEach((app) => {
      const uni = universities.find((u) => u.id === app.universityId);
      const uniName = uni?.name ?? 'University';

      if (app.nextDeadlineDate) {
        const deadline = new Date(app.nextDeadlineDate);
        const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 45) {
          items.push({
            id: `${app.id}-deadline`,
            text: `${uniName} application deadline approaching`,
            timeAgo: makeDaysAwayLabel(app.nextDeadlineDate),
          });
        }
      }

      app.tasks
        .filter((task) => !task.done && task.dueDate)
        .forEach((task) => {
          const due = new Date(task.dueDate);
          const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
          if (diffDays >= -1 && diffDays <= 14) {
            items.push({
              id: `${app.id}-${task.id}`,
              text: `${task.label} for ${uniName}`,
              timeAgo: makeDaysAwayLabel(task.dueDate),
            });
          }
        });
    });

    if (items.length < 3) {
      items.push(
        {
          id: 'generic-1',
          text: 'Explore scholarships that match your profile',
          timeAgo: 'Just now',
        },
        {
          id: 'generic-2',
          text: 'Add documents to stay ahead of deadlines',
          timeAgo: 'Today',
        },
      );
    }

    return items.slice(0, 5);
  }, [applications, universities]);

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <Container className="flex h-20 items-center justify-between gap-6">
        <Link to="/search" className="flex items-center gap-2">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-lg font-semibold text-white">
            EU
          </span>
          <span className="text-lg font-semibold text-slate-800">UniPath</span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 transition hover:text-brand-600 ${
                  isActive ? 'bg-brand-100 text-brand-700' : ''
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <NotificationBell items={notificationItems} />
          <Link
            to="/onboarding"
            className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-500 hover:text-brand-600 md:inline-flex"
          >
            Update profile
          </Link>
          <Link
            to="/profile"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white"
          >
            JD
          </Link>
        </div>
      </Container>
    </header>
  );
};

export default NavBar;
