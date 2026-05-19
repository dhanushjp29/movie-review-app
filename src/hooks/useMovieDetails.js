import { useEffect, useState } from "react";
import { fetchMovieById } from "../services/tmdb";

const isAbortError = (err) =>
  err?.code === "ERR_CANCELED" ||
  err?.name === "CanceledError" ||
  err?.name === "AbortError";

export const useMovieDetails = (id) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchMovieById(id, controller.signal);
        if (!active) return;
        setMovie(data);
      } catch (err) {
        if (!active || isAbortError(err)) return;
        setError(
          err.response?.data?.status_message ||
            err.message ||
            "Failed to load movie"
        );
        setMovie(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
      controller.abort();
    };
  }, [id]);

  return { movie, loading, error };
};
