import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Flag,
  Layers3,
  ToggleLeft,
  FileText,
  User,
  LogOut,
  Menu,
  Users,
  UserCheck,
  Bell,
  Settings,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { to: '/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
  { to: '/feature-flags', labelKey: 'featureFlags', icon: Flag },
  { to: '/environments', labelKey: 'environments', icon: Layers3 },
  { to: '/overrides', labelKey: 'overrides', icon: ToggleLeft },
  { to: '/audit-logs', labelKey: 'auditLogs', icon: FileText },
  { to: '/settings', labelKey: 'settings', icon: Settings },
  { to: '/notifications', labelKey: 'notifications', icon: Bell },
  { to: '/group-management', labelKey: 'groupManagement', icon: Users },
  { to: '/group-members', labelKey: 'groupMembers', icon: Users },
  { to: '/targeting-rules', labelKey: 'targetingRules', icon: UserCheck },
  { to: '/sdk-documentation', labelKey: 'sdkDocumentation', icon: FileText },
  { to: '/integration-examples', labelKey: 'integrationExamples', icon: FileText },
];

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const userEmail = useMemo(
    () => localStorage.getItem('user_email') || 'Authenticated user',
    [location.pathname]
  );

  const profileDetails = useMemo(() => {
    try {
      const stored = localStorage.getItem('profile_details');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, [location.pathname]);

  const displayName = useMemo(() => {
    if (profileDetails?.displayName) {
      return profileDetails.displayName;
    }
    if (userEmail && userEmail.includes('@')) {
      return userEmail.split('@')[0];
    }
    return userEmail;
  }, [profileDetails, userEmail]);

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('profile_details');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="flex min-h-screen">
        <aside
         className={`fixed inset-y-0 left-0 z-30 flex h-screen w-72 flex-col overflow-hidden border-r border-slate-200 bg-white/95 p-6 backdrop-blur-xl transition-transform dark:border-slate-800 dark:bg-slate-900/95 lg:translate-x-0 ${
  mobileOpen ? "translate-x-0" : "-translate-x-full"
}`}
        >
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-500/20 p-3 text-cyan-400">
              <Flag className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xl font-semibold">{t('dashboard.title')}</p>
              <p className="text-sm text-slate-400">{t('dashboard.overview')}</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto">
            {navItems.map(({ to, labelKey, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                <Icon className="h-5 w-5" />
                {t(`nav.${labelKey}`)}
              </NavLink>
            ))}
          </nav>

          <div className="space-y-2 border-t border-slate-800 pt-4">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <User className="h-5 w-5" />
              {t('nav.profile')}
            </NavLink>

            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-800 px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800"
            >
              <LogOut className="h-5 w-5" />
              {t('nav.logout')}
            </button>
          </div>
        </aside>

        <div className="flex-1 lg:ml-72">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
            <div className="flex items-center justify-between">
              <button
                className="rounded-xl border border-slate-800 p-2 lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-sm text-slate-400">{t('dashboard.overview')}</p>
                <h1 className="text-lg font-semibold">{t('dashboard.title')}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-3 py-2 text-slate-700 sm:flex dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <button
                    type="button"
                    onClick={() => navigate('/notifications')}
                    aria-label={t('notifications.title')}
                    className="rounded-xl p-2 transition hover:bg-slate-200 dark:hover:bg-slate-800"
                  >
                    <Bell className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/settings')}
                    aria-label={t('settings.title')}
                    className="rounded-xl p-2 transition hover:bg-slate-200 dark:hover:bg-slate-800"
                  >
                    <Settings className="h-5 w-5" />
                  </button>
                </div>
                <LanguageSwitcher />
                <ThemeToggle />
                <div className="hidden items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 sm:flex">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500" />
                  <div>
                    <p className="text-sm font-medium">{displayName}</p>
                    <p className="text-xs text-slate-400">{userEmail}</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;