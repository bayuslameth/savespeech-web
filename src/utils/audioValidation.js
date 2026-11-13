// ─── Konstanta Validasi ───────────────────────────────────────────────────────
export const ALLOWED_EXT = [".wav", ".mp3", ".m4a"];
export const MAX_SIZE_MB = 25;
export const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
export const MAX_DURATION_SEC = 600; // 10 menit
export const MIN_DURATION_SEC = 3;

/** Daftar MIME type audio yang diterima */
const ALLOWED_MIME = new Set([
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/x-m4a",
  "audio/aac",
]);

// ─── Helper ───────────────────────────────────────────────────────────────────
/** Mengambil ekstensi file dalam huruf kecil, termasuk titik (mis. ".mp3") */
function getExt(file) {
  const dot = file.name.lastIndexOf(".");
  return dot === -1 ? "" : file.name.slice(dot).toLowerCase();
}

/** Format byte ke string manusiawi ("1.2 MB") */
export function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

/** Format detik ke "mm:ss" */
export function formatDuration(sec) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ─── Validasi Dasar (Sinkron) ─────────────────────────────────────────────────
/**
 * Memeriksa ekstensi, MIME type, dan ukuran file tanpa membaca isi.
 * @param {File} file
 * @returns {{ ok: boolean, error?: string }}
 */
export function validateBasic(file) {
  const ext = getExt(file);

  if (!ALLOWED_EXT.includes(ext)) {
    return {
      ok: false,
      error: "Format tidak didukung. Gunakan WAV, MP3, atau M4A.",
    };
  }

  // MIME kosong diizinkan asal ekstensi valid (beberapa sistem operasi tidak mengisi MIME)
  if (file.type && !ALLOWED_MIME.has(file.type)) {
    return {
      ok: false,
      error: "Format tidak didukung. Gunakan WAV, MP3, atau M4A.",
    };
  }

  if (file.size === 0) {
    return { ok: false, error: "File kosong tidak dapat diproses." };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return { ok: false, error: `Ukuran file melebihi ${MAX_SIZE_MB} MB.` };
  }

  return { ok: true };
}

// ─── Pemeriksaan Magic Bytes (Asinkron) ───────────────────────────────────────
/**
 * Membaca 12 byte pertama untuk memverifikasi format aktual file.
 * CATATAN: Ini hanya lapis pertahanan pertama di sisi klien.
 * Validasi sesungguhnya (dan yang bersifat keamanan) tetap dilakukan di server (Phase 5).
 *
 * @param {File} file
 * @returns {Promise<boolean>} true = magic bytes cocok, false = mencurigakan
 */
export async function checkMagicBytes(file) {
  try {
    const buffer = await file.slice(0, 12).arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const ext = getExt(file);

    if (ext === ".wav") {
      // WAV: bytes 0-3 = "RIFF", bytes 8-11 = "WAVE"
      const isRIFF =
        bytes[0] === 0x52 && // R
        bytes[1] === 0x49 && // I
        bytes[2] === 0x46 && // F
        bytes[3] === 0x46;   // F
      const isWAVE =
        bytes[8] === 0x57 && // W
        bytes[9] === 0x41 && // A
        bytes[10] === 0x56 && // V
        bytes[11] === 0x45;  // E
      return isRIFF && isWAVE;
    }

    if (ext === ".mp3") {
      // MP3: "ID3" (ID3v2 header) atau sync frame 0xFF diikuti 0xE0-0xFF
      const isID3 =
        bytes[0] === 0x49 && // I
        bytes[1] === 0x44 && // D
        bytes[2] === 0x33;   // 3
      const isFrameSync =
        bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0;
      return isID3 || isFrameSync;
    }

    if (ext === ".m4a") {
      // M4A/MP4: "ftyp" di offset 4-7
      const isFtyp =
        bytes[4] === 0x66 && // f
        bytes[5] === 0x74 && // t
        bytes[6] === 0x79 && // y
        bytes[7] === 0x70;   // p
      return isFtyp;
    }

    // Ekstensi tidak dikenal (seharusnya sudah tertangkap validateBasic)
    return false;
  } catch {
    // Gagal baca → anggap tidak valid
    return false;
  }
}

// ─── Pembacaan Durasi (Asinkron) ──────────────────────────────────────────────
/**
 * Mendapatkan durasi audio dengan membuat elemen Audio sementara.
 * Object URL di-revoke setelah selesai atau timeout.
 *
 * @param {File} file
 * @returns {Promise<number>} durasi dalam detik, atau -1 jika gagal
 */
export function getAudioDuration(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    let settled = false;

    // Timeout 8 detik agar tidak menggantung selamanya
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        // Bersihkan object URL agar tidak bocor memori
        URL.revokeObjectURL(url);
        audio.src = "";
        resolve(-1);
      }
    }, 8000);

    audio.addEventListener("loadedmetadata", () => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        const dur = audio.duration;
        // Bersihkan setelah metadata terbaca
        URL.revokeObjectURL(url);
        audio.src = "";
        resolve(Number.isFinite(dur) ? dur : -1);
      }
    });

    audio.addEventListener("error", () => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        URL.revokeObjectURL(url);
        audio.src = "";
        resolve(-1);
      }
    });

    audio.src = url;
    // Picu loading metadata tanpa memainkan audio
    audio.load();
  });
}

// ─── Validasi Lengkap (Asinkron) ──────────────────────────────────────────────
/**
 * Menjalankan validateBasic → checkMagicBytes → getAudioDuration secara berurutan.
 *
 * @param {File} file
 * @returns {Promise<{ ok: boolean, error?: string, duration?: number }>}
 */
export async function validateFull(file) {
  // 1. Validasi dasar (ekstensi, MIME, ukuran)
  const basic = validateBasic(file);
  if (!basic.ok) return basic;

  // 2. Pemeriksaan magic bytes — lindungi dari file yang namanya diganti
  const magicOk = await checkMagicBytes(file);
  if (!magicOk) {
    return {
      ok: false,
      error: "Isi file tidak sesuai dengan format audio yang dinyatakan.",
    };
  }

  // 3. Pembacaan durasi
  const duration = await getAudioDuration(file);
  if (duration < 0) {
    return {
      ok: false,
      error: "Tidak dapat membaca durasi file. Pastikan file audio tidak rusak.",
    };
  }

  if (duration > MAX_DURATION_SEC) {
    return { ok: false, error: "Durasi melebihi 10 menit." };
  }

  if (duration < MIN_DURATION_SEC) {
    return {
      ok: false,
      error: `Durasi terlalu pendek (minimal ${MIN_DURATION_SEC} detik).`,
    };
  }

  return { ok: true, duration };
}
