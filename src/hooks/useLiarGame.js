import { useEffect, useRef, useState } from "react";
import { liarStages, storageKeys } from "../config/appConfig.js";
import useCards from "./useCards.js";
import { readJson, removeStoredValue, writeJson } from "../utils/browserStorage.js";
import { pickUnseenIndex, rememberCard } from "../utils/cardHistory.js";
import { readScreen } from "./useScreenNavigation.js";

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 12;
const REVEALED_STAGES = ["shown", "handoff", "liar-reveal", "keyword"];

const randomIndex = (length) => Math.floor(Math.random() * length);
const isIndexBelow = (value, limit) => Number.isInteger(value) && value >= 0 && value < limit;

function readLiarSession(liarCategories) {
  const saved = readJson("sessionStorage", storageKeys.liarSession, null);
  if (!saved) return null;

  const valid =
    liarCategories.some(({ id }) => id === saved.categoryId) &&
    Number.isInteger(saved.playerCount) &&
    saved.playerCount >= MIN_PLAYERS &&
    saved.playerCount <= MAX_PLAYERS &&
    typeof saved.keyword === "string" &&
    saved.keyword !== "" &&
    isIndexBelow(saved.liarIndex, saved.playerCount) &&
    isIndexBelow(saved.playerIndex, saved.playerCount) &&
    liarStages.includes(saved.stage);

  return valid ? saved : null;
}

const clearSession = () => removeStoredValue("sessionStorage", storageKeys.liarSession);

export default function useLiarGame(screen, navigate) {
  const { locale, liarCategories } = useCards();
  const [initialSession] = useState(() =>
    readScreen() === "liar-game" ? readLiarSession(liarCategories) : null,
  );
  const [playerCount, setPlayerCount] = useState(initialSession?.playerCount ?? 4);
  const [categoryId, setCategoryId] = useState(initialSession?.categoryId ?? liarCategories[0].id);
  const [keyword, setKeyword] = useState(initialSession?.keyword ?? "");
  const [liarIndex, setLiarIndex] = useState(initialSession?.liarIndex ?? 0);
  const [playerIndex, setPlayerIndex] = useState(initialSession?.playerIndex ?? 0);
  const [stage, setStage] = useState(initialSession?.stage ?? "pass");

  const selectedCategory = liarCategories.find(({ id }) => id === categoryId) ?? liarCategories[0];

  // The keyword belongs to the old language, so a language change ends the
  // round; the effect below then sends players back to setup.
  const roundLocale = useRef(locale);
  useEffect(() => {
    if (roundLocale.current === locale) return;
    roundLocale.current = locale;
    setKeyword("");
    setPlayerIndex(0);
    setStage("pass");
    clearSession();
    if (!liarCategories.some(({ id }) => id === categoryId)) setCategoryId(liarCategories[0].id);
  }, [locale, liarCategories, categoryId]);

  // Leaving the game screen discards the round in progress.
  useEffect(() => {
    if (screen === "liar-game") return;
    setKeyword("");
    setPlayerIndex(0);
    setStage("pass");
    clearSession();
  }, [screen]);

  // Persist the round so a refresh mid-game resumes where players left off.
  useEffect(() => {
    if (screen !== "liar-game" || !keyword) {
      clearSession();
      return;
    }
    writeJson("sessionStorage", storageKeys.liarSession, {
      playerCount,
      categoryId,
      keyword,
      liarIndex,
      playerIndex,
      stage,
    });
  }, [screen, playerCount, categoryId, keyword, liarIndex, playerIndex, stage]);

  // A game screen without a keyword (e.g. direct link) falls back to setup.
  useEffect(() => {
    if (screen === "liar-game" && !keyword) navigate("liar-setup", { replace: true });
  }, [screen, keyword, navigate]);

  const startGame = () => {
    const historyId = `liar-${selectedCategory.id}`;
    // The word itself is the ID, so adding or reordering words keeps history intact.
    const wordItems = selectedCategory.words.map((word) => ({ id: word, word }));
    const wordIndex = pickUnseenIndex(locale, historyId, wordItems);

    setKeyword(selectedCategory.words[wordIndex]);
    rememberCard(locale, historyId, wordItems[wordIndex].id);
    setLiarIndex(randomIndex(playerCount));
    setPlayerIndex(0);
    setStage("pass");
    navigate("liar-game");
  };

  const hidePlayerRole = () => {
    if (playerIndex === playerCount - 1) {
      setStage("liar-ready");
      return;
    }
    setPlayerIndex((current) => current + 1);
    setStage("handoff");
  };

  return {
    playerCount,
    categoryId,
    selectedCategory,
    keyword,
    liarIndex,
    playerIndex,
    stage,
    isRevealed: REVEALED_STAGES.includes(stage),
    setPlayerCount,
    setCategoryId,
    startGame,
    hidePlayerRole,
    revealRole: () => setStage("shown"),
    finishHandoff: () => setStage("pass"),
    startLiarSelection: () => setStage("liar-check"),
    revealLiar: () => setStage("liar-reveal"),
    revealKeyword: () => setStage("keyword"),
    restart: () => navigate("liar-setup"),
  };
}
