import { defaultLocale } from "../../config/appConfig.js";
import * as ko from "./ko/index.js";

// Each locale folder exports the same names: ice, solution, balance, liar.
// Cards are written for each language rather than translated line by line.
const sources = { ko };

const MAX_LIAR_WORDS = 100;

function buildCards({ ice, solution, balance, liar }) {
  return {
    // Draw decks keyed by deck id (matches the screen name).
    collections: { ice, solution, balance },
    liarCategories: liar.map((category) => ({
      ...category,
      words: [...new Set(category.words)].slice(0, MAX_LIAR_WORDS),
    })),
  };
}

const cardsByLocale = Object.fromEntries(
  Object.entries(sources).map(([locale, source]) => [locale, buildCards(source)]),
);

export function getCards(locale) {
  return cardsByLocale[locale] ?? cardsByLocale[defaultLocale];
}
