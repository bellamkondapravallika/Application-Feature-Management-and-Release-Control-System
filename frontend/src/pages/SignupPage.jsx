import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import { useToast } from '../components/ToastProvider';
import { getErrorMessage, signup } from '../services/api';

const SignupPage = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'Admin' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      addToast('Please complete all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      addToast('Account created successfully. You can sign in now.', 'success');
      navigate('/login');
    } catch (error) {
      addToast(getErrorMessage(error, 'Unable to create your account.'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.16),_transparent_45%),linear-gradient(135deg,_#020617,_#111827)] p-4">
      <div className="w-full max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-violet-950/30 backdrop-blur-xl sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold">Create your account</h1>
          <p className="mt-2 text-slate-400">Start orchestrating flagship releases with confidence.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Full Name</label>
            <input
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3"
              placeholder="Alex Morgan"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Email</label>
            <input
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              type="email"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3"
              placeholder="alex@example.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Password</label>
            <input
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              type="password"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3"
            >
              <option>Admin</option>
              <option>Developer</option>
              <option>Viewer</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <button disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-3 font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-70">
              {submitting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : null}
              {submitting ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account? <Link to="/login" className="font-medium text-cyan-400">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
