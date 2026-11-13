/**
 * src/services/api.js
 * ───────────────────
 * Layanan autentikasi terhubung ke endpoint FastAPI nyata (Phase 9):
 * - POST /api/auth/login
 * - POST /api/auth/register
 * - POST /api/auth/logout (opsional/best effort)
 */

import { apiFetch } from "../utils/fetcher";

/**
 * Melakukan login pengguna ke sistem.
 *
 * @param {object} params
 * @param {string} params.email
 * @param {string} params.password
 * @returns {Promise<{ user: object, token: string }>}
 */
export async function login({ email, password }) {
  const cleanEmail = String(email || "").trim().toLowerCase();
  const cleanPassword = String(password || "");

  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
  });

  // Normalisasi respon backend FastAPI (mendukung token atau access_token)
  const token = data.token || data.access_token;
  const user = data.user || {
    id: data.id || data.user_id || "usr-01",
    nama: data.nama || data.name || cleanEmail.split("@")[0],
    email: data.email || cleanEmail,
    role: data.role || "user",
  };

  return { user, token };
}

/**
 * Mendaftarkan akun baru ke sistem.
 *
 * @param {object} params
 * @param {string} params.nama
 * @param {string} params.email
 * @param {string} params.password
 * @returns {Promise<{ user: object, token: string }>}
 */
export async function register({ nama, email, password }) {
  const cleanNama = String(nama || "").trim();
  const cleanEmail = String(email || "").trim().toLowerCase();
  const cleanPassword = String(password || "");

  const data = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      nama: cleanNama,
      email: cleanEmail,
      password: cleanPassword,
    }),
  });

  const token = data.token || data.access_token || null;
  const user = data.user || {
    id: data.id || data.user_id || `usr-${Date.now()}`,
    nama: data.nama || data.name || cleanNama,
    email: data.email || cleanEmail,
    role: data.role || "user",
  };

  return { user, token };
}

/**
 * Menghapus sesi otentikasi di sisi backend jika didukung.
 *
 * @param {string} [token]
 * @returns {Promise<{ success: boolean }>}
 */
export async function logout(token = null) {
  try {
    await apiFetch("/auth/logout", { method: "POST" }, token);
  } catch {
    // Abaikan jika endpoint logout tidak diimplementasikan di backend
  }
  return { success: true };
}
