import { ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle,_rgba(34,211,238,0.16),_transparent_55%),linear-gradient(135deg,_#020617,_#111827)] p-4">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-10 text-center shadow-2xl shadow-cyan-950/30">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400">
          <Compass className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-semibold">404</h1>
        <p className="mt-3 text-slate-400">The page you are looking for could not be found.</p>
        <Link to="/dashboard" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950">
          <ArrowLeft className="h-5 w-5" /> Back to dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
