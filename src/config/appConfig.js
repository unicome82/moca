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

export const themes = themeOptions.map(({ id }) => id);

export const storageKeys = {
  liarSession: "random-card-liar-session",
  preference: (name) => `random-card-${name}`,
  cardHistory: (deckId) => `random-card-seen-${deckId}`,
};
