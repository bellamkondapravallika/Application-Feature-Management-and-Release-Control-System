import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import te from './locales/te.json';
import ta from './locales/ta.json';
import kn from './locales/kn.json';
import hi from './locales/hi.json';

const STORAGE_KEY = 'app_language';
const supportedLanguages = ['en', 'te', 'ta', 'kn', 'hi'];

const getSavedLanguage = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && supportedLanguages.includes(saved)) {
    return saved;
  }

  const browserLang = navigator.language.split('-')[0];
  if (supportedLanguages.includes(browserLang)) {
    return browserLang;
  }

  return 'en';
};

const resources = {
  en: { translation: en },
  te: { translation: te },
  ta: { translation: ta },
  kn: { translation: kn },
  hi: { translation: hi },
};

i18n.use(initReactI18next).init({
  resources,
  lng: getSavedLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

i18n.on('languageChanged', (lng) => {
  if (supportedLanguages.includes(lng)) {
    localStorage.setItem(STORAGE_KEY, lng);
  }
});

export default i18n;
