import { useTranslation } from "react-i18next";
import { getCards } from "../data/cards/index.js";

// Cards for the current language, plus that language for history keys.
export default function useCards() {
  const { i18n } = useTranslation();
  const locale = i18n.resolvedLanguage;
  return { locale, ...getCards(locale) };
}
