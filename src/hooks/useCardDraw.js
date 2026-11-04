import { useEffect, useState } from "react";
import useCards from "./useCards.js";
import { pickUnseenIndex, rememberCard } from "../utils/cardHistory.js";


// Card state for the draw decks (ice, solution, balance).
export default function useCardDraw(screen) {
  const { collections } = useCards();
  const collection = collections[screen];
  const [cardIndex, setCardIndex] = useState(() =>
    collection ? pickUnseenIndex(screen, collection) : 0,
  );
  const [revealStage, setRevealStage] = useState("hidden");

  useEffect(() => {
    setRevealStage("hidden");
    if (collection) setCardIndex(pickUnseenIndex(screen, collection));
  }, [screen, collection]);

  const revealCard = () => {
    if (collection?.[cardIndex]) rememberCard(screen, collection[cardIndex].id);
    setRevealStage("revealed");
  };

  const replaceCard = () => {
    if (!collection) return;
    setCardIndex((current) => pickUnseenIndex(screen, collection, current));
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
