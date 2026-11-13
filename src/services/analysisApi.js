/**
 * src/services/analysisApi.js
 * ────────────────────────────
 * MOCK service untuk pipeline analisis audio.
 * GANTI DENGAN FETCH KE BACKEND saat backend tersedia (Phase 5–7):
 *   startAnalysis → POST /api/analyze
 *   getJobStatus  → GET  /api/jobs/{jobId}
 *   getResult     → GET  /api/results/{jobId}
 *   cancelAnalysis→ DELETE /api/jobs/{jobId}
 *
 * Semua fungsi menerima AbortSignal opsional (akan digunakan di Phase 5).
 */

// Penyimpanan internal mock: { [jobId]: { startTime, cancelled } }
const _jobStore = new Map();

/** Simulasi delay async */
function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(timer);
        reject(new DOMException("Dibatalkan", "AbortError"));
      });
    }
  });
}

// ─── Contoh hasil realistis (MOCK) ───────────────────────────────────────────
const MOCK_RESULT = {
  label: "SCAM",
  scamCategory: "BANK_IMPERSONATION",
  riskScore: 94,
  riskLevel: "Critical",
  explanation:
    "Percakapan ini menunjukkan pola yang sangat kuat dari modus penipuan penyamaran petugas bank. " +
    "Penipu mengklaim sebagai petugas bank, menciptakan urgensi palsu tentang pemblokiran rekening, " +
    "dan secara aktif meminta OTP serta data rekening sensitif dari korban.",
  indicators: [
    {
      code: "IMPERSONATION",
      label: "Mengaku petugas bank",
      weight: 0.92,
      quote: "Saya dari bagian keamanan bank, ada aktivitas mencurigakan di rekening Anda.",
    },
    {
      code: "OTP_REQUEST",
      label: "Permintaan kode OTP",
      weight: 0.98,
      quote: "Tolong bacakan kode yang baru saja masuk ke HP Anda agar kami bisa memverifikasi.",
    },
    {
      code: "URGENCY",
      label: "Tekanan waktu dan urgensi",
      weight: 0.85,
      quote: "Anda harus konfirmasi sekarang, kalau tidak rekening akan diblokir dalam 10 menit.",
    },
    {
      code: "TRANSFER_INSTRUCTION",
      label: "Instruksi transfer dana",
      weight: 0.88,
      quote: "Pindahkan saldo Anda ke rekening penampung sementara yang aman dari kami.",
    },
    {
      code: "ACCOUNT_THREAT",
      label: "Ancaman pemblokiran rekening",
      weight: 0.79,
      quote: "Rekening Anda sudah masuk daftar blokir, segera ikuti prosedur kami.",
    },
  ],
  transcript: [
    { start: 0.0, end: 3.5, text: "Selamat siang, apakah benar ini dengan Bapak/Ibu pengguna rekening?", flagged: false },
    { start: 3.5, end: 7.2, text: "Saya dari bagian keamanan bank, ada aktivitas mencurigakan di rekening Anda.", flagged: true },
    { start: 7.2, end: 11.0, text: "Rekening Anda sudah masuk daftar blokir, segera ikuti prosedur kami.", flagged: true },
    { start: 11.0, end: 14.5, text: "Anda harus konfirmasi sekarang, kalau tidak rekening akan diblokir dalam 10 menit.", flagged: true },
    { start: 14.5, end: 18.0, text: "Baik pak, lalu saya harus bagaimana?", flagged: false },
    { start: 18.0, end: 22.3, text: "Tolong bacakan kode yang baru saja masuk ke HP Anda agar kami bisa memverifikasi.", flagged: true },
    { start: 22.3, end: 26.1, text: "Ini untuk keamanan rekening Bapak/Ibu, prosedur standar bank kami.", flagged: true },
    { start: 26.1, end: 30.4, text: "Pindahkan saldo Anda ke rekening penampung sementara yang aman dari kami.", flagged: true },
    { start: 30.4, end: 34.0, text: "Nanti saldo akan dikembalikan otomatis setelah proses verifikasi selesai.", flagged: true },
    { start: 34.0, end: 37.5, text: "Terima kasih atas kerjasamanya, tim kami akan memproses dalam 1x24 jam.", flagged: false },
  ],
};

// ─── API Publik ───────────────────────────────────────────────────────────────

/**
 * Memulai pekerjaan analisis (MOCK).
 * GANTI DENGAN: POST /api/analyze (dengan FormData berisi file audio).
 *
 * @param {File} _file - File audio (tidak digunakan di mock)
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ jobId: string }>}
 */
export async function startAnalysis(_file, signal) {
  await delay(600, signal);
  const jobId = crypto.randomUUID();
  _jobStore.set(jobId, { startTime: Date.now(), cancelled: false });
  return { jobId };
}

/**
 * Mengambil status pekerjaan (MOCK berbasis waktu sejak startAnalysis).
 * GANTI DENGAN: GET /api/jobs/{jobId}
 *
 * Timeline mock:
 *   0–2 dtk   → uploading   (0–20)
 *   2–7 dtk   → transcribing (20–65)
 *   7–11 dtk  → analyzing   (65–95)
 *   >11 dtk   → done        (100)
 *
 * Mode simulasi error (?simulate=error): failed di detik ke-5.
 *
 * @param {string} jobId
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ jobId, status, progress, errorMessage? }>}
 */
export async function getJobStatus(jobId, signal) {
  await delay(0, signal); // Izinkan abort segera

  const job = _jobStore.get(jobId);
  if (!job) {
    return { jobId, status: "failed", progress: 0, errorMessage: "Pekerjaan tidak ditemukan." };
  }

  if (job.cancelled) {
    return { jobId, status: "failed", progress: 0, errorMessage: "Dibatalkan oleh pengguna." };
  }

  const elapsed = (Date.now() - job.startTime) / 1000; // detik

  // Simulasi error bila URL mengandung ?simulate=error
  const isSimulateError =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("simulate") === "error";

  if (isSimulateError && elapsed >= 5) {
    return {
      jobId,
      status: "failed",
      progress: 42,
      errorMessage: "Transkripsi gagal diproses. Silakan coba lagi.",
    };
  }

  // Tahap normal
  if (elapsed < 2) {
    const progress = Math.min(20, Math.round((elapsed / 2) * 20));
    return { jobId, status: "uploading", progress };
  }
  if (elapsed < 7) {
    const progress = Math.min(65, Math.round(20 + ((elapsed - 2) / 5) * 45));
    return { jobId, status: "transcribing", progress };
  }
  if (elapsed < 11) {
    const progress = Math.min(95, Math.round(65 + ((elapsed - 7) / 4) * 30));
    return { jobId, status: "analyzing", progress };
  }

  return { jobId, status: "done", progress: 100 };
}

/**
 * Mengambil hasil analisis (MOCK).
 * GANTI DENGAN: GET /api/results/{jobId}
 *
 * @param {string} jobId
 * @param {AbortSignal} [signal]
 * @returns {Promise<object>}
 */
export async function getResult(jobId, signal) {
  await delay(300, signal);
  return { jobId, ...MOCK_RESULT };
}

/**
 * Membatalkan pekerjaan (MOCK).
 * GANTI DENGAN: DELETE /api/jobs/{jobId}
 *
 * @param {string} jobId
 */
export function cancelAnalysis(jobId) {
  const job = _jobStore.get(jobId);
  if (job) {
    job.cancelled = true;
  }
}
