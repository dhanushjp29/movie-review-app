import { useEffect, useState } from "react";
import { fetchGenres } from "../services/tmdb";

export const useGenres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetchGenres()
      .then(setGenres)
      .catch(() => setGenres([]))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return { genres, loading };
};
