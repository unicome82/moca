export const screens = [
  "intro",
  "home",
  "ice",
  "solution",
  "balance",
  "liar-setup",
  "liar-game",
];

export const liarStages = [
  "pass",
  "shown",
  "handoff",
  "liar-ready",
  "liar-check",
  "liar-reveal",
  "keyword",
];

export const themeOptions = [
  { id: "shape", label: "Shape", icon: "category" },
  { id: "prism", label: "Prism", icon: "diamond" },
  { id: "folio", label: "Folio", icon: "auto_stories" },
  { id: "retro", label: "Retro", icon: "videogame_asset" },
  { id: "pattern", label: "Pattern", icon: "grid_4x4" },
  { id: "photo", label: "Photo", icon: "landscape" },
  { id: "illustration", label: "Illust", icon: "brush" },
  { id: "press", label: "Press", icon: "newspaper" },
  { id: "scenery", label: "Scenery", icon: "landscape" },
  { id: "cutout", label: "Cutout", icon: "content_cut" },
];

// Every locale the app knows about, named in its own language.
export const localeOptions = [
  { id: "ko", label: "한국어" },
  { id: "en", label: "English" },
  { id: "ja", label: "日本語" },
  { id: "zh-TW", label: "繁體中文" },
];

// Locales a user can get. Add a locale here once its UI text and cards are
// ready; the language picker appears in settings when there are two or more.
export const defaultLocale = "ko";
export const enabledLocales = ["ko", "en", "ja", "zh-TW"];

// Locales the device language may pick on its own. Keep a locale out of this
// list until the app launches in that language (cards are still in review), so
// only people who choose it in settings see it.
export const autoDetectLocales = ["ko"];

export const themes = themeOptions.map(({ id }) => id);

export const storageKeys = {
  liarSession: "random-card-liar-session",
  preference: (name) => `random-card-${name}`,
  cardHistory: (locale, deckId) => `random-card-seen-${locale}-${deckId}`,
  // Before locales, history was stored per deck only; that history is Korean.
  legacyCardHistoryPrefix: "random-card-seen-",
};
