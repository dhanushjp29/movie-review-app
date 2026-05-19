import { Link, useLocation } from "react-router-dom";
import { FaFilm } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <nav className="surface-nav">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-xl font-bold text-heading transition hover:text-cinema-accent"
        >
          <FaFilm className="text-cinema-accent" />
          CineRate
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/"
            className={`nav-link ${isHome ? "nav-link-active" : "nav-link-inactive"}`}
          >
            Browse Movies
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
