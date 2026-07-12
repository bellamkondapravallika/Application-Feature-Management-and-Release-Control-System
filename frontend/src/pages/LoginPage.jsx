import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, LoaderCircle, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../components/ToastProvider';
import { getErrorMessage, login } from '../services/api';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      addToast('Please enter both your email and password.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await login(formData);
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user_email', formData.username);
      addToast('Signed in successfully', 'success');
      navigate('/dashboard');
    } catch (error) {
      addToast(getErrorMessage(error, 'Unable to sign in right now.'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-2xl backdrop-blur-xl"
      >
        <div className="grid lg:grid-cols-2">
          {/* Left Branding Section */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-cyan-500/20 to-violet-500/20 p-12"
          >
            <div>
              <div className="mb-6 inline-flex rounded-2xl bg-white/10 p-3 text-cyan-300">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold text-white">Application Feature Management</h2>
              <p className="mt-3 text-slate-300 text-lg">
                Release Control System for modern teams.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-sm text-slate-300 space-y-3">
              <p className="font-semibold text-white text-lg">Feature Highlights</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Feature Flag Management</li>
                <li>Environment Management</li>
                <li>Secure Authentication</li>
                <li>Audit Logs</li>
              </ul>
            </div>
          </motion.div>

          {/* Right Login Section */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="p-8 sm:p-12 flex flex-col justify-center"
          >
            <h1 className="text-3xl font-bold text-white">Sign in</h1>
            <p className="mt-2 text-sm text-slate-400">Access your feature flag workspace</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Email Field */}
              <div>
                <label className="mb-2 block text-sm text-slate-300">Email</label>
                <div className="flex items-center rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 focus-within:ring-2 focus-within:ring-cyan-500">
                  <Mail className="h-5 w-5 text-slate-400 mr-3" />
                  <input
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full bg-transparent outline-none text-white placeholder-slate-500"
                    placeholder="admin@example.com"
                    type="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="mb-2 block text-sm text-slate-300">Password</label>
                <div className="flex items-center rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 focus-within:ring-2 focus-within:ring-cyan-500">
                  <Lock className="h-5 w-5 text-slate-400 mr-3" />
                  <input
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full bg-transparent outline-none text-white placeholder-slate-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-2 text-slate-400 hover:text-cyan-400 transition"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-3 font-semibold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : null}
                {submitting ? 'Signing in...' : 'Sign In'}
              </motion.button>
            </form>

            <p className="mt-6 text-sm text-slate-400">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-medium text-cyan-400 hover:text-cyan-300 transition">
                Create one
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
