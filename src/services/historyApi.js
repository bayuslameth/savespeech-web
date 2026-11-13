/**
 * src/services/historyApi.js
 * ───────────────────────────
 * Layanan MOCK untuk mengambil dan mengelola riwayat analisis percakapan.
 * GANTI DENGAN FETCH KE BACKEND saat backend tersedia (Phase 9):
 *   getHistory        → GET    /api/history
 *   deleteHistoryItem → DELETE /api/results/{id}
 *
 * Sesuai prinsip privasi dan Data Minimization (PRD SEC-05):
 * berkas audio rekaman tidak pernah disimpan di riwayat.
 */

// Data mock riwayat awal
let _mockHistoryData = [
  {
    id: "hist-001",
    jobId: "0b82f0c7-1a4e-4f32-8231-mock00000001",
    createdAt: "2026-11-12T14:30:00.000Z",
    fileName: "rekaman_petugas_bank_0812.mp3",
    label: "SCAM",
    scamCategory: "BANK_IMPERSONATION",
    riskScore: 94,
    riskLevel: "Critical",
    explanation:
      "Percakapan ini menunjukkan pola yang sangat kuat dari modus penipuan penyamaran petugas bank. Penelepon mendesak korban untuk membacakan kode OTP dan menginstruksikan transfer dana ke rekening penampung.",
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
    ],
    transcript: [
      { start: 0.0, end: 3.5, text: "Selamat siang, apakah benar ini dengan pemilik rekening?", flagged: false },
      { start: 3.5, end: 7.2, text: "Saya dari bagian keamanan bank, ada aktivitas mencurigakan di rekening Anda.", flagged: true },
      { start: 7.2, end: 12.0, text: "Tolong bacakan kode yang baru saja masuk ke HP Anda.", flagged: true },
    ],
  },
  {
    id: "hist-002",
    jobId: "7f41a8b2-3c9d-4e12-9102-mock00000002",
    createdAt: "2026-11-10T09:15:00.000Z",
    fileName: "telepon_kurir_paket_cod.m4a",
    label: "SUSPICIOUS",
    scamCategory: "OTP_SCAM",
    riskScore: 68,
    riskLevel: "High",
    explanation:
      "Terindikasi permintaan verifikasi tidak wajar dari pihak yang mengaku kurir paket. Meminta kode konfirmasi SMS untuk penerimaan barang.",
    indicators: [
      {
        code: "OTP_REQUEST",
        label: "Permintaan kode SMS",
        weight: 0.82,
        quote: "Kirimkan kode SMS 6 digit yang masuk untuk konfirmasi alamat paket Anda.",
      },
      {
        code: "URGENCY",
        label: "Ancaman retur paket",
        weight: 0.71,
        quote: "Kalau tidak dikirim sekarang, paket harus kami retur ke gudang pusat.",
      },
    ],
    transcript: [
      { start: 0.0, end: 4.0, text: "Halo selamat pagi, kurir ekspedisi mengonfirmasi paket COD.", flagged: false },
      { start: 4.0, end: 9.5, text: "Kirimkan kode SMS 6 digit yang masuk untuk konfirmasi alamat paket Anda.", flagged: true },
    ],
  },
  {
    id: "hist-003",
    jobId: "e2a91b44-8d7f-410a-b331-mock00000003",
    createdAt: "2026-11-08T16:45:00.000Z",
    fileName: "rapat_kerja_mingguan.wav",
    label: "NORMAL",
    scamCategory: null,
    riskScore: 12,
    riskLevel: "Low",
    explanation:
      "Percakapan berjalan normal dalam konteks koordinasi pekerjaan. Tidak ditemukan indikator rekayasa sosial, ancaman, maupun permintaan kredensial sensitif.",
    indicators: [],
    transcript: [
      { start: 0.0, end: 4.2, text: "Selamat sore semuanya, mari kita mulai koordinasi pekerjaan hari ini.", flagged: false },
      { start: 4.2, end: 8.5, text: "Progres laporan mingguan sudah selesai disusun dan siap ditinjau.", flagged: false },
    ],
  },
  {
    id: "hist-004",
    jobId: "3d5c90e1-f62a-43bb-a128-mock00000004",
    createdAt: "2026-11-05T11:20:00.000Z",
    fileName: "undian_berhadiah_official.mp3",
    label: "SCAM",
    scamCategory: "TRANSFER_SCAM",
    riskScore: 88,
    riskLevel: "High",
    explanation:
      "Terindikasi kuat modus penipuan undian berhadiah palsu. Penelepon meminta korban mentransfer biaya administrasi dan pajak hadiah sebelum dana dapat dicairkan.",
    indicators: [
      {
        code: "TRANSFER_INSTRUCTION",
        label: "Instruksi transfer uang",
        weight: 0.91,
        quote: "Silakan transfer biaya administrasi pajak pemenang sebesar lima ratus ribu rupiah.",
      },
      {
        code: "URGENCY",
        label: "Batas waktu klaim",
        weight: 0.84,
        quote: "Hadiah hanya berlaku hingga pukul 12 siang ini.",
      },
    ],
    transcript: [
      { start: 0.0, end: 5.0, text: "Selamat, nomor Anda terpilih sebagai pemenang undian tahunan!", flagged: false },
      { start: 5.0, end: 11.2, text: "Silakan transfer biaya administrasi pajak pemenang sebesar lima ratus ribu rupiah.", flagged: true },
    ],
  },
];

/** Simulasi penundaan async */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mengambil daftar riwayat analisis pengguna.
 * GANTI DENGAN: GET /api/history (dengan Authorization: Bearer <token>)
 */
export async function getHistory() {
  await delay(600);
  // Kembalikan salinan array agar mutasi tidak merusak referensi langsung
  return [..._mockHistoryData];
}

/**
 * Menghapus satu item riwayat berdasarkan ID.
 * GANTI DENGAN: DELETE /api/results/{id} (dengan Authorization: Bearer <token>)
 *
 * @param {string} id - ID riwayat yang akan dihapus
 */
export async function deleteHistoryItem(id) {
  await delay(400);
  _mockHistoryData = _mockHistoryData.filter((item) => item.id !== id);
  return { success: true };
}

/**
 * Menambahkan hasil analisis baru ke riwayat lokal saat analisis selesai.
 *
 * @param {object} result - Objek hasil analisis
 * @param {string} [fileName] - Nama berkas audio yang dianalisis
 */
export function addHistoryItem(result, fileName) {
  if (!result) return null;
  const newItem = {
    id: `hist-${Date.now()}`,
    jobId: result.jobId,
    createdAt: new Date().toISOString(),
    fileName: fileName || "audio_recording.mp3",
    label: result.label,
    scamCategory: result.scamCategory,
    riskScore: result.riskScore,
    riskLevel: result.riskLevel,
    explanation: result.explanation,
    indicators: result.indicators || [],
    transcript: result.transcript || [],
  };
  _mockHistoryData.unshift(newItem);
  return newItem;
}
