import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const getVisiblePages = (current, total) => {
  if (total <= 1) return [1];
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  let start = Math.max(1, current - 1);
  let end = Math.min(total, start + 2);
  if (end - start < 2) start = Math.max(1, end - 2);

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const navBtnClass =
  "flex h-11 w-11 items-center justify-center rounded-full bg-cinema-accent text-cinema-950 shadow-lg transition hover:bg-cinema-accent-hover disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-cinema-accent";

const pageBtnClass = (active) =>
  [
    "flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition",
    active
      ? "bg-cinema-accent text-cinema-950"
      : "border border-cinema-700 text-heading hover:border-cinema-accent hover:text-cinema-accent",
  ].join(" ");

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = getVisiblePages(currentPage, totalPages);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const goPrev = () => canPrev && onPageChange(currentPage - 1);
  const goNext = () => canNext && onPageChange(currentPage + 1);

  return (
    <>
      <button
        type="button"
        onClick={goPrev}
        disabled={!canPrev}
        aria-label="Previous page"
        className={`fixed left-3 top-1/2 z-30 hidden -translate-y-1/2 sm:flex md:left-6 ${navBtnClass}`}
      >
        <FaChevronLeft className="text-lg" />
      </button>

      <button
        type="button"
        onClick={goNext}
        disabled={!canNext}
        aria-label="Next page"
        className={`fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 sm:flex md:right-6 ${navBtnClass}`}
      >
        <FaChevronRight className="text-lg" />
      </button>

      <nav
        className="mt-10 flex items-center justify-center gap-2"
        aria-label="Pagination"
      >
        <button
          type="button"
          onClick={goPrev}
          disabled={!canPrev}
          aria-label="Previous page"
          className={navBtnClass}
        >
          <FaChevronLeft />
        </button>

        <div className="flex items-center gap-1.5 px-1">
          {pages.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
              className={pageBtnClass(page === currentPage)}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={!canNext}
          aria-label="Next page"
          className={navBtnClass}
        >
          <FaChevronRight />
        </button>
      </nav>
    </>
  );
};

export default Pagination;
