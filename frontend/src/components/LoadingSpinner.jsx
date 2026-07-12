const LoadingSpinner = ({ label = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-slate-300 shadow-lg">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500/30 border-t-cyan-400" />
    <p className="text-sm">{label}</p>
  </div>
);

export default LoadingSpinner;
