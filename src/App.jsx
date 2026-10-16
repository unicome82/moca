import { useEffect, useState } from "react";
import DrawScreen from "./components/DrawScreen.jsx";
import ThemeLanding from "./themes/ThemeLanding.jsx";
import LiarGameScreen from "./components/LiarGameScreen.jsx";
import LiarSetupScreen from "./components/LiarSetupScreen.jsx";

import ScreenLayout from "./components/ScreenLayout.jsx";
import { cardCollections, liarCategories } from "./data/decks.js";
import { skinImageAssets } from "./data/skinAssets.js";
import { liarStages, skins, storageKeys, themes } from "./config/appConfig.js";
import useScreenNavigation, { readScreen } from "./hooks/useScreenNavigation.js";
import { pickUnseenIndex, rememberCard } from "./utils/cardHistory.js";
import {
  readJson,
  readPreference,
  removeStoredValue,
  savePreference,
  writeJson,
} from "./utils/browserStorage.js";

function readLiarSession() {
  const saved = readJson("sessionStorage", storageKeys.liarSession, null);
  const categoryExists = liarCategories.some(({ id }) => id === saved?.categoryId);
  const validPlayerCount = Number.isInteger(saved?.playerCount) && saved.playerCount >= 3 && saved.playerCount <= 12;

  if (
    !saved ||
    !categoryExists ||
    !validPlayerCount ||
    typeof saved.keyword !== "string" ||
    !saved.keyword ||
    !Number.isInteger(saved.liarIndex) ||
    saved.liarIndex < 0 ||
    saved.liarIndex >= saved.playerCount ||
    !Number.isInteger(saved.playerIndex) ||
    saved.playerIndex < 0 ||
    saved.playerIndex >= saved.playerCount ||
    !liarStages.includes(saved.stage)
  ) {
    return null;
  }

  return saved;
}

const randomIndex = (length) => Math.floor(Math.random() * length);

const getSkinAssetIndex = (assetType) => {
  const assets = skinImageAssets[assetType];
  const history = readJson(
    "localStorage",
    storageKeys.preference(`skin-asset-cycle-${assetType}`),
    [],
  );
  const seen = Array.isArray(history)
    ? [...new Set(history.filter((index) => Number.isInteger(index) && index >= 0 && index < assets.length))]
    : [];
  const savedIndex = Number(
    readPreference(storageKeys.preference(`skin-asset-${assetType}`), "-1"),
  );

  if (!seen.length && Number.isInteger(savedIndex) && savedIndex >= 0 && savedIndex < assets.length) {
    seen.push(savedIndex);
  }

  let choices = assets.map((_, index) => index).filter((index) => !seen.includes(index));
  if (!choices.length) {
    choices = assets.map((_, index) => index);
    if (choices.length > 1 && choices.includes(savedIndex)) {
      choices = choices.filter((index) => index !== savedIndex);
    }
  }

  return choices[randomIndex(choices.length)];
};

const rememberSkinAsset = (assetType, assetIndex) => {
  const assets = skinImageAssets[assetType];
  const historyKey = storageKeys.preference(`skin-asset-cycle-${assetType}`);
  const history = readJson("localStorage", historyKey, []);
  let seen = Array.isArray(history)
    ? [...new Set(history.filter((index) => Number.isInteger(index) && index >= 0 && index < assets.length))]
    : [];
  const previousIndex = Number(
    readPreference(storageKeys.preference(`skin-asset-${assetType}`), "-1"),
  );

  if (!seen.length && Number.isInteger(previousIndex) && previousIndex >= 0 && previousIndex < assets.length) {
    seen.push(previousIndex);
  }
  if (seen.length >= assets.length) seen = [];
  if (!seen.includes(assetIndex)) seen.push(assetIndex);

  writeJson("localStorage", historyKey, seen);
  savePreference(storageKeys.preference(`skin-asset-${assetType}`), String(assetIndex));
};

const skinAssetType = (skin) => (skin === "dim-photo" ? "photo" : skin);

const getInitialSkinImages = (skin) => {
  const images = Object.fromEntries(
    Object.entries(skinImageAssets).map(([assetType, assets]) => [assetType, assets[0]]),
  );
  const activeType = skinAssetType(skin);

  if (activeType in skinImageAssets) {
    images[activeType] = skinImageAssets[activeType][getSkinAssetIndex(activeType)];
  }

  return images;
};

export default function App() {
  const { screen, navigate } = useScreenNavigation();
  const [initialLiarSession] = useState(() =>
    readScreen() === "liar-game" ? readLiarSession() : null,
  );
  const [cardIndex, setCardIndex] = useState(() => {
    const collection = cardCollections[readScreen()];
    return collection ? pickUnseenIndex(readScreen(), collection) : 0;
  });
  const [revealStage, setRevealStage] = useState("hidden");
  const [playerCount, setPlayerCount] = useState(initialLiarSession?.playerCount ?? 4);
  const [categoryId, setCategoryId] = useState(initialLiarSession?.categoryId ?? liarCategories[0].id);
  const [keyword, setKeyword] = useState(initialLiarSession?.keyword ?? "");
  const [liarIndex, setLiarIndex] = useState(initialLiarSession?.liarIndex ?? 0);
  const [playerIndex, setPlayerIndex] = useState(initialLiarSession?.playerIndex ?? 0);
  const [liarStage, setLiarStage] = useState(initialLiarSession?.stage ?? "pass");
  const [theme, setTheme] = useState(() => {
    const saved = readPreference(storageKeys.preference("theme"), "prism");
    return themes.includes(saved) ? saved : "prism";
  });
  const [skin, setSkin] = useState(() => {
    const saved = readPreference(storageKeys.preference("skin"), "base");
    return skins.includes(saved) ? saved : "base";
  });
  const [skinImages, setSkinImages] = useState(() => getInitialSkinImages(skin));

  useEffect(() => {
    const assetType = skinAssetType(skin);
    if (!(assetType in skinImageAssets)) return;

    const assetIndex = skinImageAssets[assetType].indexOf(skinImages[assetType]);
    rememberSkinAsset(assetType, assetIndex);
  }, [skin, skinImages]);

  useEffect(() => {
    setRevealStage("hidden");
    const collection = cardCollections[screen];
    if (collection) setCardIndex(pickUnseenIndex(screen, collection));
    if (screen === "liar-game") return;

    setKeyword("");
    setPlayerIndex(0);
    setLiarStage("pass");
    removeStoredValue("sessionStorage", storageKeys.liarSession);
  }, [screen]);

  useEffect(() => {
    if (screen !== "liar-game" || !keyword) {
      removeStoredValue("sessionStorage", storageKeys.liarSession);
      return;
    }

    writeJson("sessionStorage", storageKeys.liarSession, {
      playerCount,
      categoryId,
      keyword,
      liarIndex,
      playerIndex,
      stage: liarStage,
    });
  }, [screen, playerCount, categoryId, keyword, liarIndex, playerIndex, liarStage]);

  useEffect(() => {
    if (screen !== "liar-game" || keyword) return;
    navigate("liar-setup", { replace: true });
  }, [screen, keyword, navigate]);

  const changeTheme = (value) => {
    if (value === theme || !themes.includes(value)) return;
    setTheme(value);
    savePreference(storageKeys.preference("theme"), value);
    navigate("intro");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const changeSkin = (value) => {
    setSkin(value);
    const assetType = skinAssetType(value);
    if (assetType in skinImageAssets) {
      const assets = skinImageAssets[assetType];
      const nextIndex = getSkinAssetIndex(assetType);
      setSkinImages((current) => ({ ...current, [assetType]: assets[nextIndex] }));
    }
    savePreference(storageKeys.preference("skin"), value);
  };

  const revealCard = () => {
    const collection = cardCollections[screen];
    if (collection?.[cardIndex]) rememberCard(screen, collection[cardIndex].id);
    setRevealStage("revealed");
  };

  const replaceCard = () => {
    const collection = cardCollections[screen];
    if (!collection) return;
    setCardIndex((current) => pickUnseenIndex(screen, collection, current));
    setRevealStage("replacing");
  };

  const finishReplacingCard = () => {
    setRevealStage("hidden");
  };

  const startLiarGame = () => {
    const category = liarCategories.find(({ id }) => id === categoryId) ?? liarCategories[0];
    const wordItems = category.words.map((word, index) => ({ id: `${category.id}-${index}`, word }));
    const wordIndex = pickUnseenIndex(`liar-${category.id}`, wordItems);
    setKeyword(category.words[wordIndex]);
    rememberCard(`liar-${category.id}`, `${category.id}-${wordIndex}`);
    setLiarIndex(randomIndex(playerCount));
    setPlayerIndex(0);
    setLiarStage("pass");
    navigate("liar-game");
  };

  const hidePlayerRole = () => {
    if (playerIndex === playerCount - 1) {
      setLiarStage("liar-ready");
      return;
    }

    setPlayerIndex((current) => current + 1);
    setLiarStage("handoff");
  };

  const finishPlayerHandoff = () => setLiarStage("pass");

  const goBack = () => navigate(screen === "liar-game" ? "liar-setup" : "home");
  const selectedCategory = liarCategories.find(({ id }) => id === categoryId) ?? liarCategories[0];

  return (
    <ScreenLayout
      showBack={screen !== "intro" && screen !== "home"}
      onBack={goBack}
      onHome={() => navigate("intro")}
      screen={screen}
      isCardScreen={
        screen === "ice" ||
        screen === "solution" ||
        screen === "balance" ||
        screen === "liar-game"
      }
      isCardRevealed={
        ((screen === "ice" || screen === "solution" || screen === "balance") && revealStage === "revealed") ||
        (screen === "liar-game" && ["shown", "handoff", "liar-reveal", "keyword"].includes(liarStage))
      }
      theme={theme}
      skin={skin}
      skinImages={skinImages}
      onThemeChange={changeTheme}
      onSkinChange={changeSkin}
    >
      {(screen === "intro" || screen === "home") && (
        <ThemeLanding key={theme} theme={theme} expanded={screen === "home"}
          onExpand={() => navigate("home")} onCollapse={() => navigate("intro")}
          onNavigate={navigate} />
      )}
      {(screen === "ice" || screen === "solution" || screen === "balance") && (
        <DrawScreen
          key={screen}
          deckId={screen}
          cardIndex={cardIndex}
          revealStage={revealStage}
          onReveal={revealCard}
          onReplace={replaceCard}
          onReplaceComplete={finishReplacingCard}
        />
      )}
      {screen === "liar-setup" && (
        <LiarSetupScreen
          playerCount={playerCount}
          categoryId={categoryId}
          onPlayerCountChange={setPlayerCount}
          onCategoryChange={setCategoryId}
          onStart={startLiarGame}
        />
      )}
      {screen === "liar-game" && (
        <LiarGameScreen
          playerCount={playerCount}
          categoryName={selectedCategory.name}
          keyword={keyword}
          liarIndex={liarIndex}
          playerIndex={playerIndex}
          stage={liarStage}
          onReveal={() => setLiarStage("shown")}
          onHide={hidePlayerRole}
          onHandoffComplete={finishPlayerHandoff}
          onStartLiarSelection={() => setLiarStage("liar-check")}
          onRevealLiar={() => setLiarStage("liar-reveal")}
          onRevealKeyword={() => setLiarStage("keyword")}
          onRestart={() => navigate("liar-setup")}
        />
      )}
    </ScreenLayout>
  );
}
