import { useMemo, useState } from "react";

const defaultFilters = {
  search: "",
  genre: "all",
  year: "all",
  minRating: 0,
};

export const useMovieFilters = () => {
  const [filters, setFilters] = useState(defaultFilters);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(defaultFilters);

  const hasActiveFilters = useMemo(
    () =>
      filters.search !== "" ||
      filters.genre !== "all" ||
      filters.year !== "all" ||
      filters.minRating > 0,
    [filters]
  );

  return {
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
  };
};
