import axios from "axios";
import { isAbortError } from "../utils/isAbortError";

const SEARCH_TIMEOUT_MS = 4000;

export const getYoutubeSearchUrl = (title, year) => {
  const query = buildTrailerQuery(title, year);
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
};

const buildTrailerQuery = (title, year) =>
  `${title} ${year && year !== "N/A" ? year : ""} official trailer`.trim();

const fetchWithTimeout = async (url) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SEARCH_TIMEOUT_MS);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

const parsePipedVideoId = (item) => {
  if (item?.videoId) return item.videoId;
  if (typeof item?.id === "string" && /^[\w-]{11}$/.test(item.id)) return item.id;

  const url = item?.url ?? "";
  const fromQuery = url.match(/[?&]v=([\w-]{11})/);
  if (fromQuery) return fromQuery[1];

  const fromPath = url.match(/\/watch\/([\w-]{11})/);
  return fromPath?.[1] ?? null;
};

const pickFromYoutubeApiResults = (items) => {
  const trailer =
    items.find((item) => /trailer|teaser|official/i.test(item.snippet?.title ?? "")) ||
    items[0];
  return trailer?.id?.videoId ?? null;
};

const searchViaYoutubeApi = async (query) => {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey) return null;

  try {
    const { data } = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: "snippet",
        q: query,
        type: "video",
        maxResults: 5,
        key: apiKey,
      },
      timeout: SEARCH_TIMEOUT_MS,
    });

    return pickFromYoutubeApiResults(data.items ?? []);
  } catch {
    return null;
  }
};

/** Dev-only: proxied Piped search (avoids CORS). Skipped in production builds. */
const searchViaDevProxy = async (query) => {
  if (!import.meta.env.DEV) return null;

  try {
    const path = `/api/youtube-search/search?q=${encodeURIComponent(query)}&filter=videos`;
    const res = await fetchWithTimeout(path);
    if (!res.ok) return null;

    const data = await res.json();
    for (const item of data.items ?? []) {
      const id = parsePipedVideoId(item);
      if (id) return id;
    }
  } catch (err) {
    if (isAbortError(err)) return null;
  }

  return null;
};

/** Resolve a playable YouTube video id when TMDB has no trailer. Never throws. */
export const searchYoutubeTrailerId = async (title, year) => {
  const query = buildTrailerQuery(title, year);

  const fromApi = await searchViaYoutubeApi(query);
  if (fromApi) return fromApi;

  return searchViaDevProxy(query);
};
