import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'hi', label: 'हिंदी' },
];

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  return (
    <div className="rounded-xl border border-slate-600 bg-slate-950/80 px-3 py-2 text-sm text-white dark:border-slate-400 dark:bg-slate-800/90 dark:text-white">
      <label htmlFor="language-switcher" className="sr-only">
        {t('common.selectLanguage')}
      </label>
      <select
        id="language-switcher"
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="w-full min-w-[140px] bg-slate-950/90 text-sm text-white outline-none ring-1 ring-slate-700 focus:ring-2 focus:ring-cyan-500 dark:bg-slate-800 dark:ring-slate-600"
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
