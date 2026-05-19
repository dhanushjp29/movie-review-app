import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaFilm,
} from "react-icons/fa";
import { useRatings } from "../hooks/useRatings";
import { useMovieDetails } from "../hooks/useMovieDetails";
import StarRating from "../components/StarRating";
import MovieTrailer from "../components/MovieTrailer";
import CastSection from "../components/CastSection";
import MovieDetailsSkeleton from "../components/MovieDetailsSkeleton";
import ErrorMessage from "../components/ErrorMessage";

const mainClass =
  "mx-auto max-w-7xl flex-1 overflow-x-hidden px-4 py-8 sm:px-6 sm:py-10";

const MovieDetails = () => {
  const { id } = useParams();
  const { movie, loading, error } = useMovieDetails(id);
  const { getAverageRating, getUserRating, setRating } = useRatings();

  if (loading) {
    return (
      <main className={mainClass}>
        <MovieDetailsSkeleton />
      </main>
    );
  }

  if (error) {
    return (
      <main className={`${mainClass} py-16`}>
        <ErrorMessage
          message={error}
          onRetry={() => window.location.reload()}
        />
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-cinema-accent hover:underline"
          >
            <FaArrowLeft />
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  if (!movie) {
    return (
      <main className={`${mainClass} py-16 text-center`}>
        <h1 className="text-2xl font-bold text-heading">Movie not found</h1>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-2 text-cinema-accent hover:underline"
        >
          <FaArrowLeft />
          Back to home
        </Link>
      </main>
    );
  }

  const avg = getAverageRating(movie.id, movie.voteAverage);
  const userRating = getUserRating(movie.id);

  return (
    <main className={`${mainClass} animate-fade-in`}>
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted transition hover:text-cinema-accent"
      >
        <FaArrowLeft />
        Back to movies
      </Link>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr] lg:gap-12">
        <div className="mx-auto w-full max-w-xs lg:max-w-none">
          <div className="surface-poster">
            <img
              src={movie.poster}
              alt={movie.title}
              className="aspect-[2/3] w-full object-cover"
            />
          </div>
        </div>

        <div className="min-w-0">
          <h1 className="font-display text-3xl font-bold text-heading sm:text-4xl lg:text-5xl">
            {movie.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
            <span className="flex items-center gap-2">
              <FaCalendarAlt className="text-cinema-accent" />
              {movie.year}
            </span>
            <span className="flex items-center gap-2">
              <FaFilm className="text-cinema-accent" />
              {movie.genre}
            </span>
            <span className="flex items-center gap-2">
              <FaClock className="text-cinema-accent" />
              {movie.runtime}
            </span>
          </div>

          <div className="surface-panel mt-8 p-6">
            <MovieTrailer
              key={movie.id}
              trailerKey={movie.trailerKey}
              title={movie.title}
              year={movie.year}
              poster={movie.poster}
            />
            <h2 className="text-lg font-semibold text-heading">Your Rating</h2>
            <p className="mt-1 text-sm text-subtle">
              Click stars to rate this movie (1–5)
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-6">
              <StarRating
                value={userRating}
                onChange={(stars) => setRating(movie.id, stars)}
                size="lg"
              />
              {userRating > 0 && (
                <span className="text-sm font-medium text-cinema-accent">
                  You rated {userRating} star{userRating > 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div className="mt-6 border-t border-cinema-700/50 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-subtle">Average Rating</p>
                  <p className="mt-1 text-2xl font-bold text-cinema-accent">
                    {avg.toFixed(1)} / 5
                  </p>
                </div>
                <StarRating value={avg} readOnly size="md" showValue />
              </div>
              <p className="mt-2 text-xs text-subtle">
                Combines TMDB score with your rating when available
              </p>
            </div>
          </div>

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-heading">Synopsis</h2>
            <p className="mt-3 leading-relaxed text-muted">{movie.plot}</p>
          </section>

          <CastSection
            director={movie.director}
            castMembers={movie.castMembers}
          />
        </div>
      </div>
    </main>
  );
};

export default MovieDetails;
