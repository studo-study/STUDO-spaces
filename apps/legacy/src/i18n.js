import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

export const DEFAULT_LANGUAGE = 'en';

const getLanguageFromPath = () => {
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean);
  const firstSegment = segments[0];

  const supportedCodes = SUPPORTED_LANGUAGES.map(l => l.code);
  if (supportedCodes.includes(firstSegment)) {
    return firstSegment;
  }
  return null;
};

// Custom path detector
const pathDetector = {
  name: 'path',
  lookup() {
    return getLanguageFromPath();
  },
  cacheUserLanguage() {
    // Don't cache - always use URL
  }
};

const languageDetector = new LanguageDetector();
languageDetector.addDetector(pathDetector);

i18n
  .use(HttpBackend)
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES.map(l => l.code),
    react: {
      useSuspense: true,
    },
    interpolation: {
      escapeValue: false
    },
    detection: {
      // Priority: URL path first, then localStorage, then browser
      order: ['path', 'localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupFromPathIndex: 0,
    },
  });

// Helper to get path without language prefix
export const getPathWithoutLang = (path) => {
  const segments = path.split('/').filter(Boolean);
  const supportedCodes = SUPPORTED_LANGUAGES.map(l => l.code);

  if (supportedCodes.includes(segments[0])) {
    return '/' + segments.slice(1).join('/') || '/';
  }
  return path;
};

// Helper to add language prefix to path
export const getLocalizedPath = (path, lang = i18n.language) => {
  const cleanPath = getPathWithoutLang(path);
  if (lang === DEFAULT_LANGUAGE) {
    return cleanPath;
  }
  return `/${lang}${cleanPath === '/' ? '' : cleanPath}`;
};

// Change language and update URL
export const changeLanguage = (lang, navigate) => {
  const currentPath = getPathWithoutLang(window.location.pathname);
  i18n.changeLanguage(lang);

  const newPath = getLocalizedPath(currentPath, lang);
  navigate(newPath, { replace: true });
};

export default i18n;