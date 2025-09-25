// SearchBar.jsx
// Offers a keyword input with subtle styling and triggers parent callbacks for debounced search.
const SearchBar = ({ value, onChange, onClear }) => (
  <div className="relative">
    <label htmlFor="university-search" className="sr-only">
      Search universities
    </label>
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 5.65 5.65a7.5 7.5 0 0 0 10.6 10.6" />
      </svg>
    </div>
    <input
      id="university-search"
      type="search"
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      placeholder="Search by university or program"
      className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-12 text-sm text-slate-700 shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/60"
    />
    {value && (
      <button
        type="button"
        onClick={onClear}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 transition hover:bg-slate-200"
      >
        Clear
      </button>
    )}
  </div>
);

export default SearchBar;
