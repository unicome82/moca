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
  { id: "prism", label: "Prism", icon: "palette" },
  { id: "shape", label: "Shape", icon: "category" },
  { id: "folio", label: "Folio", icon: "auto_stories" },
  { id: "retro", label: "Retro", icon: "videogame_asset" },
  { id: "press", label: "Press", icon: "newspaper" },
];

export const skinOptions = [
  { id: "base", label: "기본", icon: "asterisk" },
  { id: "pattern", label: "패턴", icon: "grid_4x4" },
  { id: "dim-photo", label: "사진", icon: "landscape" },
  { id: "illustration", label: "일러스트", icon: "brush" },
  { id: "modern", label: "모던", icon: "layers" },
];

export const themes = themeOptions.map(({ id }) => id);
export const skins = skinOptions.map(({ id }) => id);

export const storageKeys = {
  liarSession: "random-card-liar-session",
  preference: (name) => `random-card-${name}`,
  cardHistory: (deckId) => `random-card-seen-${deckId}`,
};
