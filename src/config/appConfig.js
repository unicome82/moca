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
  { id: "social", label: "기본", icon: "palette" },
  { id: "luxe", label: "럭셔리", icon: "diamond" },
  { id: "cute", label: "귀여운", icon: "favorite" },
  { id: "retro", label: "레트로", icon: "videogame_asset" },
  { id: "vintage", label: "빈티지", icon: "history" },
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
