// SearchPage.jsx
// Implements keyword search, multi-filter controls, recommendations, and paginated results for universities.
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';
import Container from '../components/layout/Container.jsx';
import SearchBar from '../components/search/SearchBar.jsx';
import FilterPanel from '../components/search/FilterPanel.jsx';
import UniversityCard from '../components/search/UniversityCard.jsx';
import RecommendationStrip from '../components/search/RecommendationStrip.jsx';
import Skeleton from '../components/shared/Skeleton.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';

const RESULTS_PER_PAGE = 9;

const useDebouncedValue = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
};

const SearchPage = () => {
  const { universities, profile, compareIds, toggleCompare } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const tuitionValues = useMemo(
    () => universities.flatMap((u) => [u.tuitionEUR.min, u.tuitionEUR.max]),
    [universities],
  );
  const tuitionBounds = useMemo(() => [Math.min(...tuitionValues), Math.max(...tuitionValues)], [tuitionValues]);

  const uniqueCountries = useMemo(
    () => Array.from(new Set(universities.map((u) => u.country))).sort(),
    [universities],
  );
  const uniqueFields = useMemo(
    () => Array.from(new Set(universities.flatMap((u) => u.fields))).sort(),
    [universities],
  );
  const uniqueLanguages = useMemo(
    () => Array.from(new Set(universities.flatMap((u) => u.languages ?? [u.language]))).sort(),
    [universities],
  );

  const initialFilters = useMemo(
    () => ({
      countries: [],
      fields: [],
      languages: [],
      tuition: tuitionBounds,
      sort: 'ranking-asc',
    }),
    [tuitionBounds],
  );

  const [filters, setFilters] = useState(initialFilters);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebouncedValue(searchTerm, 300);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (location.state?.toastMessage) {
      setToastMessage(location.state.toastMessage);
      setShowToast(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (!showToast) return undefined;
    const timer = setTimeout(() => setShowToast(false), 3500);
    return () => clearTimeout(timer);
  }, [showToast]);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 280);
    return () => clearTimeout(timeout);
  }, [debouncedSearch, filters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filters.countries, filters.fields, filters.languages, filters.tuition]);

  const filteredUniversities = useMemo(() => {
    const matchesSearch = (uni) => {
      if (!debouncedSearch) return true;
      const term = debouncedSearch.toLowerCase();
      const nameMatch = uni.name.toLowerCase().includes(term);
      const programMatch = uni.programs.some((p) => p.name.toLowerCase().includes(term));
      return nameMatch || programMatch;
    };

    const matchesFilters = (uni) => {
      const countriesOk = filters.countries.length === 0 || filters.countries.includes(uni.country);
      const fieldsOk = filters.fields.length === 0 || uni.fields.some((field) => filters.fields.includes(field));
      const languagesOk =
        filters.languages.length === 0 || (uni.languages ?? [uni.language]).some((lang) => filters.languages.includes(lang));
      const tuitionOk = uni.tuitionEUR.min <= filters.tuition[1] && uni.tuitionEUR.max >= filters.tuition[0];
      return countriesOk && fieldsOk && languagesOk && tuitionOk;
    };

    const sorters = {
      'ranking-asc': (a, b) => a.ranking - b.ranking,
      'ranking-desc': (a, b) => b.ranking - a.ranking,
      'tuition-asc': (a, b) => a.tuitionEUR.min - b.tuitionEUR.min,
      'tuition-desc': (a, b) => b.tuitionEUR.max - a.tuitionEUR.max,
      'deadline-asc': (a, b) => {
        const dateA = a.deadlines?.[0]?.date ? new Date(a.deadlines[0].date).getTime() : Infinity;
        const dateB = b.deadlines?.[0]?.date ? new Date(b.deadlines[0].date).getTime() : Infinity;
        return dateA - dateB;
      },
    };

    return [...universities].filter((uni) => matchesSearch(uni) && matchesFilters(uni)).sort(sorters[filters.sort]);
  }, [debouncedSearch, filters, universities]);

  const totalPages = Math.max(1, Math.ceil(filteredUniversities.length / RESULTS_PER_PAGE));
  const paginated = filteredUniversities.slice((currentPage - 1) * RESULTS_PER_PAGE, currentPage * RESULTS_PER_PAGE);

  const recommended = useMemo(() => {
    if (!profile.completedOnboarding) {
      return [...universities].sort((a, b) => a.ranking - b.ranking).slice(0, 6);
    }
    return [...universities]
      .map((uni) => {
        const languageMatch = (uni.languages ?? [uni.language]).filter((lang) => profile.preferences.languages.includes(lang)).length;
        const countryMatch = profile.preferences.countries.includes(uni.country) ? 2 : 0;
        const fieldMatch = uni.fields.filter((field) => profile.preferences.fields.includes(field)).length;
        const tuitionMatch =
          uni.tuitionEUR.min >= profile.preferences.budgetMin && uni.tuitionEUR.max <= profile.preferences.budgetMax ? 1 : 0;
        const score = countryMatch * 2 + fieldMatch * 1.5 + languageMatch + tuitionMatch;
        return { uni, score };
      })
      .sort((a, b) => b.score - a.score || a.uni.ranking - b.uni.ranking)
      .slice(0, 6)
      .map((item) => item.uni);
  }, [profile, universities]);

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const handleToggleCompare = (id, checked) => {
    if (checked && compareIds.length >= 4 && !compareIds.includes(id)) {
      return;
    }
    toggleCompare(id, checked);
  };

  const compareButtonVisible = compareIds.length >= 2;

  return (
    <Container className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-slate-900">Search universities</h1>
          <p className="mt-1 text-sm text-slate-500">Discover EU undergraduate programs tailored to your goals.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(true)}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-brand-400 hover:text-brand-600 md:hidden"
        >
          Filters
        </button>
      </div>

      {showToast && (
        <div className="rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700 shadow-sm">
          {toastMessage}
        </div>
      )}

      <SearchBar value={searchTerm} onChange={setSearchTerm} onClear={() => setSearchTerm('')} />

      <RecommendationStrip items={recommended} onToggleCompare={handleToggleCompare} compareIds={compareIds} />

      <div className="md:grid md:grid-cols-[280px,1fr] md:gap-6">
        <div className="hidden md:block">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            onReset={handleResetFilters}
            countries={uniqueCountries}
            fields={uniqueFields}
            languages={uniqueLanguages}
            tuitionBounds={tuitionBounds}
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <p>
              Showing <span className="font-semibold text-slate-700">{filteredUniversities.length}</span> universities
            </p>
            <p>Page {currentPage} of {totalPages}</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} variant="card" />
              ))}
            </div>
          ) : paginated.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginated.map((uni) => (
                <UniversityCard
                  key={uni.id}
                  u={uni}
                  onToggleCompare={handleToggleCompare}
                  checkedForCompare={compareIds.includes(uni.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No universities match those filters"
              subtitle="Try widening your tuition range or removing a filter to see more options."
              actionLabel="Reset filters"
              onAction={handleResetFilters}
            />
          )}

          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-400 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-400 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-40 flex items-end bg-slate-900/40 backdrop-blur-sm md:hidden">
          <div className="h-[85vh] w-full rounded-t-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">Filters</h2>
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-500"
              >
                Close
              </button>
            </div>
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              onReset={() => {
                handleResetFilters();
                setShowFilters(false);
              }}
              countries={uniqueCountries}
              fields={uniqueFields}
              languages={uniqueLanguages}
              tuitionBounds={tuitionBounds}
            />
          </div>
        </div>
      )}

      {compareButtonVisible && (
        <button
          type="button"
          onClick={() => navigate('/compare', { state: { compare: compareIds } })}
          className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-3 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-brand-700"
        >
          Compare {compareIds.length} selected
        </button>
      )}
    </Container>
  );
};

export default SearchPage;
