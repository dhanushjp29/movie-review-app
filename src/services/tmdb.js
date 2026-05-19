import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

const baseURL = import.meta.env.DEV
  ? "/api/tmdb"
  : "https://api.themoviedb.org/3";

export const tmdbApi = axios.create({
  baseURL,
  headers: ACCESS_TOKEN
    ? { Authorization: `Bearer ${ACCESS_TOKEN}` }
    : {},
  params: API_KEY ? { api_key: API_KEY } : {},
});

const POSTER_BASE = "https://image.tmdb.org/t/p/w500";
const PLACEHOLDER_POSTER =
  "https://via.placeholder.com/500x750/1a1a26/9ca3af?text=No+Poster";

let genreCache = null;

export const getPosterUrl = (path) =>
  path ? `${POSTER_BASE}${path}` : PLACEHOLDER_POSTER;

export const fetchGenres = async () => {
  if (genreCache) return genreCache;
  const { data } = await tmdbApi.get("/genre/movie/list");
  genreCache = data.genres;
  return genreCache;
};

const buildGenreMap = (genres) =>
  Object.fromEntries(genres.map((g) => [g.id, g.name]));

export const mapListMovie = (movie, genreMap) => {
  const names =
    movie.genre_ids?.map((id) => genreMap[id]).filter(Boolean) ?? [];

  return {
    id: String(movie.id),
    title: movie.title,
    year: movie.release_date?.slice(0, 4) ?? "N/A",
    genre: names.length ? names.join(", ") : "Unknown",
    genreIds: movie.genre_ids ?? [],
    poster: getPosterUrl(movie.poster_path),
    voteAverage: movie.vote_average ?? 0,
  };
};

const applyClientFilters = (movies, { genre, year, minRating }) => {
  return movies.filter((movie) => {
    if (genre !== "all" && !movie.genreIds.includes(Number(genre)))
      return false;
    if (year !== "all" && movie.year !== String(year)) return false;
    if (minRating > 0 && movie.voteAverage / 2 < minRating) return false;
    return true;
  });
};

export const fetchMovies = async (filters, signal) => {
  const genres = await fetchGenres();
  const genreMap = buildGenreMap(genres);
  const { search, genre, year, minRating } = filters;

  let results;

  if (search.trim()) {
    const { data } = await tmdbApi.get("/search/movie", {
      params: { query: search.trim(), include_adult: false },
      signal,
    });
    results = data.results.map((m) => mapListMovie(m, genreMap));
    return applyClientFilters(results, { genre, year, minRating });
  }

  const params = {
    sort_by: "popularity.desc",
    page: 1,
    include_adult: false,
  };

  if (genre !== "all") params.with_genres = genre;
  if (year !== "all") params.primary_release_year = year;
  if (minRating > 0) params["vote_average.gte"] = minRating * 2;

  const { data } = await tmdbApi.get("/discover/movie", { params, signal });
  results = data.results.map((m) => mapListMovie(m, genreMap));

  if (minRating > 0) {
    return results.filter((m) => m.voteAverage / 2 >= minRating);
  }

  return results;
};

export const fetchMovieById = async (id, signal) => {
  const [{ data: movie }, { data: credits }] = await Promise.all([
    tmdbApi.get(`/movie/${id}`, { signal }),
    tmdbApi.get(`/movie/${id}/credits`, { signal }),
  ]);

  const director =
    credits.crew.find((c) => c.job === "Director")?.name ?? "Unknown";
  const cast =
    credits.cast
      .slice(0, 8)
      .map((c) => c.name)
      .join(", ") || "Cast information unavailable";

  return {
    id: String(movie.id),
    title: movie.title,
    year: movie.release_date?.slice(0, 4) ?? "N/A",
    genre: movie.genres?.map((g) => g.name).join(", ") ?? "Unknown",
    poster: getPosterUrl(movie.poster_path),
    plot: movie.overview || "No synopsis available.",
    cast,
    director,
    runtime: movie.runtime ? `${movie.runtime} min` : "N/A",
    voteAverage: movie.vote_average ?? 0,
  };
};
