// Holdup — Theme Manager
// Reads theme preference from chrome.storage.sync and applies dark class.
// Loaded via importScripts() in service worker, <script> in pages.

(() => {
  'use strict';

  const THEME_KEY = 'theme';

  function resolvedTheme(pref) {
    if (pref === 'dark' || pref === 'light') return pref;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyClass(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }

  async function initTheme() {
    const result = await chrome.storage.sync.get(THEME_KEY);
    const pref = result[THEME_KEY] || 'system';
    applyClass(resolvedTheme(pref));
  }

  function onSystemChange() {
    chrome.storage.sync.get(THEME_KEY, (result) => {
      const pref = result[THEME_KEY] || 'system';
      if (pref === 'system') applyClass(resolvedTheme('system'));
    });
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', onSystemChange);

  globalThis.HoldupTheme = {
    THEME_KEY,
    resolvedTheme,
    applyClass,
    initTheme,
  };

  initTheme();
})();
