import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const SETTINGS_STORAGE_KEY = 'app_settings';

const defaultSettings = {
  themeMode: 'system',
  emailAlerts: true,
  pushAlerts: true,
  autoUpdates: true,
};

const SettingsPage = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (settings.themeMode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    } else {
      setTheme(settings.themeMode);
    }
  }, [settings.themeMode, setTheme]);

  const handleToggle = (field) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = () => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  };

  const themeOptions = [
    { value: 'system', label: t('settings.themeSystem') },
    { value: 'light', label: t('settings.themeLight') },
    { value: 'dark', label: t('settings.themeDark') },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">{t('settings.title')}</h2>
            <p className="mt-2 text-slate-400">{t('settings.description')}</p>
          </div>
          <div className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-300">
            {t('settings.version')}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white">{t('settings.displaySettings')}</h3>
          <p className="mt-2 text-slate-400">{t('settings.displaySettingsDescription')}</p>

          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-300">
              {t('settings.themeMode')}
            </label>
            <select
              value={settings.themeMode}
              onChange={(e) => setSettings((prev) => ({ ...prev, themeMode: e.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {themeOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-slate-900 text-white">
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-sm text-slate-500">{t('settings.themeModeDescription')}</p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white">{t('settings.notifications')}</h3>
          <p className="mt-2 text-slate-400">{t('settings.notificationsDescription')}</p>

          <div className="mt-6 space-y-4">
            <button
              type="button"
              onClick={() => handleToggle('emailAlerts')}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-4 text-left"
            >
              <div>
                <p className="font-medium text-white">{t('settings.emailAlerts')}</p>
                <p className="mt-1 text-sm text-slate-500">{t('settings.emailAlertsDescription')}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm ${settings.emailAlerts ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                {settings.emailAlerts ? t('settings.enabled') : t('settings.disabled')}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleToggle('pushAlerts')}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-4 text-left"
            >
              <div>
                <p className="font-medium text-white">{t('settings.pushAlerts')}</p>
                <p className="mt-1 text-sm text-slate-500">{t('settings.pushAlertsDescription')}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm ${settings.pushAlerts ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                {settings.pushAlerts ? t('settings.enabled') : t('settings.disabled')}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleToggle('autoUpdates')}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-4 text-left"
            >
              <div>
                <p className="font-medium text-white">{t('settings.autoUpdates')}</p>
                <p className="mt-1 text-sm text-slate-500">{t('settings.autoUpdatesDescription')}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm ${settings.autoUpdates ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                {settings.autoUpdates ? t('settings.enabled') : t('settings.disabled')}
              </span>
            </button>
          </div>
        </section>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white">{t('settings.security')}</h3>
            <p className="mt-2 text-slate-400">{t('settings.securityDescription')}</p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            {t('settings.saveButton')}
          </button>
        </div>
        {saved && <p className="mt-4 text-sm text-emerald-300">{t('settings.saveSuccess')}</p>}
      </div>
    </div>
  );
};

export default SettingsPage;
