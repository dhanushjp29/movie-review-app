import { useMemo } from "react";
import { FaFilter, FaSearch, FaTimes } from "react-icons/fa";
import { releaseYears } from "../utils/years";
import { movieLanguages } from "../utils/languages";
import CustomSelect from "./CustomSelect";
import Skeleton from "./Skeleton";

const ratingOptions = [
  { value: 0, label: "Any Rating" },
  { value: 3, label: "3+ stars" },
  { value: 3.5, label: "3.5+ stars" },
  { value: 4, label: "4+ stars" },
  { value: 4.5, label: "4.5+ stars" },
];

const SearchFilter = ({
  filters,
  updateFilter,
  resetFilters,
  hasActiveFilters,
  resultCount,
  resultLoading = false,
  genres,
  genresLoading = false,
}) => {
  const genreOptions = useMemo(
    () => [
      { value: "all", label: "All Genres" },
      ...genres.map((g) => ({ value: String(g.id), label: g.name })),
    ],
    [genres]
  );

  const yearOptions = useMemo(
    () => [
      { value: "all", label: "All Years" },
      ...releaseYears.map((y) => ({ value: String(y), label: String(y) })),
    ],
    []
  );

  return (
    <section className="surface-panel relative z-30 animate-fade-in overflow-visible p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-heading">
          <FaFilter className="text-cinema-accent" />
          Search & Filter
        </h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 text-sm"
          >
            <FaTimes size={12} />
            Clear all
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="relative sm:col-span-2 xl:col-span-2">
          <FaSearch className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-subtle" />
          <input
            type="search"
            placeholder="Search by title..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="input-themed pl-10"
          />
        </div>

        {genresLoading ? (
          <Skeleton className="h-[42px] w-full rounded-xl" />
        ) : (
          <CustomSelect
            searchable
            ariaLabel="Filter by genre"
            value={filters.genre}
            onChange={(val) => updateFilter("genre", val)}
            options={genreOptions}
            placeholder="All Genres"
          />
        )}

        <CustomSelect
          searchable
          ariaLabel="Filter by language"
          value={filters.language}
          onChange={(val) => updateFilter("language", val)}
          options={movieLanguages}
          placeholder="All Languages"
        />

        <CustomSelect
          searchable
          ariaLabel="Filter by year"
          value={filters.year}
          onChange={(val) => updateFilter("year", val)}
          options={yearOptions}
          placeholder="All Years"
        />

        <CustomSelect
          searchable
          ariaLabel="Filter by minimum rating"
          value={filters.minRating}
          onChange={(val) => updateFilter("minRating", Number(val))}
          options={ratingOptions}
          placeholder="Any Rating"
        />
      </div>

      <div className="mt-4 text-sm text-subtle">
        {resultLoading ? (
          <span className="inline-flex items-center gap-2">
            Showing{" "}
            <Skeleton as="span" className="inline-block h-4 w-8 rounded-md" />{" "}
            movies
          </span>
        ) : (
          <>
            Showing{" "}
            <span className="font-semibold text-cinema-accent">
              {resultCount}
            </span>{" "}
            {resultCount === 1 ? "movie" : "movies"}
          </>
        )}
      </div>
    </section>
  );
};

export default SearchFilter;
