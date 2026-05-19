const currentYear = new Date().getFullYear();

export const releaseYears = Array.from(
  { length: currentYear - 1969 },
  (_, i) => currentYear - i
);
