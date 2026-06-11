// js/validation.js
// Shared Input Form Validation Helpers

export const Validation = {
  // Verifies format for standard email addresses
  email(val) {
    if (!val) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val.trim());
  },

  // Verifies Indian mobile phone numbers (10 digits starting with 6-9)
  phone(val) {
    if (!val) return false;
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(val.trim().replace(/\s+/g, ''));
  },

  // Verifies if input is non-empty
  required(val) {
    return val !== undefined && val !== null && val.trim().length > 0;
  },

  // Verifies that a date is today or in the future
  futureDate(dateStr) {
    if (!dateStr) return false;
    const selectedDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }
};
