import { memo, useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const StarRating = ({
  value = 0,
  max = 5,
  onChange,
  size = "md",
  readOnly = false,
  showValue = false,
}) => {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  const sizeClass =
    size === "sm"
      ? "text-sm gap-0.5"
      : size === "lg"
        ? "text-2xl gap-1"
        : "text-base gap-0.5";

  const renderStar = (index) => {
    const filled = display >= index;
    const half = !filled && display >= index - 0.5;

    if (half) return <FaStarHalfAlt className="text-cinema-accent" />;
    if (filled) return <FaStar className="text-cinema-accent" />;
    return <FaRegStar className="star-empty" />;
  };

  return (
    <div className={`inline-flex items-center ${sizeClass}`}>
      <div className="flex">
        {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            className={`transition-transform ${
              readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
            }`}
            onMouseEnter={() => !readOnly && setHover(star)}
            onMouseLeave={() => !readOnly && setHover(0)}
            onClick={() => !readOnly && onChange?.(star)}
            aria-label={`Rate ${star} out of ${max} stars`}
          >
            {renderStar(star)}
          </button>
        ))}
      </div>
      {showValue && (
        <span className="ml-2 text-sm font-medium text-muted">
          {value > 0 ? value.toFixed(1) : "—"}
        </span>
      )}
    </div>
  );
};

export default memo(StarRating);
