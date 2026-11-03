import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/moca/" : "/",
  build: {
    // Keep font slices as files so browsers fetch only the unicode ranges they need.
    assetsInlineLimit: (filePath) => (filePath.endsWith(".woff2") ? false : undefined),
  },
}));
