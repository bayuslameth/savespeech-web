/**
 * src/services/historyApi.js
 * ───────────────────────────
 * Layanan riwayat analisis terhubung ke endpoint backend FastAPI (Phase 9):
 * - GET    /api/history
 * - DELETE /api/results/{id}
 *
 * Menjaga prinsip privasi (PRD SEC-05): Berkas audio rekaman tidak pernah disimpan.
 */

import { apiFetch } from "../utils/fetcher";

/**
 * Mengambil daftar riwayat analisis milik pengguna saat ini.
 * Endpoint: GET /api/history
 *
 * @param {string|null} [token=null] - Token JWT otentikasi
 * @returns {Promise<Array>}
 */
export async function getHistory(token = null) {
  const data = await apiFetch("/history", { method: "GET" }, token);

  if (Array.isArray(data)) {
    return data.map((item) => ({
      id: item.id || item.jobId || item.job_id,
      jobId: item.jobId || item.job_id || item.id,
      createdAt: item.createdAt || item.created_at || new Date().toISOString(),
      fileName: item.fileName || item.file_name || "audio_recording.mp3",
      label: item.label,
      scamCategory: item.scamCategory || item.scam_category || null,
      riskScore: item.riskScore ?? item.risk_score ?? 0,
      riskLevel: item.riskLevel || item.risk_level || "Low",
      explanation: item.explanation || "",
      indicators: item.indicators || [],
      transcript: item.transcript || [],
    }));
  }

  return [];
}

/**
 * Menghapus data riwayat analisis berdasarkan ID / Job ID.
 * Endpoint: DELETE /api/results/{id}
 *
 * @param {string} id - ID item riwayat / job_id
 * @param {string|null} [token=null] - Token JWT otentikasi
 * @returns {Promise<{ success: boolean }>}
 */
export async function deleteHistoryItem(id, token = null) {
  const response = await apiFetch(`/results/${id}`, { method: "DELETE" }, token);
  return response || { success: true };
}

/**
 * Helper sinkronisasi riwayat lokal (kompatibilitas antarmuka).
 * Pada backend riil, pencatatan dilakukan langsung di server jika opt-in aktif.
 *
 * @param {object} result - Objek hasil analisis
 * @param {string} [fileName] - Nama berkas audio
 */
export function addHistoryItem(result, fileName) {
  if (!result) return null;
  return {
    id: result.jobId,
    jobId: result.jobId,
    createdAt: new Date().toISOString(),
    fileName: fileName || "audio_recording.mp3",
    ...result,
  };
}
