import { useEffect, useState } from "react";
import useCards from "./useCards.js";
import { pickUnseenIndex, rememberCard } from "../utils/cardHistory.js";


// Card state for the draw decks (ice, solution, balance).
export default function useCardDraw(screen) {
  const { locale, collections } = useCards();
  const collection = collections[screen];
  const [cardIndex, setCardIndex] = useState(() =>
    collection ? pickUnseenIndex(locale, screen, collection) : 0,
  );
  const [revealStage, setRevealStage] = useState("hidden");

  useEffect(() => {
    setRevealStage("hidden");
    // A new screen or a new language's cards start from a fresh hidden card.
    if (collection) setCardIndex(pickUnseenIndex(locale, screen, collection));
  }, [screen, locale, collection]);

  const revealCard = () => {
    if (collection?.[cardIndex]) rememberCard(locale, screen, collection[cardIndex].id);
    setRevealStage("revealed");
  };

  const replaceCard = () => {
    if (!collection) return;
    setCardIndex((current) => pickUnseenIndex(locale, screen, collection, current));
    setRevealStage("replacing");
  };

  const finishReplacingCard = () => setRevealStage("hidden");

  return {
    isDrawScreen: Boolean(collection),
    cardIndex,
    revealStage,
    revealCard,
    replaceCard,
    finishReplacingCard,
  };
}
