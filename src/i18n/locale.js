import { autoDetectLocales, defaultLocale, enabledLocales, storageKeys } from "../config/appConfig.js";
import { readPreference, savePreference } from "../utils/browserStorage.js";

const localeKey = storageKeys.preference("locale");

// Traditional Chinese regions and scripts all map to zh-TW.
const aliases = { "zh-hant": "zh-TW", "zh-hk": "zh-TW", "zh-mo": "zh-TW" };

// Match a browser language tag (e.g. "en-US", "zh-Hant-TW") to one of the locales.
export function matchLocale(tag, locales = autoDetectLocales) {
  if (!tag) return null;
  const lower = tag.toLowerCase();
  const exact = locales.find((locale) => locale.toLowerCase() === lower);
  if (exact) return exact;

  const alias = Object.entries(aliases).find(([prefix]) => lower.startsWith(prefix));
  if (alias) return locales.includes(alias[1]) ? alias[1] : null;

  // "en-US" → "en", but never "zh-CN" → "zh-TW".
  const base = lower.split("-")[0];
  return locales.find((locale) => locale === base) ?? null;
}

// A saved choice wins; otherwise follow the device language.
export function detectLocale() {
  const saved = readPreference(localeKey, "");
  if (enabledLocales.includes(saved)) return saved;

  const tags = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of tags) {
    const match = matchLocale(tag);
    if (match) return match;
  }
  return defaultLocale;
}

export function saveLocale(locale) {
  savePreference(localeKey, locale);
}
