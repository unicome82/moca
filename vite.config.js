import { defineConfig } from "vite";

// "app" mode builds for the Capacitor shell, which serves files from the app bundle root.
const buildBase = (mode) => (mode === "app" ? "./" : "/moca/");

export default defineConfig(({ command, mode }) => ({
  base: command === "build" ? buildBase(mode) : "/",
  build: {
    // Keep font slices as files so browsers fetch only the unicode ranges they need.
    assetsInlineLimit: (filePath) => (filePath.endsWith(".woff2") ? false : undefined),
  },
}));
