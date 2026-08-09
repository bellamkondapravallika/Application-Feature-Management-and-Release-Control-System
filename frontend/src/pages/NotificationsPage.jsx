import { useTranslation } from 'react-i18next';

const NotificationsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
      <h2 className="text-2xl font-semibold text-white">{t('notifications.title')}</h2>
      <p className="mt-3 text-slate-400">{t('notifications.description')}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <h3 className="text-lg font-semibold text-white">{t('notifications.emailAlerts')}</h3>
          <p className="mt-2 text-slate-400">{t('notifications.emailAlertsDescription')}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <h3 className="text-lg font-semibold text-white">{t('notifications.pushAlerts')}</h3>
          <p className="mt-2 text-slate-400">{t('notifications.pushAlertsDescription')}</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
