import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n.use(HttpBackend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		debug: false,
		fallbackLng: 'en',
		react: {
			useSuspense: true,  // <-- dit
		},
		supportedLngs: [
			'en',
			'nl-BE',
			'nl-NL',
			'fr-FR-BE',
			'fr-FR-FR',
			'de',
			'hi',
			'es',
			'bn',
			'ru',
			'ja',
			'zh',
			'ko',
			'pt'
		],
		interpolation: { escapeValue: false },
		detection: {
			order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
			caches: [],
		},
	});

export default i18n;
//localStorage.setItem('i18nextLng', 'en');
//localStorage.setItem('i18nextLng', 'nl-NL');