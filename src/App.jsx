import DrawScreen from "./components/DrawScreen.jsx";
import LiarGameScreen from "./components/LiarGameScreen.jsx";
import LiarSetupScreen from "./components/LiarSetupScreen.jsx";
import ScreenLayout from "./components/ScreenLayout.jsx";
import ThemeLanding from "./themes/ThemeLanding.jsx";
import useCardDraw from "./hooks/useCardDraw.js";
import useLiarGame from "./hooks/useLiarGame.js";
import useScreenNavigation from "./hooks/useScreenNavigation.js";
import useLocale from "./hooks/useLocale.js";
import useThemeSettings from "./hooks/useThemeSettings.js";

export default function App() {
  const { screen, navigate } = useScreenNavigation();
  const card = useCardDraw(screen);
  const liar = useLiarGame(screen, navigate);
  const { selectedLocale, changeLocale } = useLocale();
  const { theme, themeImages, changeTheme } = useThemeSettings({
    onThemeChanged: () => {
      navigate("intro");
      window.scrollTo({ top: 0, behavior: "instant" });
    },
  });

  const isLanding = screen === "intro" || screen === "home";
  const isLiarGame = screen === "liar-game";

  return (
    <ScreenLayout
      showBack={!isLanding}
      onBack={() => navigate(isLiarGame ? "liar-setup" : "home")}
      onHome={() => navigate("intro")}
      screen={screen}
      isCardScreen={card.isDrawScreen || isLiarGame}
      isCardRevealed={
        (card.isDrawScreen && card.revealStage === "revealed") ||
        (isLiarGame && liar.isRevealed)
      }
      theme={theme}
      themeImages={themeImages}
      onThemeChange={changeTheme}
      locale={selectedLocale}
      onLocaleChange={changeLocale}
    >
      {isLanding && (
        <ThemeLanding
          key={theme}
          theme={theme}
          expanded={screen === "home"}
          onExpand={() => navigate("home")}
          onCollapse={() => navigate("intro")}
          onNavigate={navigate}
        />
      )}
      {card.isDrawScreen && (
        <DrawScreen
          key={screen}
          deckId={screen}
          cardIndex={card.cardIndex}
          revealStage={card.revealStage}
          onReveal={card.revealCard}
          onReplace={card.replaceCard}
          onReplaceComplete={card.finishReplacingCard}
        />
      )}
      {screen === "liar-setup" && (
        <LiarSetupScreen
          playerCount={liar.playerCount}
          categoryId={liar.categoryId}
          onPlayerCountChange={liar.setPlayerCount}
          onCategoryChange={liar.setCategoryId}
          onStart={liar.startGame}
        />
      )}
      {isLiarGame && (
        <LiarGameScreen
          playerCount={liar.playerCount}
          categoryName={liar.selectedCategory.name}
          keyword={liar.keyword}
          liarIndex={liar.liarIndex}
          playerIndex={liar.playerIndex}
          stage={liar.stage}
          onReveal={liar.revealRole}
          onHide={liar.hidePlayerRole}
          onHandoffComplete={liar.finishHandoff}
          onStartLiarSelection={liar.startLiarSelection}
          onRevealLiar={liar.revealLiar}
          onRevealKeyword={liar.revealKeyword}
          onRestart={liar.restart}
        />
      )}
    </ScreenLayout>
  );
}
