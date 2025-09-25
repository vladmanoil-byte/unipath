// Badge.jsx
// Lightweight rounded badge to convey statuses or urgency levels with semantic colors.
const colorMap = {
  gray: 'bg-slate-100 text-slate-700',
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-emerald-100 text-emerald-700',
  red: 'bg-rose-100 text-rose-700',
  orange: 'bg-amber-100 text-amber-700',
  brand: 'bg-brand-100 text-brand-700',
};

const Badge = ({ children, tone = 'gray', className = '' }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
      colorMap[tone] ?? colorMap.gray
    } ${className}`.trim()}
  >
    {children}
  </span>
);

export default Badge;
