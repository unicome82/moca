import { useCallback, useEffect, useState } from "react";
import { screens } from "../config/appConfig.js";

export function readScreen() {
  const requested = new URLSearchParams(window.location.search).get("screen");
  return screens.includes(requested) ? requested : "intro";
}

export default function useScreenNavigation() {
  const [screen, setScreen] = useState(readScreen);

  useEffect(() => {
    const syncScreen = () => setScreen(readScreen());
    window.addEventListener("popstate", syncScreen);
    return () => window.removeEventListener("popstate", syncScreen);
  }, []);

  const navigate = useCallback((nextScreen, { replace = false } = {}) => {
    if (!screens.includes(nextScreen)) return;

    const url = new URL(window.location.href);
    url.searchParams.set("screen", nextScreen);
    window.history[replace ? "replaceState" : "pushState"]({}, "", url);
    setScreen(nextScreen);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return { screen, navigate };
}
