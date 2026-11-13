// ============================================================================
// src/services/adminApi.js
// GANTI DENGAN FETCH KE BACKEND DI PHASE 9
// Endpoint masa depan:
//   getAggregateStats → GET /api/admin/stats
//   getSystemLogs     → GET /api/admin/logs
//
// Kepatuhan SEC-09: Tidak ada transkrip percakapan, nama asli pengguna,
// atau email lengkap dalam data log yang dikembalikan.
// ============================================================================

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mengambil statistik agregat sistem.
 * GANTI DENGAN: GET /api/admin/stats (Authorization: Bearer <token>)
 */
export async function getAggregateStats() {
  await delay(700);

  return {
    // Statistik umum harian
    totalAnalysisToday: 142,
    totalAnalysisWeek: 894,
    totalAnalysisAllTime: 12_847,
    avgProcessTimeSec: 4.3,
    successRate: 97.8, // persen
    systemUptimePercent: 99.94,

    // Distribusi kategori scam (hitungan minggu ini, tanpa data pribadi)
    scamCategoryDistribution: [
      { key: "BANK_IMPERSONATION", label: "Penipuan Impersonasi Bank", count: 312, color: "from-red-500 to-red-600" },
      { key: "OTP_SCAM", label: "Pencurian Kode OTP", count: 218, color: "from-orange-500 to-orange-600" },
      { key: "TRANSFER_SCAM", label: "Modus Instruksi Transfer", count: 189, color: "from-yellow-500 to-yellow-600" },
      { key: "E_WALLET_IMPERSONATION", label: "Penipuan Dompet Digital", count: 101, color: "from-violet-500 to-violet-600" },
      { key: "ACCOUNT_BLOCKING_SCAM", label: "Ancaman Pemblokiran Akun", count: 74, color: "from-cyan-500 to-cyan-600" },
    ],

    // Distribusi label hasil analisis (minggu ini)
    labelDistribution: [
      { label: "SCAM", count: 487, color: "from-red-500 to-pink-600" },
      { label: "SUSPICIOUS", count: 213, color: "from-yellow-500 to-orange-500" },
      { label: "NORMAL", count: 194, color: "from-emerald-500 to-cyan-500" },
    ],

    // Metrik kualitas model (agregat anonim)
    falsePositiveReportedPercent: 1.2,
    modelVersion: "savespeech-ai-v2.1.0",
    lastModelUpdate: "2026-11-01T00:00:00.000Z",
  };
}

/**
 * Mengambil log aktivitas operasional sistem.
 * GANTI DENGAN: GET /api/admin/logs (Authorization: Bearer <token>)
 *
 * SEC-09: Tidak ada transkrip, nama asli, atau email lengkap dalam log.
 * IP disamarkan (hanya 3 oktet pertama yang ditampilkan).
 */
export async function getSystemLogs() {
  await delay(600);

  // Fungsi untuk membuat timestamp mundur N menit dari sekarang
  const minsAgo = (n) => new Date(Date.now() - n * 60_000).toISOString();

  return [
    {
      id: "log-001",
      timestamp: minsAgo(1),
      event: "ANALYSIS_COMPLETED",
      status: "SUCCESS",
      maskedIp: "182.253.xxx.xxx",
      detail: "Job selesai dalam 3.8 detik · label: SCAM · kategori: BANK_IMPERSONATION",
      jobId: "0b82f0c7-1a4e-4f32",
    },
    {
      id: "log-002",
      timestamp: minsAgo(3),
      event: "UPLOAD_RECEIVED",
      status: "SUCCESS",
      maskedIp: "114.122.xxx.xxx",
      detail: "Berkas audio diterima · ukuran: 2.4 MB · format: mp3",
      jobId: "7f41a8b2-3c9d-4e12",
    },
    {
      id: "log-003",
      timestamp: minsAgo(7),
      event: "ANALYSIS_COMPLETED",
      status: "SUCCESS",
      maskedIp: "36.77.xxx.xxx",
      detail: "Job selesai dalam 5.1 detik · label: NORMAL · kategori: -",
      jobId: "e2a91b44-8d7f-410a",
    },
    {
      id: "log-004",
      timestamp: minsAgo(12),
      event: "UPLOAD_FAILED",
      status: "ERROR",
      maskedIp: "103.49.xxx.xxx",
      detail: "Berkas ditolak · penyebab: ukuran melebihi batas 25 MB",
      jobId: "3d5c90e1-f62a-43bb",
    },
    {
      id: "log-005",
      timestamp: minsAgo(18),
      event: "ANALYSIS_COMPLETED",
      status: "SUCCESS",
      maskedIp: "118.137.xxx.xxx",
      detail: "Job selesai dalam 4.0 detik · label: SUSPICIOUS · kategori: OTP_SCAM",
      jobId: "a1b2c3d4-e5f6-7890",
    },
    {
      id: "log-006",
      timestamp: minsAgo(25),
      event: "TRANSCRIPTION_FAILED",
      status: "ERROR",
      maskedIp: "180.244.xxx.xxx",
      detail: "Transkripsi gagal · penyebab: kualitas audio terlalu rendah (SNR < 10 dB)",
      jobId: "b2c3d4e5-f6a7-8901",
    },
    {
      id: "log-007",
      timestamp: minsAgo(31),
      event: "ANALYSIS_COMPLETED",
      status: "SUCCESS",
      maskedIp: "125.160.xxx.xxx",
      detail: "Job selesai dalam 3.5 detik · label: SCAM · kategori: TRANSFER_SCAM",
      jobId: "c3d4e5f6-a7b8-9012",
    },
    {
      id: "log-008",
      timestamp: minsAgo(45),
      event: "RATE_LIMIT_HIT",
      status: "WARNING",
      maskedIp: "202.67.xxx.xxx",
      detail: "Batas permintaan API tercapai · ambang batas: 10 req/menit per IP",
      jobId: null,
    },
    {
      id: "log-009",
      timestamp: minsAgo(52),
      event: "ANALYSIS_COMPLETED",
      status: "SUCCESS",
      maskedIp: "112.215.xxx.xxx",
      detail: "Job selesai dalam 6.2 detik · label: SCAM · kategori: E_WALLET_IMPERSONATION",
      jobId: "d4e5f6a7-b8c9-0123",
    },
    {
      id: "log-010",
      timestamp: minsAgo(68),
      event: "SYSTEM_HEALTH_CHECK",
      status: "SUCCESS",
      maskedIp: "127.0.xxx.xxx",
      detail: "Health check rutin · CPU: 23% · RAM: 4.1 GB / 16 GB · Queue: 0 jobs pending",
      jobId: null,
    },
    {
      id: "log-011",
      timestamp: minsAgo(75),
      event: "UPLOAD_RECEIVED",
      status: "SUCCESS",
      maskedIp: "36.82.xxx.xxx",
      detail: "Berkas audio diterima · ukuran: 1.8 MB · format: wav",
      jobId: "e5f6a7b8-c9d0-1234",
    },
    {
      id: "log-012",
      timestamp: minsAgo(90),
      event: "ANALYSIS_COMPLETED",
      status: "SUCCESS",
      maskedIp: "149.113.xxx.xxx",
      detail: "Job selesai dalam 4.7 detik · label: SUSPICIOUS · kategori: ACCOUNT_BLOCKING_SCAM",
      jobId: "f6a7b8c9-d0e1-2345",
    },
  ];
}
