import { useEffect, useState } from "react";
import { fetchMovies } from "../services/tmdb";
import { isAbortError } from "../utils/isAbortError";

export const useMovies = (filters, page = 1, retryKey = 0) => {
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchMovies(filters, page);
        if (!active) return;
        setMovies(data.movies);
        setTotalPages(data.totalPages);
      } catch (err) {
        if (!active || isAbortError(err)) return;
        setError(
          err.response?.data?.status_message ||
            err.message ||
            "Failed to load movies"
        );
        setMovies([]);
        setTotalPages(1);
      } finally {
        if (active) setLoading(false);
      }
    };

    const delay = filters.search.trim() ? 400 : 0;
    const timer = setTimeout(load, delay);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [filters, page, retryKey]);

  return { movies, totalPages, loading, error };
};
