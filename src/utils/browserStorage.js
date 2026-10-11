export function readPreference(name, fallback) {
  try {
    return window.localStorage.getItem(name) || fallback;
  } catch {
    return fallback;
  }
}

export function savePreference(name, value) {
  try {
    window.localStorage.setItem(name, value);
  } catch {
    // Keep the selected value in React state when browser storage is unavailable.
  }
}

export function readJson(storageName, key, fallback) {
  try {
    const storage = window[storageName];
    return JSON.parse(storage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(storageName, key, value) {
  try {
    const storage = window[storageName];
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // The current session remains usable when browser storage is unavailable.
  }
}

export function removeStoredValue(storageName, key) {
  try {
    window[storageName].removeItem(key);
  } catch {
    // Storage can be disabled by the browser or its privacy settings.
  }
}
