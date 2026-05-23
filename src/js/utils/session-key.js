import { showToast } from './toast.js';
import { apiSessionInit, apiSessionKey, apiSessionVerify } from '../api/client.js';

const KEY_STORAGE = 'boot_security_key';
const TOKEN_STORAGE = 'boot_session_token';
const UNLOCK_STORAGE = 'projects_unlocked';

export function saveSession({ key, token }) {
  if (key) sessionStorage.setItem(KEY_STORAGE, key.toUpperCase());
  if (token) sessionStorage.setItem(TOKEN_STORAGE, token);
}

export function saveSessionKey(key) {
  saveSession({ key });
}

export function getSessionKey() {
  return sessionStorage.getItem(KEY_STORAGE);
}

export function getSessionToken() {
  return sessionStorage.getItem(TOKEN_STORAGE);
}

export function hasSessionKey() {
  return Boolean(getSessionKey());
}

export function isProjectsUnlocked() {
  return sessionStorage.getItem(UNLOCK_STORAGE) === 'true';
}

export function setProjectsUnlocked() {
  sessionStorage.setItem(UNLOCK_STORAGE, 'true');
}

export function maskSessionKey(key) {
  if (!key || key.length < 8) return '••••••••';
  return `${key.slice(0, 4)}${'•'.repeat(Math.max(0, key.length - 8))}${key.slice(-4)}`;
}

export async function initSessionFromApi() {
  try {
    const data = await apiSessionInit();
    saveSession({ key: data.security_key, token: data.token });
    return data.security_key;
  } catch {
    const key = Array.from({ length: 16 }, () =>
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]
    ).join('');
    saveSessionKey(key);
    return key;
  }
}

export async function recoverSessionKeyFromApi() {
  const token = getSessionToken();
  if (!token) return getSessionKey();

  try {
    const data = await apiSessionKey(token);
    if (data.security_key) {
      saveSessionKey(data.security_key);
      return data.security_key;
    }
  } catch {
    /* offline — use stored key */
  }
  return getSessionKey();
}

export async function verifyKeyOnServer(entered, stored) {
  try {
    const data = await apiSessionVerify(entered, stored);
    return data.valid;
  } catch {
    return entered.trim().toUpperCase() === stored.trim().toUpperCase();
  }
}

export async function copySessionKey() {
  const key = await recoverSessionKeyFromApi();
  if (!key) return false;

  try {
    await navigator.clipboard.writeText(key);
  } catch {
    const temp = document.createElement('textarea');
    temp.value = key;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
  }

  showToast('SECURITY_KEY_COPIED_TO_CLIPBOARD');
  return true;
}

export function applyProjectsUnlockIfSaved() {
  if (!isProjectsUnlocked()) return;
  document.getElementById('projects-lock-wrapper')?.classList.add('unlocked');
}
