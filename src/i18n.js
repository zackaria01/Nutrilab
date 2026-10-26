import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import ar from './locales/ar.json'
import en from './locales/en.json'
import fr from './locales/fr.json'

export const LOCALES = ['en', 'fr', 'ar']

void i18n.use(LanguageDetector).use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    ar: { translation: ar },
  },
  fallbackLng: 'en',
  supportedLngs: LOCALES,
  load: 'languageOnly',
  interpolation: { escapeValue: false },
  detection: {
    order: ['localStorage', 'navigator'],
    lookupLocalStorage: 'nutrilab.locale',
    caches: ['localStorage'],
  },
  returnNull: false,
})

export default i18n
