import { useEffect, useState } from "react";
import { cardCollections } from "../data/decks.js";
import { pickUnseenIndex, rememberCard } from "../utils/cardHistory.js";

const initialIndex = (screen) => {
  const collection = cardCollections[screen];
  return collection ? pickUnseenIndex(screen, collection) : 0;
};

// Card state for the draw decks (ice, solution, balance).
export default function useCardDraw(screen) {
  const [cardIndex, setCardIndex] = useState(() => initialIndex(screen));
  const [revealStage, setRevealStage] = useState("hidden");
  const collection = cardCollections[screen];

  useEffect(() => {
    setRevealStage("hidden");
    const nextCollection = cardCollections[screen];
    if (nextCollection) setCardIndex(pickUnseenIndex(screen, nextCollection));
  }, [screen]);

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
