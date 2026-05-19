import { useEffect, useState } from "react";
import { fetchGenres } from "../services/tmdb";

export const useGenres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchGenres()
      .then((data) => {
        if (active) setGenres(data);
      })
      .catch(() => {
        if (active) setGenres([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { genres, loading };
};
