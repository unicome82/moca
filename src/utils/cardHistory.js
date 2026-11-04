import { localeOptions, storageKeys } from "../config/appConfig.js";
import { listStoredKeys, readJson, removeStoredValue, writeJson } from "./browserStorage.js";

const randomIndex = (length) => Math.floor(Math.random() * length);

// Card ids differ by language, so each language keeps its own history.
export function rememberCard(locale, deckId, itemId) {
  const key = storageKeys.cardHistory(locale, deckId);
  const seen = new Set(readJson("localStorage", key, []));
  seen.add(itemId);
  writeJson("localStorage", key, [...seen]);
}

export function pickUnseenIndex(locale, deckId, collection, currentIndex = -1) {
  if (!collection.length) return -1;

  const seen = new Set(
    readJson("localStorage", storageKeys.cardHistory(locale, deckId), []),
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

// History saved before locales existed ("random-card-seen-ice") was Korean;
// move it to the Korean key ("random-card-seen-ko-ice") once.
export function migrateLegacyCardHistory() {
  const prefix = storageKeys.legacyCardHistoryPrefix;
  const localePrefixes = localeOptions.map(({ id }) => `${prefix}${id}-`);

  for (const key of listStoredKeys("localStorage")) {
    if (!key.startsWith(prefix)) continue;
    if (localePrefixes.some((localePrefix) => key.startsWith(localePrefix))) continue;

    const deckId = key.slice(prefix.length);
    const target = storageKeys.cardHistory("ko", deckId);
    const legacy = readJson("localStorage", key, []);
    const current = readJson("localStorage", target, []);
    writeJson("localStorage", target, [...new Set([...current, ...legacy])]);
    removeStoredValue("localStorage", key);
  }
}
