import { showToast } from '../utils/toast.js';

export function initContact() {
  window.copyEmail = (email) => {
    navigator.clipboard?.writeText(email).catch(() => {
      const temp = document.createElement('textarea');
      temp.value = email;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
    });
    showToast('EMAIL_COPIED_TO_CLIPBOARD');
  };
}
