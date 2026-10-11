import { storageKeys } from "../config/appConfig.js";
import { readJson, writeJson } from "./browserStorage.js";

const randomIndex = (length) => Math.floor(Math.random() * length);

export function rememberCard(deckId, itemId) {
  const key = storageKeys.cardHistory(deckId);
  const seen = new Set(readJson("localStorage", key, []));
  seen.add(itemId);
  writeJson("localStorage", key, [...seen]);
}

export function pickUnseenIndex(deckId, collection, currentIndex = -1) {
  if (!collection.length) return -1;

  const seen = new Set(
    readJson("localStorage", storageKeys.cardHistory(deckId), []),
  );
  const unseen = collection
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !seen.has(item.id));
  const candidates = unseen.length
    ? unseen
    : collection.map((item, index) => ({ item, index }));
  const distinct = candidates.filter(({ index }) => index !== currentIndex);
  const choices = distinct.length ? distinct : candidates;

  return choices[randomIndex(choices.length)].index;
}
