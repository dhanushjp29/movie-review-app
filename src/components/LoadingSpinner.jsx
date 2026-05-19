const LoadingSpinner = ({ label = "Loading movies..." }) => (
  <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-cinema-700 border-t-cinema-accent" />
    <p className="mt-4 text-sm text-gray-400">{label}</p>
  </div>
);

export default LoadingSpinner;
