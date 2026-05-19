import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../hooks/useTheme";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="btn-ghost p-2.5"
    >
      {isDark ? (
        <FaSun className="text-lg text-cinema-accent" />
      ) : (
        <FaMoon className="text-lg text-cinema-accent" />
      )}
    </button>
  );
};

export default ThemeToggle;
