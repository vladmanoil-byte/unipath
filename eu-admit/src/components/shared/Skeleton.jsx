// Skeleton.jsx
// Displays animated placeholder blocks for cards, text, or avatars while data re-computes.
const baseClasses = 'animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-700/30';

const Skeleton = ({ variant = 'text', lines = 3, className = '' }) => {
  if (variant === 'card') {
    return <div className={`${baseClasses} h-64 w-full ${className}`.trim()} aria-hidden />;
  }

  if (variant === 'avatar') {
    return <div className={`${baseClasses} h-12 w-12 rounded-full ${className}`.trim()} aria-hidden />;
  }

  return (
    <div className={`space-y-3 ${className}`.trim()} aria-hidden>
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className={`${baseClasses} h-3 w-full`} />
      ))}
    </div>
  );
};

export default Skeleton;
