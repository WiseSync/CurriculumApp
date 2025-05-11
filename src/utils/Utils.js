import AppConfig from '../app_config.js';

const Utils = {
  async signup(username, password) {
    const response = await fetch(`${AppConfig.ServiceUrl}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Signup failed');
    }
    return response.json();
  },

  async login(username, password) {
    const response = await fetch(`${AppConfig.ServiceUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Login failed');
    }
    return response.json();
  },

  async authenticate(username, token) {
    const response = await fetch(`${AppConfig.ServiceUrl}/authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, token }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Authentication failed');
    }
    return response.json();
  },

  async logout(username, token) {
    const response = await fetch(`${AppConfig.ServiceUrl}/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, token }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Logout failed');
    }
    return response.json();
  },
};

export default Utils;
