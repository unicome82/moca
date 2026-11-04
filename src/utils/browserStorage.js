import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

// In the native app the OS may clear WebView localStorage, so persistent values live in
// Capacitor Preferences. Reads stay synchronous through an in-memory copy that
// hydrateStorage() fills before the first render; writes update the copy and persist in
// the background. sessionStorage is short-lived by design and stays in the WebView.
const useNativeStore = Capacitor.isNativePlatform();
const nativeValues = new Map();

const persist = (task) => task.catch(() => {
  // The in-memory copy keeps the current run usable if native storage fails.
});

const nativeStore = {
  get length() {
    return nativeValues.size;
  },
  key: (index) => [...nativeValues.keys()][index] ?? null,
  getItem: (key) => nativeValues.get(key) ?? null,
  setItem(key, value) {
    const text = String(value);
    nativeValues.set(key, text);
    persist(Preferences.set({ key, value: text }));
  },
  removeItem(key) {
    nativeValues.delete(key);
    persist(Preferences.remove({ key }));
  },
};

const getStore = (storageName) =>
  useNativeStore && storageName === "localStorage" ? nativeStore : window[storageName];

// Load saved native values before anything reads them. Resolves immediately on the web.
export async function hydrateStorage() {
  if (!useNativeStore) return;
  try {
    const { keys } = await Preferences.keys();
    const entries = await Promise.all(keys.map(async (key) => [key, (await Preferences.get({ key })).value]));
    for (const [key, value] of entries) {
      if (value !== null) nativeValues.set(key, value);
    }
  } catch {
    // Start with empty preferences rather than blocking the app.
  }
}

export function readPreference(name, fallback) {
  try {
    return getStore("localStorage").getItem(name) || fallback;
  } catch {
    return fallback;
  }
}

export function savePreference(name, value) {
  try {
    getStore("localStorage").setItem(name, value);
  } catch {
    // Keep the selected value in React state when browser storage is unavailable.
  }
}

export function readJson(storageName, key, fallback) {
  try {
    return JSON.parse(getStore(storageName).getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(storageName, key, value) {
  try {
    getStore(storageName).setItem(key, JSON.stringify(value));
  } catch {
    // The current session remains usable when browser storage is unavailable.
  }
}

export function removeStoredValue(storageName, key) {
  try {
    getStore(storageName).removeItem(key);
  } catch {
    // Storage can be disabled by the browser or its privacy settings.
  }
}

export function listStoredKeys(storageName) {
  try {
    const storage = getStore(storageName);
    return Array.from({ length: storage.length }, (_, index) => storage.key(index));
  } catch {
    return [];
  }
}
