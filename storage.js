// Holdup — Storage Layer
// CRUD operations for domain entries in chrome.storage.sync.
// Loaded via importScripts() in service worker, <script> in pages.

(() => {
  'use strict';

  const STORAGE_KEY = 'domains';

  const DEFAULTS = {
    mode: 'overlay',
    cooldownType: 'session',
    cooldownMinutes: 30,
    redirectUrl: '',
    enabled: true,
  };

  function generateId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  function applyDefaults(entry) {
    return { ...DEFAULTS, ...entry, id: entry.id || generateId() };
  }

  async function getEntries() {
    const result = await chrome.storage.sync.get(STORAGE_KEY);
    const entries = result[STORAGE_KEY] || [];
    return maybeMigrate(entries);
  }

  async function maybeMigrate(entries) {
    const needsMigration = entries.some((e) => !e.id);
    if (!needsMigration) return entries;
    const migrated = entries.map((e) => applyDefaults(e));
    await saveEntries(migrated);
    return migrated;
  }

  async function saveEntries(entries) {
    await chrome.storage.sync.set({ [STORAGE_KEY]: entries });
  }

  async function addEntry(entry) {
    const entries = await getEntries();
    const withDefaults = applyDefaults(entry);
    entries.push(withDefaults);
    await saveEntries(entries);
    return withDefaults;
  }

  async function getEntryById(id) {
    const entries = await getEntries();
    return entries.find((e) => e.id === id) || null;
  }

  async function getEntryByHost(host) {
    const entries = await getEntries();
    return entries.find((e) => e.host === host) || null;
  }

  async function updateEntry(id, updates) {
    const entries = await getEntries();
    const index = entries.findIndex((e) => e.id === id);
    if (index === -1) return null;
    entries[index] = { ...entries[index], ...updates, id };
    await saveEntries(entries);
    return entries[index];
  }

  async function deleteEntry(id) {
    const entries = await getEntries();
    const filtered = entries.filter((e) => e.id !== id);
    await saveEntries(filtered);
    return filtered;
  }

  globalThis.HoldupStorage = {
    getEntries,
    addEntry,
    getEntryById,
    getEntryByHost,
    updateEntry,
    deleteEntry,
  };
})();
