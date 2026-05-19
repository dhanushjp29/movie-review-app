import Skeleton from "./Skeleton";

const CastSkeleton = () => (
  <div className="flex gap-4">
    {Array.from({ length: 6 }, (_, i) => (
      <div key={i} className="flex w-20 shrink-0 flex-col items-center">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="mt-2 h-3 w-16 rounded-md" />
        <Skeleton className="mt-1.5 h-2.5 w-12 rounded-md" />
      </div>
    ))}
  </div>
);

const MovieDetailsSkeleton = () => (
  <div className="animate-fade-in" aria-busy="true" aria-label="Loading movie details">
    <Skeleton className="mb-6 h-4 w-32 rounded-md" />

    <div className="grid gap-8 lg:grid-cols-[320px_1fr] lg:gap-12">
      <div className="mx-auto w-full max-w-xs lg:max-w-none">
        <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
      </div>

      <div className="min-w-0">
        <Skeleton className="h-10 w-2/3 max-w-md rounded-lg sm:h-12" />
        <div className="mt-4 flex flex-wrap gap-4">
          <Skeleton className="h-4 w-14 rounded-md" />
          <Skeleton className="h-4 w-40 rounded-md" />
          <Skeleton className="h-4 w-20 rounded-md" />
        </div>

        <div className="surface-panel mt-8 p-6">
          <Skeleton className="mb-3 h-5 w-20 rounded-md" />
          <Skeleton className="aspect-video w-full rounded-xl" />
          <Skeleton className="mt-6 h-5 w-28 rounded-md" />
          <Skeleton className="mt-2 h-4 w-48 rounded-md" />
          <Skeleton className="mt-4 h-8 w-40 rounded-md" />
          <div className="mt-6 border-t border-cinema-700/50 pt-6">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="mt-2 h-8 w-16 rounded-md" />
          </div>
        </div>

        <section className="mt-8">
          <Skeleton className="h-5 w-24 rounded-md" />
          <Skeleton className="mt-3 h-4 w-full rounded-md" />
          <Skeleton className="mt-2 h-4 w-full rounded-md" />
          <Skeleton className="mt-2 h-4 w-4/5 rounded-md" />
        </section>

        <section className="mt-8 min-w-0">
          <Skeleton className="h-5 w-36 rounded-md" />
          <div className="mt-4 overflow-hidden">
            <CastSkeleton />
          </div>
        </section>
      </div>
    </div>
  </div>
);

export default MovieDetailsSkeleton;
