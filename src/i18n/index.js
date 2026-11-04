import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { defaultLocale, enabledLocales } from "../config/appConfig.js";
import ko from "../locales/ko.json";
import { detectLocale } from "./locale.js";

const resources = { ko: { translation: ko } };

const syncDocumentLanguage = () => {
  document.documentElement.lang = i18n.resolvedLanguage;
};
i18n.on("languageChanged", syncDocumentLanguage);

i18n.use(initReactI18next).init({
  resources,
  lng: detectLocale(),
  fallbackLng: defaultLocale,
  supportedLngs: enabledLocales,
  // React already escapes rendered text.
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

if (import.meta.env.DEV) {
  const missing = enabledLocales.filter((locale) => !resources[locale]);
  if (missing.length) console.warn(`Enabled locales without UI text: ${missing.join(", ")}`);
}

export default i18n;
