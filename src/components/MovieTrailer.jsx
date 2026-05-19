import { FaExternalLinkAlt, FaPlayCircle } from "react-icons/fa";
import { useTrailerKey } from "../hooks/useTrailerKey";
import { getYoutubeSearchUrl } from "../services/youtubeTrailer";
import Skeleton from "./Skeleton";

const buildEmbedSrc = (trailerKey) =>
  `https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1`;

const MovieTrailer = ({ trailerKey: tmdbTrailerKey, title, year, poster }) => {
  const { trailerKey, resolving } = useTrailerKey(tmdbTrailerKey, title, year);

  if (!title?.trim()) return null;

  const searchUrl = getYoutubeSearchUrl(title.trim(), year);

  return (
    <section className="mb-6">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-heading">
        <FaPlayCircle className="text-cinema-accent" />
        Trailer
      </h2>

      {trailerKey ? (
        <div className="relative aspect-video w-full max-w-full overflow-hidden rounded-xl border border-cinema-700 bg-black shadow-lg">
          <iframe
            key={trailerKey}
            src={buildEmbedSrc(trailerKey)}
            title={`${title} trailer`}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      ) : resolving ? (
        <div className="relative aspect-video w-full max-w-full overflow-hidden rounded-xl border border-cinema-700 bg-cinema-800">
          {poster && (
            <img
              src={poster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Skeleton className="h-14 w-14 rounded-full" />
            <Skeleton className="h-4 w-40 rounded-md" />
          </div>
        </div>
      ) : (
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex aspect-video w-full max-w-full items-center justify-center overflow-hidden rounded-xl border border-cinema-700 bg-cinema-800 shadow-lg"
        >
          {poster && (
            <img
              src={poster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-300 group-hover:scale-105 group-hover:opacity-50"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
          <div className="relative z-10 flex flex-col items-center gap-3 px-4 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cinema-accent text-cinema-950 shadow-lg transition group-hover:scale-110">
              <FaPlayCircle className="text-3xl" />
            </span>
            <span className="text-base font-semibold text-heading">
              Watch trailer on YouTube
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-cinema-accent">
              Open search
              <FaExternalLinkAlt className="text-xs" />
            </span>
          </div>
        </a>
      )}
    </section>
  );
};

export default MovieTrailer;
