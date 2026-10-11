import {
  icebreakerCards,
  liarCategoriesWithWords,
  solutionCards,
} from "./cardDecks.js";

export const decks = [
  {
    id: "ice",
    title: "아이스 브레이킹",
    en: "ICE BREAKING",
    copy: "처음 만난 사이에도 편하게 시작하는 질문",
    type: "icebreak",
    icon: "ac_unit",
    count: icebreakerCards.length,
  },
  {
    id: "solution",
    title: "해결책",
    en: "SOLUTION CARDS",
    copy: "막막할 때 바로 해볼 짧은 해결책",
    type: "solution",
    icon: "lightbulb",
    count: solutionCards.length,
  },
  {
    id: "liar",
    title: "라이어게임",
    en: "LIAR GAME",
    copy: "키워드를 숨기고 라이어를 찾아보세요",
    type: "liar",
    icon: "visibility",
    count: liarCategoriesWithWords.length,
  },
];

export const cardCollections = {
  ice: icebreakerCards,
  solution: solutionCards,
};

export { liarCategoriesWithWords as liarCategories };
