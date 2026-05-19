import { useEffect, useState } from "react";
import { fetchMovies } from "../services/tmdb";

const isAbortError = (err) =>
  err?.code === "ERR_CANCELED" ||
  err?.name === "CanceledError" ||
  err?.name === "AbortError";

export const useMovies = (filters, retryKey = 0) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchMovies(filters, controller.signal);
        if (!active) return;
        setMovies(data);
      } catch (err) {
        if (!active || isAbortError(err)) return;
        setError(
          err.response?.data?.status_message ||
            err.message ||
            "Failed to load movies"
        );
        setMovies([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    const delay = filters.search.trim() ? 400 : 0;
    const timer = setTimeout(load, delay);

    return () => {
      active = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [filters, retryKey]);

  return { movies, loading, error };
};
