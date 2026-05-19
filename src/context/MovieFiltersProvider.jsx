import { useCallback, useMemo, useState } from "react";
import { MovieFiltersContext } from "./movie-filters-context";
import { defaultMovieFilters } from "./movieFiltersDefaults";

const STORAGE_KEY = "movie-review-browse-state";

const isValidFilters = (value) =>
  value &&
  typeof value === "object" &&
  typeof value.search === "string" &&
  typeof value.genre === "string" &&
  typeof value.language === "string" &&
  typeof value.year === "string" &&
  typeof value.minRating === "number";

const loadBrowseState = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isValidFilters(parsed.filters)) return null;
    const page =
      typeof parsed.page === "number" && parsed.page >= 1 ? parsed.page : 1;
    return { filters: parsed.filters, page };
  } catch {
    return null;
  }
};

const saveBrowseState = (filters, page) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ filters, page }));
  } catch {
    /* ignore quota errors */
  }
};

export const MovieFiltersProvider = ({ children }) => {
  const saved = loadBrowseState();
  const [filters, setFilters] = useState(saved?.filters ?? defaultMovieFilters);
  const [page, setPage] = useState(saved?.page ?? 1);

  const persist = useCallback((nextFilters, nextPage) => {
    saveBrowseState(nextFilters, nextPage);
  }, []);

  const updateFilter = useCallback(
    (key, value) => {
      setFilters((prev) => {
        const next = { ...prev, [key]: value };
        persist(next, 1);
        return next;
      });
      setPage(1);
    },
    [persist]
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultMovieFilters);
    setPage(1);
    persist(defaultMovieFilters, 1);
  }, [persist]);

  const goToPage = useCallback(
    (nextPage) => {
      setPage(nextPage);
      setFilters((current) => {
        persist(current, nextPage);
        return current;
      });
    },
    [persist]
  );

  const hasActiveFilters = useMemo(
    () =>
      filters.search !== "" ||
      filters.genre !== "all" ||
      filters.language !== "all" ||
      filters.year !== "all" ||
      filters.minRating > 0,
    [filters]
  );

  const value = useMemo(
    () => ({
      filters,
      page,
      setPage: goToPage,
      updateFilter,
      resetFilters,
      hasActiveFilters,
    }),
    [filters, page, goToPage, updateFilter, resetFilters, hasActiveFilters]
  );

  return (
    <MovieFiltersContext.Provider value={value}>
      {children}
    </MovieFiltersContext.Provider>
  );
};
