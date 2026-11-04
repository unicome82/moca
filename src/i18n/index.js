import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { defaultLocale } from "../config/appConfig.js";
import ko from "../locales/ko.json";

i18n.use(initReactI18next).init({
  resources: { ko: { translation: ko } },
  lng: defaultLocale,
  fallbackLng: defaultLocale,
  // React already escapes rendered text.
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
