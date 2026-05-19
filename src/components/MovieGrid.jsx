import { memo } from "react";
import { FaFilm } from "react-icons/fa";
import MovieCard from "./MovieCard";

const MovieGrid = ({ movies }) => {
  if (movies.length === 0) {
    return (
      <div className="surface-panel flex flex-col items-center justify-center border-dashed py-20 text-center animate-fade-in">
        <FaFilm className="mb-4 text-5xl text-subtle" />
        <h3 className="text-xl font-semibold text-heading">No movies found</h3>
        <p className="mt-2 max-w-sm text-muted">
          Try adjusting your search or filters to discover more films.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default memo(MovieGrid);
