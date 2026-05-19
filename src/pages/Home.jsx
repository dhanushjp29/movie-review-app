import { useState } from "react";
import { useMovieFilters } from "../hooks/useMovieFilters";
import { useMovies } from "../hooks/useMovies";
import { useGenres } from "../hooks/useGenres";
import SearchFilter from "../components/SearchFilter";
import MovieGrid from "../components/MovieGrid";
import Pagination from "../components/Pagination";
import MovieGridSkeleton from "../components/MovieGridSkeleton";
import ErrorMessage from "../components/ErrorMessage";

const Home = () => {
  const {
    filters,
    page,
    setPage,
    updateFilter,
    resetFilters,
    hasActiveFilters,
  } = useMovieFilters();
  const { genres, loading: genresLoading } = useGenres();
  const [retryKey, setRetryKey] = useState(0);
  const { movies, totalPages, loading, error } = useMovies(
    filters,
    page,
    retryKey
  );

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRetry = () => setRetryKey((k) => k + 1);

  const showPagination = !loading && !error && movies.length > 0;

  return (
    <main className="relative mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
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
          resultCount={loading || genresLoading ? 0 : movies.length}
          resultLoading={loading || genresLoading}
          genres={genres}
          genresLoading={genresLoading}
        />
      </div>

      {loading && <MovieGridSkeleton />}
      {!loading && error && (
        <ErrorMessage message={error} onRetry={handleRetry} key={retryKey} />
      )}
      {!loading && !error && <MovieGrid movies={movies} />}

      {showPagination && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
};

export default Home;
