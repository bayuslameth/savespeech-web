/**
 * src/services/adminApi.js
 * ────────────────────────
 * Layanan khusus Administrator terhubung ke backend FastAPI (Phase 9):
 * - GET /api/admin/stats (Statistik agregat operasional)
 * - GET /api/admin/logs  (Log aktivitas audit sistem)
 *
 * Kepatuhan SEC-09: Tidak memuat transkrip percakapan atau identitas pengguna.
 */

import { apiFetch } from "../utils/fetcher";

/**
 * Mengambil ringkasan statistik agregat sistem.
 * Endpoint: GET /api/admin/stats
 *
 * @param {string|null} [token=null] - Token JWT otentikasi
 * @returns {Promise<object>}
 */
export async function getAggregateStats(token = null) {
  const data = await apiFetch("/admin/stats", { method: "GET" }, token);

  return {
    totalAnalysisToday: data.totalAnalysisToday ?? data.total_analysis_today ?? 0,
    totalAnalysisWeek: data.totalAnalysisWeek ?? data.total_analysis_week ?? 0,
    totalAnalysisAllTime: data.totalAnalysisAllTime ?? data.total_analysis_all_time ?? 0,
    avgProcessTimeSec: data.avgProcessTimeSec ?? data.avg_process_time_sec ?? 0,
    successRate: data.successRate ?? data.success_rate ?? 0,
    systemUptimePercent: data.systemUptimePercent ?? data.system_uptime_percent ?? 99.9,
    scamCategoryDistribution: data.scamCategoryDistribution || data.scam_category_distribution || [],
    labelDistribution: data.labelDistribution || data.label_distribution || [],
    falsePositiveReportedPercent:
      data.falsePositiveReportedPercent ?? data.false_positive_reported_percent ?? 0,
    modelVersion: data.modelVersion || data.model_version || "savespeech-ai-v2.1.0",
    lastModelUpdate: data.lastModelUpdate || data.last_model_update || new Date().toISOString(),
    ...data,
  };
}

/**
 * Mengambil log aktivitas sistem untuk audit operasional.
 * Endpoint: GET /api/admin/logs
 *
 * @param {string|null} [token=null] - Token JWT otentikasi
 * @returns {Promise<Array>}
 */
export async function getSystemLogs(token = null) {
  const data = await apiFetch("/admin/logs", { method: "GET" }, token);

  if (Array.isArray(data)) {
    return data.map((log) => ({
      id: log.id || log.log_id,
      timestamp: log.timestamp || log.created_at || new Date().toISOString(),
      event: log.event,
      status: log.status,
      maskedIp: log.maskedIp || log.masked_ip || "0.0.0.xxx",
      detail: log.detail || log.message || "",
      jobId: log.jobId || log.job_id || null,
      ...log,
    }));
  }

  return [];
}
