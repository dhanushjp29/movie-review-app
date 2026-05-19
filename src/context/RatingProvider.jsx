import { useCallback, useMemo, useState } from "react";
import { RatingContext } from "./rating-context";

const STORAGE_KEY = "movie-review-ratings";

const loadRatings = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

export const RatingProvider = ({ children }) => {
  const [userRatings, setUserRatings] = useState(loadRatings);

  const persist = useCallback((next) => {
    setUserRatings(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const setRating = useCallback(
    (movieId, stars) => {
      persist({ ...userRatings, [movieId]: stars });
    },
    [userRatings, persist]
  );

  const getUserRating = useCallback(
    (movieId) => userRatings[movieId] ?? 0,
    [userRatings]
  );

  const getAverageRating = useCallback(
    (movieId, voteAverage) => {
      const user = userRatings[movieId];
      const tmdbScore = voteAverage / 2;
      if (!user) return tmdbScore;
      return Number(((tmdbScore + user) / 2).toFixed(1));
    },
    [userRatings]
  );

  const value = useMemo(
    () => ({
      userRatings,
      setRating,
      getUserRating,
      getAverageRating,
    }),
    [userRatings, setRating, getUserRating, getAverageRating]
  );

  return (
    <RatingContext.Provider value={value}>{children}</RatingContext.Provider>
  );
};
