import { useTranslation } from "react-i18next";
import { getCards } from "../data/cards/index.js";

// Cards for the current language.
export default function useCards() {
  const { i18n } = useTranslation();
  return getCards(i18n.resolvedLanguage);
}
