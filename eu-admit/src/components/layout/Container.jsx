// Container.jsx
// Provides a responsive max-width wrapper used across pages for consistent gutters.
const Container = ({ children, className = '' }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`.trim()}>{children}</div>
);

export default Container;
