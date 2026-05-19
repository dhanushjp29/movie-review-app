import MovieCardSkeleton from "./MovieCardSkeleton";

const CARD_COUNT = 10;

const MovieGridSkeleton = () => (
  <div
    className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5"
    aria-busy="true"
    aria-label="Loading movies"
  >
    {Array.from({ length: CARD_COUNT }, (_, i) => (
      <MovieCardSkeleton key={i} />
    ))}
  </div>
);

export default MovieGridSkeleton;
