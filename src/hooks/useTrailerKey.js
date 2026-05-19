import { useEffect, useState } from "react";
import { searchYoutubeTrailerId } from "../services/youtubeTrailer";

/**
 * Uses TMDB key immediately; resolves YouTube fallback in the background.
 * Parent should pass key={movie.id} on MovieTrailer so state resets per movie.
 */
export const useTrailerKey = (tmdbKey, title, year) => {
  const needsFallback = !tmdbKey && Boolean(title?.trim());
  const [youtubeKey, setYoutubeKey] = useState(null);
  const [done, setDone] = useState(!needsFallback);

  useEffect(() => {
    if (!needsFallback) return;

    let active = true;

    searchYoutubeTrailerId(title.trim(), year).then((id) => {
      if (!active) return;
      setYoutubeKey(id);
      setDone(true);
    });

    return () => {
      active = false;
    };
  }, [needsFallback, title, year]);

  return {
    trailerKey: tmdbKey ?? youtubeKey,
    resolving: needsFallback && !done,
  };
};
