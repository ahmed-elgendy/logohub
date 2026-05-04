// Simple client-side admin auth using localStorage.
// NOTE: For real security, replace with Lovable Cloud auth + roles.

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";
const AUTH_KEY = "logohub_admin_auth";

export const login = (username: string, password: string): boolean => {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    localStorage.setItem(AUTH_KEY, "true");
    window.dispatchEvent(new Event("auth-change"));
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event("auth-change"));
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_KEY) === "true";
};
