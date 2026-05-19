import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaChevronDown, FaSearch } from "react-icons/fa";

const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder = "Select",
  ariaLabel,
  searchable = false,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [menuStyle, setMenuStyle] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const searchRef = useRef(null);
  const optionRefs = useRef([]);

  const selected = options.find((opt) => String(opt.value) === String(value));

  const filteredOptions = useMemo(() => {
    if (!searchable || !search.trim()) return options;
    const query = search.trim().toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(query));
  }, [options, search, searchable]);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setMenuStyle({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
  };

  const closeMenu = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const selectOption = (opt) => {
    onChange(opt.value);
    closeMenu();
  };

  const selectHighlighted = () => {
    const opt = filteredOptions[highlightedIndex];
    if (opt) selectOption(opt);
  };

  const moveHighlight = (delta) => {
    if (filteredOptions.length === 0) return;
    setHighlightedIndex((prev) => {
      const next = prev + delta;
      if (next < 0) return filteredOptions.length - 1;
      if (next >= filteredOptions.length) return 0;
      return next;
    });
  };

  const handleListKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        moveHighlight(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        moveHighlight(-1);
        break;
      case "Enter":
        e.preventDefault();
        selectHighlighted();
        break;
      case "Home":
        e.preventDefault();
        setHighlightedIndex(0);
        break;
      case "End":
        e.preventDefault();
        setHighlightedIndex(Math.max(0, filteredOptions.length - 1));
        break;
      case "Escape":
        e.preventDefault();
        closeMenu();
        break;
      default:
        break;
    }
  };

  const handleTriggerKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      handleListKeyDown(e);
    }
  };

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    if (searchable) {
      searchRef.current?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [open, searchable]);

  useEffect(() => {
    if (!open) {
      setSearch("");
      setHighlightedIndex(0);
      return;
    }

    const selectedIndex = filteredOptions.findIndex(
      (opt) => String(opt.value) === String(value)
    );
    setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [open, filteredOptions, value]);

  useEffect(() => {
    if (searchable && open) {
      setHighlightedIndex(0);
    }
  }, [search, searchable, open]);

  useEffect(() => {
    const el = optionRefs.current[highlightedIndex];
    el?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex, filteredOptions]);

  useEffect(() => {
    if (!open) return;

    const handleOutside = (e) => {
      if (
        containerRef.current?.contains(e.target) ||
        e.target.closest?.("[data-select-menu]")
      ) {
        return;
      }
      setOpen(false);
    };

    const handleScrollOrResize = () => updatePosition();

    document.addEventListener("mousedown", handleOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [open]);

  const menu = open
    ? createPortal(
        <div
          data-select-menu
          className="select-dropdown-portal scrollbar-thin"
          style={{
            position: "fixed",
            top: menuStyle.top,
            left: menuStyle.left,
            width: menuStyle.width,
          }}
        >
          {searchable && (
            <div className="select-dropdown-search">
              <FaSearch className="text-subtle shrink-0 text-xs" />
              <input
                ref={searchRef}
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="select-search-input"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  handleListKeyDown(e);
                  e.stopPropagation();
                }}
              />
            </div>
          )}
          <ul className="max-h-48 overflow-y-auto py-1" role="listbox">
            {filteredOptions.length === 0 ? (
              <li className="px-4 py-3 text-sm text-subtle">No results found</li>
            ) : (
              filteredOptions.map((opt, index) => {
                const isSelected = String(value) === String(opt.value);
                const isHighlighted = index === highlightedIndex;
                return (
                  <li key={opt.value} role="presentation">
                    <button
                      ref={(el) => {
                        optionRefs.current[index] = el;
                      }}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      onClick={() => selectOption(opt)}
                      className={`select-option ${
                        isSelected ? "select-option-active" : ""
                      } ${isHighlighted ? "select-option-highlighted" : ""}`}
                    >
                      {opt.label}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>,
        document.body
      )
    : null;

  return (
    <div ref={containerRef} className="relative z-20">
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className={`select-trigger w-full ${open ? "select-trigger-open" : ""}`}
      >
        <span className="truncate text-left">
          {selected?.label ?? placeholder}
        </span>
        <FaChevronDown
          className={`shrink-0 text-sm text-cinema-accent transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {menu}
    </div>
  );
};

export default CustomSelect;
