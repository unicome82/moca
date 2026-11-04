import {
  icebreakerCards,
  solutionCards,
} from "./cardDecks.js";
import { liarCategoriesWithWords } from "./liarCategories.js";
import { balanceCards } from "./balanceCards.js";

// Deck titles and descriptions live in the locale files under decks.{id}.
export const decks = [
  {
    id: "ice",
    en: "ICE BREAKING",
    type: "icebreak",
    icon: "ac_unit",
    count: icebreakerCards.length,
  },
  {
    id: "solution",
    en: "SOLUTION CARDS",
    type: "solution",
    icon: "menu_book",
    count: solutionCards.length,
  },
  {
    id: "balance",
    en: "BALANCE GAME",
    type: "balance",
    icon: "balance",
    count: balanceCards.length,
  },
  {
    id: "liar",
    en: "LIAR GAME",
    type: "liar",
    icon: "theater_comedy",
    count: liarCategoriesWithWords.length,
  },
];

export const cardCollections = {
  ice: icebreakerCards,
  solution: solutionCards,
  balance: balanceCards,
};

export { liarCategoriesWithWords as liarCategories };
