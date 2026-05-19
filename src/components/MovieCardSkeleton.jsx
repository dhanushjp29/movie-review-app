import Skeleton from "./Skeleton";

const MovieCardSkeleton = () => (
  <article className="surface-card overflow-hidden">
    <Skeleton className="aspect-[2/3] w-full rounded-none" />
    <div className="p-4">
      <Skeleton className="h-5 w-3/4 rounded-md" />
      <div className="mt-3 flex gap-3">
        <Skeleton className="h-3 w-12 rounded-md" />
        <Skeleton className="h-3 w-20 rounded-md" />
      </div>
      <div className="mt-4 flex justify-between">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-4 w-10 rounded-md" />
      </div>
    </div>
  </article>
);

export default MovieCardSkeleton;
