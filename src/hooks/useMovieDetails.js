import { useEffect, useState } from "react";
import { fetchMovieById } from "../services/tmdb";
import { isAbortError } from "../utils/isAbortError";

export const useMovieDetails = (id) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchMovieById(id);
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
    };
  }, [id]);

  return { movie, loading, error };
};
