import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-xl border border-slate-700 bg-slate-900/70 p-2 text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 dark:border-slate-600 dark:bg-slate-800/90 dark:text-slate-100"
      aria-label={isDark ? t('common.lightMode') : t('common.darkMode')}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
};

export default ThemeToggle;
