import { showToast } from '../utils/toast.js';
import { apiContact } from '../api/client.js';

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

  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-form-status');
  const submitBtn = document.getElementById('contact-submit');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get('name') || '').trim(),
      email: String(fd.get('email') || '').trim(),
      message: String(fd.get('message') || '').trim(),
    };

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'TRANSMITTING...';
    }
    if (status) status.textContent = '';

    try {
      const res = await apiContact(payload);
      form.reset();
      if (status) {
        status.className = 'contact-form-status contact-form-status--ok';
        status.textContent = `TICKET ${res.ticket_id} // MESSAGE_QUEUED`;
      }
      showToast('MESSAGE_SENT_TO_SERVER');
    } catch (err) {
      if (status) {
        status.className = 'contact-form-status contact-form-status--err';
        status.textContent = err.message || 'TRANSMISSION_FAILED';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'SEND_MESSAGE';
      }
    }
  });
}
