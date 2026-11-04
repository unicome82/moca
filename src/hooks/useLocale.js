import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { saveLocale } from "../i18n/locale.js";

export default function useLocale() {
  const { i18n } = useTranslation();

  const changeLocale = useCallback(
    (locale) => {
      if (locale === i18n.language) return;
      saveLocale(locale);
      i18n.changeLanguage(locale);
    },
    [i18n],
  );

  return { locale: i18n.resolvedLanguage, selectedLocale: i18n.language, changeLocale };
}
