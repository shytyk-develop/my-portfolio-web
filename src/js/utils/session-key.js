import { showToast } from './toast.js';

const KEY_STORAGE = 'boot_security_key';
const UNLOCK_STORAGE = 'projects_unlocked';

export function saveSessionKey(key) {
  if (!key) return;
  sessionStorage.setItem(KEY_STORAGE, key.toUpperCase());
}

export function getSessionKey() {
  return sessionStorage.getItem(KEY_STORAGE);
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

export async function copySessionKey() {
  const key = getSessionKey();
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
