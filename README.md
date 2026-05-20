# CineRate — Movie Review App

A cinema-themed single-page application built with React + Vite that lets users browse movies from TMDB, search and filter by title, genre, language, year, and rating, watch embedded trailers, and rate movies with a persistent 5-star rating system.

---

## Table of Contents

- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Data Flow](#data-flow)
- [Pages](#pages)
- [Components](#components)
- [Custom Hooks](#custom-hooks)
- [Context / State Management](#context--state-management)
- [Services](#services)
- [Utilities](#utilities)
- [Styling System](#styling-system)
- [API Attribution](#api-attribution)

---

## Live Demo

Deployed on Netlify. See the repository for the live URL.

---

## Tech Stack

| Category | Technology |
|---|---|
| UI Framework | React 19 |
| Build Tool | Vite 8 |
| Routing | React Router DOM v7 |
| HTTP Client | Axios |
| Styling | Tailwind CSS v3 + custom CSS variables |
| Icons | React Icons (Font Awesome set) |
| Movie Data | TMDB REST API |
| Trailer Search | YouTube Data API v3 + Piped API (dev proxy fallback) |
| Persistence | `localStorage` (ratings, theme) · `sessionStorage` (browse state) |
| Linting | ESLint 10 with react-hooks + react-refresh plugins |

---

## Features

- Browse popular movies sorted by popularity (TMDB Discover API)
- Full-text movie search with 400 ms debounce
- Multi-filter: genre, original language, release year, minimum rating
- Browse state (filters + current page) persists across page navigation via `sessionStorage`
- 5-star interactive rating component; ratings persist in `localStorage`
- Average rating blends TMDB score with the user's own rating
- Embedded YouTube trailer on the detail page (TMDB key → YouTube API → Piped fallback)
- Cast & director section with profile photos and Google search links
- Skeleton loading screens for every async state
- Animated cursor glow effect that follows the mouse
- Dark / Light theme toggle with `localStorage` persistence
- Paginated results with floating prev/next arrow buttons
- Fully accessible — ARIA labels, keyboard navigation in dropdowns, focus management
- Responsive layout (mobile-first, 2 → 5 column grid)

---

## Project Structure

```
movie-review-app/
├── public/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── CastSection.jsx
│   │   ├── CursorGlow.jsx
│   │   ├── CustomSelect.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── Footer.jsx
│   │   ├── MovieCard.jsx
│   │   ├── MovieCardSkeleton.jsx
│   │   ├── MovieDetailsSkeleton.jsx
│   │   ├── MovieGrid.jsx
│   │   ├── MovieGridSkeleton.jsx
│   │   ├── MovieTrailer.jsx
│   │   ├── Navbar.jsx
│   │   ├── Pagination.jsx
│   │   ├── SearchFilter.jsx
│   │   ├── Skeleton.jsx
│   │   ├── StarRating.jsx
│   │   └── ThemeToggle.jsx
│   ├── context/             # React Context providers and defaults
│   │   ├── movie-filters-context.js
│   │   ├── MovieFiltersProvider.jsx
│   │   ├── movieFiltersDefaults.js
│   │   ├── rating-context.js
│   │   ├── RatingProvider.jsx
│   │   ├── theme-context.js
│   │   └── ThemeProvider.jsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useGenres.js
│   │   ├── useMovieDetails.js
│   │   ├── useMovieFilters.js
│   │   ├── useMovies.js
│   │   ├── useRatings.js
│   │   ├── useTheme.js
│   │   └── useTrailerKey.js
│   ├── pages/               # Route-level page components
│   │   ├── Home.jsx
│   │   └── MovieDetails.jsx
│   ├── services/            # API abstraction layer
│   │   ├── tmdb.js
│   │   └── youtubeTrailer.js
│   ├── utils/               # Pure helper functions / static data
│   │   ├── isAbortError.js
│   │   ├── languages.js
│   │   └── years.js
│   ├── App.jsx              # Root component — providers + routes
│   ├── App.css
│   ├── index.css            # Tailwind + all custom CSS
│   └── main.jsx             # React DOM entry point
├── .env                     # API keys (not committed to VCS)
├── eslint.config.js
├── package.json
└── vite.config.js
```

---

## Environment Variables

Create a `.env` file in the project root with the following keys:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_TMDB_ACCESS_TOKEN=your_tmdb_read_access_token
VITE_YOUTUBE_API_KEY=your_youtube_data_api_v3_key   # optional
```

- **`VITE_TMDB_API_KEY`** — passed as a query parameter fallback when no access token is provided.
- **`VITE_TMDB_ACCESS_TOKEN`** — preferred; sent as a `Bearer` header. Get it from [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).
- **`VITE_YOUTUBE_API_KEY`** — optional. Enables the YouTube Data API v3 trailer search. Without it the app falls back to a dev-only Piped proxy and links to YouTube search in production.

In development, TMDB requests are proxied through `/api/tmdb` and YouTube searches through `/api/youtube-search` (Piped API) to avoid CORS issues. In production builds the app calls TMDB directly.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint
npm run lint
```

---

## Data Flow

```
User interaction
      │
      ▼
  Page Component  (Home / MovieDetails)
      │  uses custom hooks
      ▼
  Custom Hooks  (useMovies / useMovieDetails / useGenres / useTrailerKey)
      │  calls service functions
      ▼
  Service Layer  (tmdb.js / youtubeTrailer.js)
      │  HTTP via Axios / fetch
      ▼
  External APIs  (TMDB · YouTube Data API · Piped)
      │  raw JSON
      ▼
  Service Layer  maps raw data to app shape
      │
      ▼
  Hooks update local state → React re-renders components
      │
      ▼
  Context (RatingProvider / ThemeProvider / MovieFiltersProvider)
      │  cross-cutting state available to any component
      ▼
  Components render final UI
```

**Persistence side-channel:**
- User ratings → `localStorage["movie-review-ratings"]`
- Theme preference → `localStorage["cinerate-theme"]`
- Browse filters + current page → `sessionStorage["movie-review-browse-state"]`

---

## Pages

### [Home.jsx](src/pages/Home.jsx)

The landing page (`/`). Orchestrates the entire browse experience.

- Reads filter state and pagination from `useMovieFilters`.
- Fetches the genre list once via `useGenres` (for the genre dropdown).
- Fetches the current page of movies via `useMovies(filters, page, retryKey)`.
- Controls a `retryKey` counter to force a re-fetch when the user clicks "Try again" on the error state.
- Scrolls to top on every page change.
- Renders: `SearchFilter` → `MovieGridSkeleton` | `ErrorMessage` | `MovieGrid` → `Pagination`.

### [MovieDetails.jsx](src/pages/MovieDetails.jsx)

The detail page (`/movie/:id`). Displays everything about a single film.

- Extracts the movie ID from the URL via `useParams`.
- Fetches full movie data (details + credits + videos) via `useMovieDetails`.
- Reads and writes the user's star rating via `useRatings`.
- Computes the blended average rating (TMDB score + user rating) / 2.
- Renders: poster · metadata · `MovieTrailer` · `StarRating` (interactive + read-only display) · synopsis · `CastSection`.
- Handles loading (skeleton), error (with retry + back link), and not-found states.

---

## Components

### [Navbar.jsx](src/components/Navbar.jsx)

Sticky top navigation bar. Contains the **CineRate** logo/home link, a "Browse Movies" link (highlighted when on `/`), and the `ThemeToggle`. Uses `useLocation` to apply the active style.

### [Footer.jsx](src/components/Footer.jsx)

Simple footer with TMDB attribution disclaimer, as required by the TMDB API terms of use.

### [ThemeToggle.jsx](src/components/ThemeToggle.jsx)

A ghost icon button that switches between dark mode (moon icon) and light mode (sun icon). Calls `toggleTheme` from `useTheme`.

### [CursorGlow.jsx](src/components/CursorGlow.jsx)

Purely decorative. Renders a radial amber gradient that follows the cursor using `requestAnimationFrame` with lerp (linear interpolation) smoothing at 12 % per frame. Uses a `ref` to mutate the DOM transform directly, bypassing React's render cycle for maximum performance. Cleaned up on unmount.

### [MovieGrid.jsx](src/components/MovieGrid.jsx)

Wraps the list of `MovieCard` components in a responsive CSS Grid (2 → 5 columns). Shows a "No movies found" empty state with an icon and helper text when the array is empty. Wrapped in `memo` to skip re-renders when the movie list has not changed.

### [MovieCard.jsx](src/components/MovieCard.jsx)

A single movie card displayed in the grid. Links to `/movie/:id`. Displays:
- Poster image (lazy loaded) with a gradient overlay.
- Floating amber rating badge (top-right).
- Title, year, genre.
- Read-only `StarRating`.
- The user's own rating if they have rated it (`You: N★`).

Reads ratings from `useRatings`. Wrapped in `memo`.

### [MovieCardSkeleton.jsx](src/components/MovieCardSkeleton.jsx)

Skeleton placeholder shaped like `MovieCard` shown while movies are loading.

### [MovieGridSkeleton.jsx](src/components/MovieGridSkeleton.jsx)

Renders 10 `MovieCardSkeleton` items in the same grid layout as `MovieGrid`.

### [MovieDetailsSkeleton.jsx](src/components/MovieDetailsSkeleton.jsx)

Full-page skeleton for the `MovieDetails` page — poster placeholder, title, metadata row, trailer block, rating panel, synopsis lines, cast strip.

### [SearchFilter.jsx](src/components/SearchFilter.jsx)

The filter panel on the Home page. Contains:
- Text search input with leading search icon.
- Genre `CustomSelect` (populated from TMDB, shows a `Skeleton` while loading).
- Language `CustomSelect` (static list from `languages.js`).
- Year `CustomSelect` (dynamic list from `years.js`, 1970 → current year, descending).
- Minimum rating `CustomSelect` (static options: Any / 3+ / 3.5+ / 4+ / 4.5+).
- "Clear all" button (visible only when `hasActiveFilters` is true).
- Result count display with inline skeleton while loading.

All selects are `searchable` — the user can type to filter the dropdown list.

### [CustomSelect.jsx](src/components/CustomSelect.jsx)

A fully custom accessible dropdown component used for all filter selects. Features:

- **Portal rendering** — the dropdown menu is rendered via `createPortal` into `document.body`, so it always appears above all other content regardless of `overflow: hidden` parents.
- **Dynamic positioning** — `useLayoutEffect` calculates the trigger's `getBoundingClientRect` and sets the menu's `position: fixed` coordinates. Repositions on scroll and resize.
- **Keyboard navigation** — `ArrowUp/Down`, `Enter`, `Home`, `End`, `Escape`, `Space`.
- **Optional search** — when `searchable={true}`, a search input filters options in real time.
- **ARIA** — `aria-expanded`, `aria-haspopup="listbox"`, `role="option"`, `aria-selected`, `aria-label`.
- **Outside-click** close via `mousedown` listener on `document`.

### [StarRating.jsx](src/components/StarRating.jsx)

Dual-mode star rating component:

- **Interactive mode** (`readOnly={false}`) — hover highlights stars, click fires `onChange(n)`.
- **Read-only mode** (`readOnly={true}`) — displays full, half, or empty stars based on a decimal value.
- Supports three sizes: `sm`, `md`, `lg`.
- Optional `showValue` prop appends the numeric score.
- Wrapped in `memo`.

### [MovieTrailer.jsx](src/components/MovieTrailer.jsx)

Renders the trailer section on the detail page. Has three states:

1. **Key resolved** — embeds `youtube-nocookie.com/embed/:key` in a `<iframe>` (autoplay muted, no related videos, no branding).
2. **Resolving** (YouTube fallback search in progress) — shows a blurred poster with an animated skeleton play button.
3. **No key found** — shows a blurred poster with a clickable play button that opens a YouTube search for `"<Title> <Year> official trailer"` in a new tab.

Trailer key resolution is handled by `useTrailerKey`.

### [CastSection.jsx](src/components/CastSection.jsx)

Horizontally scrollable row of `PersonCard` sub-components showing the director (first) then up to 15 cast members. Each card has a circular profile photo and links to a Google search for that person's name.

### [Pagination.jsx](src/components/Pagination.jsx)

Renders both:
- **Floating prev/next arrow buttons** fixed to the left/right viewport edges (hidden on mobile).
- **Inline page buttons** centered at the bottom of the list.

The visible page buttons use a sliding window algorithm: always shows at most 3 consecutive page numbers centered on the current page. Hidden when `totalPages <= 1`.

### [Skeleton.jsx](src/components/Skeleton.jsx)

Base skeleton primitive. Renders a `div` (or any `as` component) with the `.skeleton` CSS class, which applies a shimmer animation. `aria-hidden="true"` so screen readers skip it.

### [ErrorMessage.jsx](src/components/ErrorMessage.jsx)

Full-width error panel with a warning triangle icon, the error message string, and an optional "Try again" button that calls `onRetry`.

---

## Custom Hooks

### [useMovies.js](src/hooks/useMovies.js)

Fetches a paginated list of movies. Re-runs whenever `filters`, `page`, or `retryKey` change. Applies a 400 ms debounce when the search field is non-empty so the API is not hit on every keystroke. Uses an `active` flag to discard results from stale async calls. Returns `{ movies, totalPages, loading, error }`.

### [useMovieDetails.js](src/hooks/useMovieDetails.js)

Fetches a single movie's full details (metadata + credits + videos) by ID. Uses the same `active` flag pattern to prevent race conditions. Returns `{ movie, loading, error }`.

### [useGenres.js](src/hooks/useGenres.js)

Fetches the TMDB genre list once on mount. The service layer caches the result in a module-level variable (`genreCache`), so the HTTP request only happens once per page lifetime. Returns `{ genres, loading }`.

### [useTrailerKey.js](src/hooks/useTrailerKey.js)

Resolves the YouTube trailer key in priority order:

1. Use `tmdbKey` directly if TMDB already provided one.
2. Otherwise call `searchYoutubeTrailerId` (YouTube Data API → Piped proxy) in the background.

Returns `{ trailerKey, resolving }`. The `resolving` flag lets `MovieTrailer` show its loading state.

### [useMovieFilters.js](src/hooks/useMovieFilters.js)

Context accessor hook for `MovieFiltersContext`. Throws a descriptive error if used outside `MovieFiltersProvider`.

### [useRatings.js](src/hooks/useRatings.js)

Context accessor hook for `RatingContext`. Throws a descriptive error if used outside `RatingProvider`.

### [useTheme.js](src/hooks/useTheme.js)

Context accessor hook for `ThemeContext`. Throws a descriptive error if used outside `ThemeProvider`.

---

## Context / State Management

The app uses three React Contexts, all provided at the root in `App.jsx` in this order: `ThemeProvider` → `RatingProvider` → `MovieFiltersProvider`.

### [ThemeProvider.jsx](src/context/ThemeProvider.jsx)

Manages `"dark"` | `"light"` theme state.

- Initial value read from `localStorage["cinerate-theme"]`, defaulting to `"dark"`.
- On every change, removes the old class from `<html>` and adds `theme-dark` or `theme-light`, then writes to `localStorage`.
- Exposes `{ theme, toggleTheme, isDark }`.

### [RatingProvider.jsx](src/context/RatingProvider.jsx)

Manages user star ratings for all movies.

- State shape: `{ [movieId]: starCount }` — loaded from `localStorage["movie-review-ratings"]` on mount.
- **`setRating(movieId, stars)`** — updates state and writes to `localStorage`.
- **`getUserRating(movieId)`** — returns the stored rating or `0`.
- **`getAverageRating(movieId, voteAverage)`** — if the user has rated the movie, returns `(tmdbScore/2 + userRating) / 2`; otherwise returns `tmdbScore / 2`. Both normalised to a 0–5 scale.

### [MovieFiltersProvider.jsx](src/context/MovieFiltersProvider.jsx)

Manages the search/filter state and current page for the browse view.

- State persisted to `sessionStorage["movie-review-browse-state"]` so filters survive navigating to a detail page and back, but are cleared when the browser tab is closed.
- **`filters`** — `{ search, genre, language, year, minRating }` (defaults in `movieFiltersDefaults.js`).
- **`updateFilter(key, value)`** — updates a single filter key and resets page to 1.
- **`resetFilters()`** — restores all filters to defaults and resets page.
- **`setPage(n)`** — changes the page and persists the new state.
- **`hasActiveFilters`** — memoised boolean; `true` when any filter differs from its default.

---

## Services

### [tmdb.js](src/services/tmdb.js)

All TMDB API communication lives here.

**`tmdbApi`** — an Axios instance configured with:
- `baseURL`: `/api/tmdb` in development (proxied by Vite), `https://api.themoviedb.org/3` in production.
- `Authorization: Bearer <token>` header when the access token env var is set.
- `api_key` query param fallback.

**`fetchGenres()`** — fetches `/genre/movie/list`. Result is cached in a module-level `genreCache` variable for the lifetime of the page.

**`fetchMovies(filters, page)`** — the main list endpoint.
- If `filters.search` is non-empty → uses `/search/movie` then applies client-side genre/language/year/rating filters on the results.
- Otherwise → uses `/discover/movie` with server-side filter params (`with_genres`, `with_original_language`, `primary_release_year`, `vote_average.gte`).
- Returns `{ movies: MappedMovie[], totalPages }`.

**`fetchMovieById(id)`** — fires three parallel requests via `Promise.all`:
- `/movie/:id` — base details
- `/movie/:id/credits` — cast and crew
- `/movie/:id/videos` — trailers/teasers (errors silently caught)
  
Applies `pickTrailerKey` to select the best YouTube video in priority order: official trailer → unofficial trailer → official teaser → unofficial teaser → featurette → clip.

Returns a normalised movie object: `{ id, title, year, genre, poster, plot, director, castMembers, runtime, voteAverage, trailerKey }`.

**`mapListMovie(movie, genreMap)`** — maps a raw TMDB list item to the app's `MappedMovie` shape.

**`getPosterUrl(path)`** — prepends `https://image.tmdb.org/t/p/w500`; returns a placeholder SVG URL when no path is provided.

**`getProfileUrl(path, name)`** — prepends `https://image.tmdb.org/t/p/w185`; falls back to a `ui-avatars.com` generated avatar.

**`getPersonSearchUrl(name)`** — returns a Google search URL for the person's name.

### [youtubeTrailer.js](src/services/youtubeTrailer.js)

YouTube trailer search used as a fallback when TMDB provides no trailer key.

**`searchYoutubeTrailerId(title, year)`** — tries two strategies in order:
1. **YouTube Data API v3** (`searchViaYoutubeApi`) — uses `VITE_YOUTUBE_API_KEY`; picks the first result whose title contains "trailer", "teaser", or "official".
2. **Piped proxy** (`searchViaDevProxy`) — only active in development (`import.meta.env.DEV`). Hits `/api/youtube-search/search` (proxied to `pipedapi.kavin.rocks`) with a 4-second abort timeout. Parses `videoId` from various Piped response shapes.

**`getYoutubeSearchUrl(title, year)`** — builds a `youtube.com/results?search_query=...` URL used as the fallback link when no video ID is found.

---

## Utilities

### [isAbortError.js](src/utils/isAbortError.js)

Detects whether a caught error is an Axios cancellation or a browser `AbortController` abort. Used in hooks to silently ignore errors from stale async operations.

```js
export const isAbortError = (err) =>
  err?.code === "ERR_CANCELED" ||
  err?.name === "CanceledError" ||
  err?.name === "AbortError" ||
  /aborted|canceled/i.test(err?.message ?? "");
```

### [languages.js](src/utils/languages.js)

Static array of `{ value, label }` options for the language filter dropdown. Covers 24 ISO 639-1 language codes supported by TMDB's `with_original_language` parameter (English, Tamil, Hindi, Telugu, Malayalam, Kannada, Marathi, Bengali, Punjabi, Gujarati, Japanese, Korean, Chinese, French, German, Spanish, Italian, Portuguese, Russian, Arabic, Thai, Indonesian, Turkish, Vietnamese).

### [years.js](src/utils/years.js)

Dynamically generates an array of years from the current year down to 1970 using `Array.from`. Used to populate the year filter dropdown.

---

## Styling System

Styling is handled by **Tailwind CSS v3** extended with **CSS custom properties** defined in `index.css`.

### Theme tokens (CSS variables)

Two themes are declared on `html.theme-dark` and `html.theme-light` selectors:

| Token | Purpose |
|---|---|
| `--color-cinema-950/900/800/700` | Background scale from darkest to lightest panel |
| `--text-heading/body/muted/subtle` | Text colour hierarchy |
| `--body-gradient-1/2` | Radial gradient overlays on `<body>` |
| `--skeleton-base/shine` | Shimmer animation colours |
| `--shadow-card/panel/nav` | Elevation shadows |
| `--scrollbar-thumb` | Custom scrollbar colour |
| `--input-bg` | Form element background |

The accent colour `#f59e0b` (amber-500) is defined in `tailwind.config.js` as `cinema-accent` and is used for highlights, star ratings, and interactive elements throughout.

### CSS component classes (`@layer components`)

| Class | Usage |
|---|---|
| `.surface-nav` | Sticky navbar with frosted glass effect |
| `.surface-card` | Movie card container |
| `.surface-panel` | Filter panel and rating panel |
| `.surface-poster` | Rounded poster image wrapper |
| `.input-themed` | Search text input |
| `.select-trigger` | CustomSelect button |
| `.select-dropdown-portal` | CustomSelect floating menu |
| `.cursor-glow` | Amber radial glow div |
| `.skeleton` | Shimmer loading placeholder |
| `.nav-link` / `.nav-link-active` / `.nav-link-inactive` | Navbar links |
| `.btn-ghost` | Ghost button (theme toggle, clear filters) |

### Animations

- `animate-fade-in` — opacity 0 → 1 (defined via Tailwind config or App.css)
- `animate-slide-up` — subtle upward slide-in (applied to movie cards)
- `skeleton-shimmer` — 1.5 s looping gradient sweep

---

## API Attribution

This product uses the [TMDB API](https://www.themoviedb.org/) but is not endorsed or certified by TMDB.

Trailer search uses the [YouTube Data API v3](https://developers.google.com/youtube/v3) and [Piped API](https://piped.kavin.rocks) (development only).
