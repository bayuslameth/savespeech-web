// ============================================================================
// GANTI DENGAN FETCH KE BACKEND DI PHASE 9
// Endpoint masa depan sesuai PRD:
// - POST /api/auth/login
// - POST /api/auth/register
// ============================================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

export async function login({ email, password }) {
  await delay(800);

  const cleanEmail = String(email || "").trim().toLowerCase();
  const cleanPassword = String(password || "");

  // Validasi mock: email harus valid dan kata sandi minimal 8 karakter
  if (!EMAIL_REGEX.test(cleanEmail) || cleanPassword.length < 8) {
    // Pesan generik agar tidak membocorkan apakah email terdaftar (mencegah user enumeration)
    throw new Error("Email atau kata sandi salah");
  }

  // Nama tampilan diambil dari bagian lokal email untuk keperluan mock
  const rawName = cleanEmail.split("@")[0].replace(/[._-]+/g, " ");
  const formattedName = rawName.replace(/\b\w/g, (char) => char.toUpperCase());

  // Phase 8 RBAC: Tentukan role berdasarkan email
  // Jika email mengandung "admin" atau domain savespeech.com, berikan role admin
  const isAdmin =
    cleanEmail === "admin@savespeech.com" ||
    cleanEmail.includes("admin");

  return {
    user: {
      id: isAdmin ? "usr-admin-01" : "usr-mock-01",
      nama: isAdmin ? "Administrator" : (formattedName || "Pengguna Savespeech"),
      email: cleanEmail,
      role: isAdmin ? "admin" : "user", // RBAC role field
    },
    token: isAdmin
      ? "mock-jwt-admin-token-savespeech-phase8"
      : "mock-jwt-token-savespeech-phase2",
  };
}

export async function register({ nama, email, password }) {
  await delay(800);

  const cleanNama = String(nama || "").trim();
  const cleanEmail = String(email || "").trim().toLowerCase();
  const cleanPassword = String(password || "");

  if (!cleanNama) {
    throw new Error("Nama lengkap wajib diisi");
  }

  if (!EMAIL_REGEX.test(cleanEmail)) {
    throw new Error("Format alamat email tidak valid");
  }

  // Simulasi kasus email sudah terdaftar untuk pengujian UI error
  if (cleanEmail === "taken@example.com") {
    throw new Error("Email sudah terdaftar");
  }

  const hasUpper = /[A-Z]/.test(cleanPassword);
  const hasLower = /[a-z]/.test(cleanPassword);
  const hasNumber = /[0-9]/.test(cleanPassword);

  if (cleanPassword.length < 8 || !hasUpper || !hasLower || !hasNumber) {
    throw new Error("Kata sandi belum memenuhi syarat keamanan");
  }

  return {
    user: {
      id: `usr-${Date.now()}`,
      nama: cleanNama,
      email: cleanEmail,
      role: "user", // Pengguna baru selalu mendapat role user
    },
    token: `mock-jwt-token-${Date.now()}`,
  };
}

export async function logout() {
  await delay(250);
  return { success: true };
}
