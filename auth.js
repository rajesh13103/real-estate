// js/auth.js
// Client-side Session Security Guard for the Admin Panel

const AUTH_KEY = 'luxury_re_session_token';

export const AuthManager = {
  login(username, password) {
    if (username === 'admin' && password === 'admin123') {
      const sessionData = {
        authenticated: true,
        user: 'admin',
        loginTime: new Date().getTime()
      };
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));
      return { success: true };
    }
    return { success: false, error: "Invalid credentials. Please verify your username and password." };
  },

  logout() {
    sessionStorage.removeItem(AUTH_KEY);
    window.location.href = 'login.html';
  },

  isAuthenticated() {
    const session = sessionStorage.getItem(AUTH_KEY);
    if (!session) return false;
    try {
      const data = JSON.parse(session);
      // Optional: Check session expiry (e.g., 2 hours)
      const twoHours = 2 * 60 * 60 * 1000;
      if (new Date().getTime() - data.loginTime > twoHours) {
        this.logout();
        return false;
      }
      return data.authenticated === true;
    } catch {
      return false;
    }
  },

  // Route Guard helper to redirect unauthorized users
  guardRoute() {
    if (!this.isAuthenticated()) {
      window.location.href = 'login.html';
    }
  },

  // Route Guard for login page to prevent re-login when active
  guardLoginPage() {
    if (this.isAuthenticated()) {
      window.location.href = 'admin.html';
    }
  }
};
