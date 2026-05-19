import { useContext } from "react";
import { MovieFiltersContext } from "../context/movie-filters-context";

export const useMovieFilters = () => {
  const ctx = useContext(MovieFiltersContext);
  if (!ctx) {
    throw new Error("useMovieFilters must be used within MovieFiltersProvider");
  }
  return ctx;
};
