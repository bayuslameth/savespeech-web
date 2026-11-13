/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useCallback, useContext, useEffect } from "react";
import * as authApi from "../services/api";

export const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
}

const TOKEN_STORAGE_KEY = "savespeech_token";
const USER_STORAGE_KEY = "savespeech_user";
const PREFERENCES_STORAGE_KEY = "savespeech_user_preferences";

/**
 * onLogoutCallback memungkinkan provider lain (mis. AnalysisProvider)
 * mendaftarkan fungsi cleanup yang dipanggil saat logout.
 */
export function AuthProvider({ children, onLogoutCallback }) {
  // Inisialisasi token dari sessionStorage (mempertahankan sesi saat F5, hilang saat tab ditutup)
  const [token, setToken] = useState(() => {
    try {
      return sessionStorage.getItem(TOKEN_STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });

  // Inisialisasi user dari sessionStorage
  const [user, setUser] = useState(() => {
    try {
      const savedUser = sessionStorage.getItem(USER_STORAGE_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

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

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authApi.logout(token);
    } catch {
      // Abaikan jika server logout gagal
    } finally {
      // Hapus token dan user dari sessionStorage secara tuntas
      try {
        sessionStorage.removeItem(TOKEN_STORAGE_KEY);
        sessionStorage.removeItem(USER_STORAGE_KEY);
      } catch {
        // Abaikan
      }
      setUser(null);
      setToken(null);
      setLoading(false);

      // Panggil cleanup eksternal (mis. clearFile dari AnalysisContext) saat logout
      if (typeof onLogoutCallback === "function") {
        onLogoutCallback();
      }
    }
  }, [token, onLogoutCallback]);

  // Interseptor efek global: Jika ada request apiFetch yang menghasilkan HTTP 401 Unauthorized,
  // jalankan logout otomatis.
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [logout]);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await authApi.login({ email, password });
      setUser(response.user);
      setToken(response.token);

      // Simpan sesi ke sessionStorage
      try {
        if (response.token) {
          sessionStorage.setItem(TOKEN_STORAGE_KEY, response.token);
        }
        if (response.user) {
          sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
        }
      } catch {
        // Abaikan
      }

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

      // Simpan sesi ke sessionStorage jika registrasi mengembalikan token
      try {
        if (response.token) {
          sessionStorage.setItem(TOKEN_STORAGE_KEY, response.token);
        }
        if (response.user) {
          sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
        }
      } catch {
        // Abaikan
      }

      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  // Memperbarui profil pengguna (nama lengkap)
  const updateProfile = useCallback(async ({ nama }) => {
    setLoading(true);
    try {
      const cleanNama = String(nama || "").trim();
      if (!cleanNama) {
        throw new Error("Nama lengkap tidak boleh kosong");
      }
      setUser((prev) => {
        if (!prev) return null;
        const updated = { ...prev, nama: cleanNama };
        try {
          sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // Abaikan
        }
        return updated;
      });
      return { success: true, nama: cleanNama };
    } finally {
      setLoading(false);
    }
  }, []);

  // Memperbarui kata sandi akun
  const updatePassword = useCallback(async ({ currentPassword, newPassword }) => {
    setLoading(true);
    try {
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
