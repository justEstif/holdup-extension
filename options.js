// Holdup — Options Page Script

'use strict';

const byId = (id) => document.getElementById(id);

const form = byId('domainForm'),
  hostInput = byId('hostInput'),
  messageInput = byId('messageInput'),
  modeInput = byId('modeInput');

const advancedToggle = byId('advancedToggle'),
  advancedSection = byId('advancedSection'),
  cooldownTypeInput = byId('cooldownTypeInput'),
  cooldownMinutesGroup = byId('cooldownMinutesGroup'),
  cooldownMinutesInput = byId('cooldownMinutesInput'),
  redirectUrlInput = byId('redirectUrlInput');

const domainList = byId('domainList'),
  emptyState = byId('emptyState');

let editingIndex = -1;

form.addEventListener('submit', handleAdd);
advancedToggle.addEventListener('click', toggleAdvanced);
cooldownTypeInput.addEventListener('change', toggleCooldownMinutes);

async function loadEntries() {
  const { domains } = await chrome.storage.sync.get('domains');
  renderEntries(domains || []);
}

function renderEntries(domains) {
  domainList.innerHTML = '';
  if (domains.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');
  domains.forEach((entry, i) => {
    domainList.appendChild(buildEntryCard(entry, i));
  });
}

function buildEntryCard(entry, index) {
  if (editingIndex === index) return buildEditCard(entry);
  return buildViewCard(entry, index);
}

function buildViewCard(entry, index) {
  const card = document.createElement('div');
  card.className =
    'bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition-colors';
  card.innerHTML = buildViewHtml(entry);
  card.addEventListener('click', (e) => {
    if (e.target.closest('.remove-btn')) return;
    startEdit(index);
  });
  wireRemoveButton(card, index);
  return card;
}

function buildViewHtml(entry) {
  const domain = escapeHtml(entry.host);
  const badge = entry.mode === 'overlay' ? 'Overlay' : 'Fullscreen';
  const msg = escapeHtml(truncate(entry.message, 60));
  return `<div class="flex items-start justify-between gap-4">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-slate-800">${domain}</span>
          <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">${badge}</span>
        </div>
        <p class="text-sm text-slate-500 mt-1 truncate">${msg}</p>
      </div>
      <button type="button" class="remove-btn text-sm text-slate-400 hover:text-red-500 transition-colors flex-shrink-0">Remove</button>
    </div>`;
}

function wireRemoveButton(card, index) {
  const btn = card.querySelector('.remove-btn');
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (btn.dataset.confirming) {
      removeEntry(index);
      return;
    }
    btn.dataset.confirming = 'true';
    btn.textContent = 'Remove?';
    btn.className = 'remove-btn text-sm text-red-600 font-medium transition-colors flex-shrink-0';
  });
}

function buildEditCard(entry) {
  const card = document.createElement('div');
  card.className = 'bg-white rounded-xl border-2 border-amber-400 p-5';
  card.innerHTML = buildEditHtml(entry);
  wireEditCard(card);
  return card;
}

function buildEditHtml(entry) {
  const host = escapeHtml(entry.host);
  const msg = escapeHtml(entry.message);
  const ct = entry.cooldownType || 'session';
  const cm = entry.cooldownMinutes || 30;
  const ru = escapeHtml(entry.redirectUrl || '');
  const cls =
    'mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent';
  return `<div class="space-y-3">
  <div><label class="text-xs font-medium text-slate-500 uppercase tracking-wide">Domain</label>
    <input class="edit-host ${cls}" value="${host}" /></div>
  <div><label class="text-xs font-medium text-slate-500 uppercase tracking-wide">Message</label>
    <input class="edit-message ${cls}" value="${msg}" /></div>
  <div><label class="text-xs font-medium text-slate-500 uppercase tracking-wide">Mode</label>
    <select class="edit-mode bg-white ${cls}">
      <option value="overlay" ${entry.mode === 'overlay' ? 'selected' : ''}>Overlay</option>
      <option value="redirect" ${entry.mode === 'redirect' ? 'selected' : ''}>Fullscreen</option>
    </select></div>
  <div><label class="text-xs font-medium text-slate-500 uppercase tracking-wide">Cooldown</label>
    <select class="edit-cooldown-type bg-white ${cls}">
      <option value="session" ${ct === 'session' ? 'selected' : ''}>Until browser restart</option>
      <option value="time" ${ct === 'time' ? 'selected' : ''}>For specified minutes</option>
      <option value="always" ${ct === 'always' ? 'selected' : ''}>Always ask</option>
    </select></div>
  <div class="edit-cooldown-minutes-group ${ct !== 'time' ? 'hidden' : ''}">
    <label class="text-xs font-medium text-slate-500 uppercase tracking-wide">Cooldown minutes</label>
    <input class="edit-cooldown-minutes ${cls}" type="number" min="1" value="${cm}" /></div>
  <div><label class="text-xs font-medium text-slate-500 uppercase tracking-wide">Redirect URL</label>
    <input class="edit-redirect-url ${cls}" type="url" value="${ru}" placeholder="https://example.com" /></div>
  <div class="flex gap-3 pt-2">
    <button type="button" class="save-btn px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition-colors">Save</button>
    <button type="button" class="cancel-btn px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
  </div>
</div>`;
}

function wireEditCard(card) {
  card.querySelector('.save-btn').addEventListener('click', handleSave);
  card.querySelector('.cancel-btn').addEventListener('click', handleCancel);
  const ct = card.querySelector('.edit-cooldown-type');
  ct.addEventListener('change', () => toggleEditCooldown(card));
  toggleEditCooldown(card);
}

async function handleSave() {
  const card = domainList.children[editingIndex];
  if (!card) return;
  const host = card.querySelector('.edit-host').value.trim();
  const message = card.querySelector('.edit-message').value.trim();
  if (!host || !message) return;
  const mode = card.querySelector('.edit-mode').value;
  const cooldownType = card.querySelector('.edit-cooldown-type').value;
  const minutesEl = card.querySelector('.edit-cooldown-minutes');
  const cooldownMinutes = parseInt(minutesEl.value, 10) || 30;
  const redirectUrl = card.querySelector('.edit-redirect-url').value.trim();
  const entry = { host, message, mode, cooldownType, cooldownMinutes, redirectUrl };
  const { domains } = await chrome.storage.sync.get('domains');
  const updated = [...(domains || [])];
  updated[editingIndex] = entry;
  await chrome.storage.sync.set({ domains: updated });
  editingIndex = -1;
  renderEntries(updated);
}

function handleCancel() {
  editingIndex = -1;
  loadEntries();
}

function startEdit(index) {
  editingIndex = index;
  loadEntries();
}

async function removeEntry(index) {
  const { domains } = await chrome.storage.sync.get('domains');
  const updated = (domains || []).filter((_, i) => i !== index);
  await chrome.storage.sync.set({ domains: updated });
  editingIndex = -1;
  renderEntries(updated);
}

async function handleAdd(e) {
  e.preventDefault();
  const host = hostInput.value.trim();
  const message = messageInput.value.trim();
  const mode = modeInput.value;
  if (!host || !message) return;
  const cooldownType = cooldownTypeInput.value;
  const cooldownMinutes = parseInt(cooldownMinutesInput.value, 10) || 30;
  const redirectUrl = redirectUrlInput.value.trim();
  const entry = { host, message, mode, cooldownType, cooldownMinutes, redirectUrl };
  const { domains } = await chrome.storage.sync.get('domains');
  const updated = [...(domains || []), entry];
  await chrome.storage.sync.set({ domains: updated });
  resetForm();
  editingIndex = -1;
  renderEntries(updated);
}

function resetForm() {
  hostInput.value = '';
  messageInput.value = '';
  redirectUrlInput.value = '';
  cooldownTypeInput.value = 'session';
  cooldownMinutesInput.value = '30';
  cooldownMinutesGroup.classList.add('hidden');
  advancedSection.classList.add('hidden');
  advancedToggle.textContent = '▸ Advanced';
}

function toggleAdvanced() {
  const hidden = advancedSection.classList.toggle('hidden');
  advancedToggle.textContent = hidden ? '▸ Advanced' : '▾ Advanced';
}

function toggleCooldownMinutes() {
  const isTime = cooldownTypeInput.value === 'time';
  cooldownMinutesGroup.classList.toggle('hidden', !isTime);
}

function toggleEditCooldown(card) {
  const select = card.querySelector('.edit-cooldown-type');
  const group = card.querySelector('.edit-cooldown-minutes-group');
  group.classList.toggle('hidden', select.value !== 'time');
}

function truncate(str, len) {
  return str.length > len ? str.slice(0, len) + '…' : str;
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

loadEntries();
