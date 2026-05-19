import { FaExclamationTriangle } from "react-icons/fa";

const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-red-900/50 bg-red-950/20 py-16 text-center animate-fade-in">
    <FaExclamationTriangle className="mb-4 text-4xl text-red-400" />
    <h3 className="text-lg font-semibold text-red-300">Something went wrong</h3>
    <p className="mt-2 max-w-md text-sm text-gray-400">{message}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 rounded-xl bg-cinema-accent px-5 py-2.5 text-sm font-semibold text-cinema-950 transition hover:bg-cinema-accent-hover"
      >
        Try again
      </button>
    )}
  </div>
);

export default ErrorMessage;
