/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useCallback, useContext } from "react";
import * as authApi from "../services/api";

export const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
}

const PREFERENCES_STORAGE_KEY = "savespeech_user_preferences";

/**
 * onLogoutCallback memungkinkan provider lain (mis. AnalysisProvider)
 * mendaftarkan fungsi cleanup yang dipanggil saat logout.
 */
export function AuthProvider({ children, onLogoutCallback }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // Preferensi privasi pengguna (FR-20: default saveHistory adalah false)
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Abaikan error parsing
    }
    return { saveHistory: false };
  });

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await authApi.login({ email, password });
      setUser(response.user);
      setToken(response.token);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async ({ nama, email, password }) => {
    setLoading(true);
    try {
      const response = await authApi.register({ nama, email, password });
      setUser(response.user);
      setToken(response.token);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  // Memperbarui profil pengguna (nama lengkap)
  const updateProfile = useCallback(async ({ nama }) => {
    setLoading(true);
    try {
      // Simulasi delay request
      await new Promise((resolve) => setTimeout(resolve, 400));
      const cleanNama = String(nama || "").trim();
      if (!cleanNama) {
        throw new Error("Nama lengkap tidak boleh kosong");
      }
      setUser((prev) => (prev ? { ...prev, nama: cleanNama } : null));
      return { success: true, nama: cleanNama };
    } finally {
      setLoading(false);
    }
  }, []);

  // Memperbarui kata sandi akun
  const updatePassword = useCallback(async ({ currentPassword, newPassword }) => {
    setLoading(true);
    try {
      // Simulasi delay request
      await new Promise((resolve) => setTimeout(resolve, 600));
      if (!currentPassword) {
        throw new Error("Kata sandi saat ini wajib diisi");
      }
      const hasUpper = /[A-Z]/.test(newPassword);
      const hasLower = /[a-z]/.test(newPassword);
      const hasNumber = /[0-9]/.test(newPassword);
      if (newPassword.length < 8 || !hasUpper || !hasLower || !hasNumber) {
        throw new Error("Kata sandi baru belum memenuhi syarat keamanan");
      }
      return { success: true };
    } finally {
      setLoading(false);
    }
  }, []);

  // Memperbarui preferensi privasi (FR-20 Opt-in Riwayat)
  const updatePreferences = useCallback((newPreferences) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...newPreferences };
      try {
        localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Abaikan jika localStorage tidak tersedia
      }
      return updated;
    });
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setToken(null);
      setLoading(false);
      // Panggil cleanup eksternal (mis. clearFile dari AnalysisContext) saat logout
      if (typeof onLogoutCallback === "function") {
        onLogoutCallback();
      }
    }
  }, [onLogoutCallback]);

  const value = {
    user,
    token,
    loading,
    preferences,
    isAuthenticated: Boolean(user && token),
    login,
    register,
    updateProfile,
    updatePassword,
    updatePreferences,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
