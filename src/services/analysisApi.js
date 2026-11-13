/**
 * src/services/analysisApi.js
 * ───────────────────────────
 * Layanan integrasi backend riil untuk pipeline analisis audio (Phase 9):
 * - POST   /api/analyze       (unggah multipart berkas audio)
 * - GET    /api/jobs/{job_id} (polling status transkripsi & inferensi)
 * - GET    /api/results/{job_id} (pengambilan hasil analisis lengkap)
 * - DELETE /api/jobs/{job_id} (pembatalan proses analisis berjalan)
 */

import { apiFetch } from "../utils/fetcher";

/**
 * Memulai pekerjaan analisis dengan mengunggah berkas audio.
 * Menggunakan FormData (browser otomatis mengatur header multipart/form-data dan boundary).
 *
 * @param {File} file - Berkas audio pengguna
 * @param {string|null} [token=null] - Token JWT otentikasi
 * @param {AbortSignal} [signal] - Sinyal pembatalan fetch opsional
 * @returns {Promise<{ jobId: string }>}
 */
export async function startAnalysis(file, token = null, signal = undefined) {
  // Fleksibilitas urutan argumen jika dipanggil sebagai (file, signal)
  let actualToken = token;
  let actualSignal = signal;

  if (token instanceof AbortSignal || (token && typeof token === "object" && "aborted" in token)) {
    actualSignal = token;
    actualToken = null;
  }

  const formData = new FormData();
  formData.append("file", file);

  const data = await apiFetch(
    "/analyze",
    {
      method: "POST",
      body: formData,
      signal: actualSignal,
    },
    actualToken
  );

  return {
    jobId: data.jobId || data.job_id || data.id,
    ...data,
  };
}

/**
 * Mengambil status terkini pekerjaan analisis dari backend FastAPI.
 * Endpoint: GET /api/jobs/{job_id}
 *
 * @param {string} jobId - ID pekerjaan analisis
 * @param {string|null} [token=null] - Token JWT otentikasi
 * @param {AbortSignal} [signal] - Sinyal pembatalan fetch opsional
 * @returns {Promise<{ jobId: string, status: string, progress: number, errorMessage?: string }>}
 */
export async function getJobStatus(jobId, token = null, signal = undefined) {
  let actualToken = token;
  let actualSignal = signal;

  if (token instanceof AbortSignal || (token && typeof token === "object" && "aborted" in token)) {
    actualSignal = token;
    actualToken = null;
  }

  const data = await apiFetch(
    `/jobs/${jobId}`,
    {
      method: "GET",
      signal: actualSignal,
    },
    actualToken
  );

  return {
    jobId: data.jobId || data.job_id || jobId,
    status: data.status,
    progress: data.progress ?? 0,
    errorMessage: data.errorMessage || data.error_message || data.detail || null,
    ...data,
  };
}

/**
 * Mengambil hasil analisis lengkap setelah pekerjaan berstatus 'done'.
 * Endpoint: GET /api/results/{job_id}
 *
 * @param {string} jobId - ID pekerjaan analisis
 * @param {string|null} [token=null] - Token JWT otentikasi
 * @param {AbortSignal} [signal] - Sinyal pembatalan fetch opsional
 * @returns {Promise<object>}
 */
export async function getResult(jobId, token = null, signal = undefined) {
  let actualToken = token;
  let actualSignal = signal;

  if (token instanceof AbortSignal || (token && typeof token === "object" && "aborted" in token)) {
    actualSignal = token;
    actualToken = null;
  }

  const data = await apiFetch(
    `/results/${jobId}`,
    {
      method: "GET",
      signal: actualSignal,
    },
    actualToken
  );

  return {
    jobId: data.jobId || data.job_id || jobId,
    label: data.label,
    scamCategory: data.scamCategory || data.scam_category || null,
    riskScore: data.riskScore ?? data.risk_score ?? 0,
    riskLevel: data.riskLevel || data.risk_level || "Low",
    explanation: data.explanation || "",
    indicators: data.indicators || [],
    transcript: data.transcript || [],
    ...data,
  };
}

/**
 * Membatalkan pekerjaan analisis yang sedang berjalan.
 * Endpoint: DELETE /api/jobs/{job_id}
 *
 * @param {string} jobId - ID pekerjaan analisis
 * @param {string|null} [token=null] - Token JWT otentikasi
 * @param {AbortSignal} [signal] - Sinyal pembatalan fetch opsional
 */
export async function cancelAnalysis(jobId, token = null, signal = undefined) {
  let actualToken = token;
  let actualSignal = signal;

  if (token instanceof AbortSignal || (token && typeof token === "object" && "aborted" in token)) {
    actualSignal = token;
    actualToken = null;
  }

  try {
    return await apiFetch(
      `/jobs/${jobId}`,
      {
        method: "DELETE",
        signal: actualSignal,
      },
      actualToken
    );
  } catch {
    // Abaikan jika pembatalan gagal karena job sudah selesai
    return { success: false };
  }
}
