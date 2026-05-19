import { memo } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaFilm } from "react-icons/fa";
import { useRatings } from "../hooks/useRatings";
import StarRating from "./StarRating";

const MovieCard = ({ movie }) => {
  const { getAverageRating, getUserRating } = useRatings();
  const avg = getAverageRating(movie.id, movie.voteAverage);
  const userRating = getUserRating(movie.id);

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group block animate-slide-up"
    >
      <article className="surface-card hover:-translate-y-1 hover:border-cinema-accent/40 hover:shadow-cinema-accent/10">
        <div className="relative aspect-[2/3] overflow-hidden bg-cinema-800">
          <img
            src={movie.poster}
            alt={movie.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />
          <span className="absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-cinema-accent backdrop-blur-sm">
            {avg.toFixed(1)} ★
          </span>
        </div>

        <div className="p-4">
          <h3 className="font-display text-lg font-semibold text-heading line-clamp-1 transition-colors group-hover:text-cinema-accent">
            {movie.title}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
            <span className="flex items-center gap-1">
              <FaCalendarAlt className="text-cinema-accent" />
              {movie.year}
            </span>
            <span className="flex items-center gap-1">
              <FaFilm className="text-cinema-accent" />
              {movie.genre}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <StarRating value={avg} readOnly size="sm" />
            {userRating > 0 && (
              <span className="text-xs font-medium text-cinema-accent">
                You: {userRating}★
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};

export default memo(MovieCard);
