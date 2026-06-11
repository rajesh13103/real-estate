// js/contact.js
// Contact Form Fields Validation & Submission Handler

import { StorageManager } from './storage.js';
import { Validation } from './validation.js';

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const serviceType = document.getElementById('contact-service').value;
    const message = document.getElementById('contact-message').value.trim();

    // Reset error layouts
    document.querySelectorAll('.form-group').forEach(grp => grp.classList.remove('has-error'));

    let isValid = true;

    if (!Validation.required(name)) {
      showFieldError('contact-name', 'Please enter your name.');
      isValid = false;
    }

    if (!Validation.phone(phone)) {
      showFieldError('contact-phone', 'Please enter a valid 10-digit mobile number.');
      isValid = false;
    }

    if (!Validation.email(email)) {
      showFieldError('contact-email', 'Please enter a valid email address.');
      isValid = false;
    }

    if (!Validation.required(serviceType)) {
      showFieldError('contact-service', 'Please select an area of service interest.');
      isValid = false;
    }

    if (!Validation.required(message)) {
      showFieldError('contact-message', 'Please enter your message detailed description.');
      isValid = false;
    }

    if (isValid) {
      // Save contact inquiry in localStorage
      StorageManager.addInquiry({
        type: 'contact_message',
        name,
        phone,
        email,
        serviceType,
        message
      });

      // Show success modal feedback overlay
      showContactSuccessOverlay();
      contactForm.reset();
    }
  });
});

// Validation field layout decorator
function showFieldError(fieldId, errorMsg) {
  const inputEl = document.getElementById(fieldId);
  const group = inputEl.closest('.form-group');
  const errorEl = group.querySelector('.form-error');

  if (errorEl) {
    errorEl.innerText = errorMsg;
  }
  group.classList.add('has-error');
}

// Success popup visual decorator
function showContactSuccessOverlay() {
  const successModal = document.createElement('div');
  successModal.style.cssText = `
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(10,10,10,0.96);
    backdrop-filter: blur(15px);
    z-index: 10001;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.5s ease;
  `;

  successModal.innerHTML = `
    <div style="text-align: center; padding: 5rem; max-width: 500px; border: 1px solid var(--border-glass-gold); background: var(--color-dark-gray);">
      <svg viewBox="0 0 24 24" style="width: 80px; height: 80px; fill: var(--color-gold); margin-bottom: 2.5rem;"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/></svg>
      <h3 style="font-family: var(--font-headings); font-size: 3rem; margin-bottom: 1.5rem; color: var(--color-white);">Message Logged</h3>
      <p style="color: var(--color-silver); font-size: 1.5rem; margin-bottom: 3rem; line-height: 1.6;">Your inquiry has been successfully registered. Vikramaditya Raj's executive planning desk will reach out within 24 business hours.</p>
      <button class="btn btn-primary btn-close-success" style="padding: 1.2rem 3rem;">Acknowledge</button>
    </div>
  `;

  document.body.appendChild(successModal);

  setTimeout(() => successModal.style.opacity = '1', 50);

  successModal.querySelector('.btn-close-success').addEventListener('click', () => {
    successModal.style.opacity = '0';
    setTimeout(() => successModal.remove(), 500);
  });
}
