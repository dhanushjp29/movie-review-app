import { useState } from "react";
import { useMovieFilters } from "../hooks/useMovieFilters";
import { useMovies } from "../hooks/useMovies";
import { useGenres } from "../hooks/useGenres";
import SearchFilter from "../components/SearchFilter";
import MovieGrid from "../components/MovieGrid";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const Home = () => {
  const { filters, updateFilter, resetFilters, hasActiveFilters } =
    useMovieFilters();
  const { genres } = useGenres();
  const [retryKey, setRetryKey] = useState(0);
  const { movies, loading, error } = useMovies(filters, retryKey);

  const handleRetry = () => setRetryKey((k) => k + 1);

  return (
    <main className="mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8 animate-slide-up">
        <h1 className="font-display text-3xl font-bold text-heading sm:text-4xl">
          Discover & Rate Movies
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Browse popular films from TMDB, search by title, filter by genre or
          year, and share your star ratings.
        </p>
      </header>

      <div className="mb-8">
        <SearchFilter
          filters={filters}
          updateFilter={updateFilter}
          resetFilters={resetFilters}
          hasActiveFilters={hasActiveFilters}
          resultCount={loading ? 0 : movies.length}
          genres={genres}
        />
      </div>

      {loading && <LoadingSpinner />}
      {!loading && error && (
        <ErrorMessage message={error} onRetry={handleRetry} key={retryKey} />
      )}
      {!loading && !error && <MovieGrid movies={movies} />}
    </main>
  );
};

export default Home;
