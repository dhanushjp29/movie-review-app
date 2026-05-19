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
const PROFILE_BASE = "https://image.tmdb.org/t/p/w185";
const PLACEHOLDER_POSTER =
  "https://via.placeholder.com/500x750/1a1a26/9ca3af?text=No+Poster";

export const getProfileUrl = (path, name) => {
  if (path) return `${PROFILE_BASE}${path}`;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=252536&color=f59e0b&size=128`;
};

export const getPersonSearchUrl = (name) =>
  `https://www.google.com/search?q=${encodeURIComponent(name)}`;

const mapPerson = (person, role) => ({
  id: String(person.id),
  name: person.name,
  role,
  image: getProfileUrl(person.profile_path, person.name),
  searchUrl: getPersonSearchUrl(person.name),
});

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
    originalLanguage: movie.original_language ?? "",
    poster: getPosterUrl(movie.poster_path),
    voteAverage: movie.vote_average ?? 0,
  };
};

const applyClientFilters = (movies, { genre, year, minRating, language }) => {
  return movies.filter((movie) => {
    if (genre !== "all" && !movie.genreIds.includes(Number(genre)))
      return false;
    if (language !== "all" && movie.originalLanguage !== language) return false;
    if (year !== "all" && movie.year !== String(year)) return false;
    if (minRating > 0 && movie.voteAverage / 2 < minRating) return false;
    return true;
  });
};

export const fetchMovies = async (filters, page = 1) => {
  const genres = await fetchGenres();
  const genreMap = buildGenreMap(genres);
  const { search, genre, language, year, minRating } = filters;
  const clientFilters = { genre, language, year, minRating };

  if (search.trim()) {
    const { data } = await tmdbApi.get("/search/movie", {
      params: { query: search.trim(), include_adult: false, page },
    });
    const movies = applyClientFilters(
      data.results.map((m) => mapListMovie(m, genreMap)),
      clientFilters
    );
    return {
      movies,
      totalPages: Math.max(1, data.total_pages ?? 1),
    };
  }

  const params = {
    sort_by: "popularity.desc",
    page,
    include_adult: false,
  };

  if (genre !== "all") params.with_genres = genre;
  if (language !== "all") params.with_original_language = language;
  if (year !== "all") params.primary_release_year = year;
  if (minRating > 0) params["vote_average.gte"] = minRating * 2;

  const { data } = await tmdbApi.get("/discover/movie", { params });
  let movies = data.results.map((m) => mapListMovie(m, genreMap));

  if (minRating > 0) {
    movies = movies.filter((m) => m.voteAverage / 2 >= minRating);
  }

  return {
    movies,
    totalPages: Math.max(1, data.total_pages ?? 1),
  };
};

const pickTrailerKey = (videos) => {
  const results = videos?.results ?? [];
  const youtube = results.filter((v) => v.site === "YouTube" && v.key);

  const matchers = [
    (v) => v.type === "Trailer" && v.official,
    (v) => v.type === "Trailer",
    (v) => v.type === "Teaser" && v.official,
    (v) => v.type === "Teaser",
    (v) => /trailer|teaser/i.test(v.name ?? ""),
    (v) => v.type === "Featurette",
    (v) => v.type === "Clip",
  ];

  for (const match of matchers) {
    const found = youtube.find(match);
    if (found) return found.key;
  }

  return youtube[0]?.key ?? null;
};

export const fetchMovieById = async (id) => {
  const [{ data: movie }, { data: credits }, videosResult] = await Promise.all([
    tmdbApi.get(`/movie/${id}`),
    tmdbApi.get(`/movie/${id}/credits`),
    tmdbApi
      .get(`/movie/${id}/videos`)
      .catch(() => ({ data: { results: [] } })),
  ]);
  const videos = videosResult.data;

  const year = movie.release_date?.slice(0, 4) ?? "N/A";
  const trailerKey = pickTrailerKey(videos);

  const directorMember = credits.crew.find((c) => c.job === "Director");
  const director = directorMember
    ? mapPerson(directorMember, "Director")
    : null;
  const castMembers = credits.cast
    .slice(0, 15)
    .map((member) => mapPerson(member, member.character || "Cast"));

  return {
    id: String(movie.id),
    title: movie.title,
    year,
    genre: movie.genres?.map((g) => g.name).join(", ") ?? "Unknown",
    poster: getPosterUrl(movie.poster_path),
    plot: movie.overview || "No synopsis available.",
    director,
    castMembers,
    runtime: movie.runtime ? `${movie.runtime} min` : "N/A",
    voteAverage: movie.vote_average ?? 0,
    trailerKey,
  };
};
