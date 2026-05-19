import { useContext } from "react";
import { RatingContext } from "../context/rating-context";

export const useRatings = () => {
  const ctx = useContext(RatingContext);
  if (!ctx) throw new Error("useRatings must be used within RatingProvider");
  return ctx;
};
