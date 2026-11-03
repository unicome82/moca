import { useEffect, useState } from "react";
import { storageKeys, themes } from "../config/appConfig.js";
import { themeImageAssets } from "../data/themeAssets.js";
import { readJson, readPreference, savePreference, writeJson } from "../utils/browserStorage.js";

const DEFAULT_THEME = "prism";
const randomIndex = (length) => Math.floor(Math.random() * length);
const cycleKey = (assetType) => storageKeys.preference(`theme-asset-cycle-${assetType}`);
const lastAssetKey = (assetType) => storageKeys.preference(`theme-asset-${assetType}`);

const isAssetIndex = (index, assets) => Number.isInteger(index) && index >= 0 && index < assets.length;

// Indices already shown in the current cycle, seeded with the last saved asset for older storage.
function readSeenAssets(assetType) {
  const assets = themeImageAssets[assetType];
  const history = readJson("localStorage", cycleKey(assetType), []);
  const seen = Array.isArray(history)
    ? [...new Set(history.filter((index) => isAssetIndex(index, assets)))]
    : [];
  const lastIndex = Number(readPreference(lastAssetKey(assetType), "-1"));

  if (!seen.length && isAssetIndex(lastIndex, assets)) seen.push(lastIndex);
  return { assets, seen, lastIndex };
}

function pickThemeAssetIndex(assetType) {
  const { assets, seen, lastIndex } = readSeenAssets(assetType);
  const all = assets.map((_, index) => index);
  let choices = all.filter((index) => !seen.includes(index));

  if (!choices.length) {
    choices = all.length > 1 ? all.filter((index) => index !== lastIndex) : all;
  }

  return choices[randomIndex(choices.length)];
}

function rememberThemeAsset(assetType, assetIndex) {
  const { assets, seen: currentSeen } = readSeenAssets(assetType);
  const seen = currentSeen.length >= assets.length ? [] : currentSeen;
  if (!seen.includes(assetIndex)) seen.push(assetIndex);

  writeJson("localStorage", cycleKey(assetType), seen);
  savePreference(lastAssetKey(assetType), String(assetIndex));
}

function readInitialTheme() {
  const saved = readPreference(storageKeys.preference("theme"), DEFAULT_THEME);
  return themes.includes(saved) ? saved : DEFAULT_THEME;
}

function getInitialThemeImages(theme) {
  const images = Object.fromEntries(
    Object.entries(themeImageAssets).map(([type, assets]) => [type, assets[0]]),
  );
  if (theme in themeImageAssets) images[theme] = themeImageAssets[theme][pickThemeAssetIndex(theme)];
  return images;
}

export default function useThemeSettings({ onThemeChanged } = {}) {
  const [theme, setTheme] = useState(readInitialTheme);
  const [themeImages, setThemeImages] = useState(() => getInitialThemeImages(theme));

  useEffect(() => {
    if (theme in themeImageAssets) {
      rememberThemeAsset(theme, themeImageAssets[theme].indexOf(themeImages[theme]));
    }
  }, [theme, themeImages]);

  const changeTheme = (value) => {
    if (value === theme || !themes.includes(value)) return;
    if (value in themeImageAssets) {
      const nextImage = themeImageAssets[value][pickThemeAssetIndex(value)];
      setThemeImages((current) => ({ ...current, [value]: nextImage }));
    }
    setTheme(value);
    savePreference(storageKeys.preference("theme"), value);
    onThemeChanged?.(value);
  };

  return { theme, themeImages, changeTheme };
}
