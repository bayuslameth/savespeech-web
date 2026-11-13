/**
 * src/utils/fetcher.js
 * ────────────────────
 * Wrapper fetch terpusat untuk komunikasi dengan backend FastAPI.
 * Mengelola Base URL, otentikasi JWT Bearer, timeout, penanganan FormData,
 * format error FastAPI, dan trigger auto-logout pada respon 401.
 */

const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/\/+$/, "");

/**
 * Normalisasi URL endpoint agar tidak terjadi duplikasi '/api/api'.
 * Contoh:
 *   normalizeUrl("/auth/login")     -> "http://localhost:8000/api/auth/login"
 *   normalizeUrl("/api/auth/login") -> "http://localhost:8000/api/auth/login"
 */
export function normalizeUrl(endpoint) {
  let path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  if (BASE_URL.endsWith("/api") && path.startsWith("/api/")) {
    path = path.slice(4);
  }
  return `${BASE_URL}${path}`;
}

/**
 * Wrapper native fetch utama untuk seluruh request aplikasi.
 *
 * @param {string} endpoint - Path endpoint (mis. "/auth/login" atau "/analyze")
 * @param {RequestInit & { timeout?: number }} [options={}] - Opsi fetch (method, body, signal, timeout)
 * @param {string|null} [token=null] - Token JWT opsional (jika kosong, membaca dari sessionStorage)
 * @returns {Promise<any>}
 */
export async function apiFetch(endpoint, options = {}, token = null) {
  const url = normalizeUrl(endpoint);
  const { timeout = 60000, signal: externalSignal, headers = {}, ...customOptions } = options;

  // Siapkan header permintaan
  const reqHeaders = { ...headers };

  // Prioritaskan token dari parameter, fallback ke sessionStorage jika tersedia
  const authToken =
    token || (typeof window !== "undefined" ? sessionStorage.getItem("savespeech_token") : null);

  if (authToken) {
    reqHeaders["Authorization"] = `Bearer ${authToken}`;
  }

  // Jika body BUKAN FormData dan header Content-Type belum diset secara eksplisit,
  // gunakan application/json. Jika FormData, biarkan browser menyematkan multipart boundary.
  const isFormData = customOptions.body instanceof FormData;
  if (!isFormData && !reqHeaders["Content-Type"]) {
    reqHeaders["Content-Type"] = "application/json";
  }

  // Pengendalian batas waktu tunggu (timeout)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort(new DOMException("Waktu permintaan habis (timeout).", "TimeoutError"));
  }, timeout);

  // Hubungkan sinyal eksternal jika ada (misal pembatalan manual oleh pengguna)
  if (externalSignal) {
    if (externalSignal.aborted) {
      clearTimeout(timeoutId);
      controller.abort();
    } else {
      externalSignal.addEventListener("abort", () => {
        clearTimeout(timeoutId);
        controller.abort();
      });
    }
  }

  let response;
  try {
    response = await fetch(url, {
      ...customOptions,
      headers: reqHeaders,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);

    // Jangan modifikasi AbortError yang dipicu oleh pembatalan eksplisit
    if (err.name === "AbortError") {
      throw err;
    }

    // Tangani timeout
    if (err.name === "TimeoutError") {
      const timeoutErr = new Error("Permintaan ke server melebihi batas waktu tunggu (timeout).");
      timeoutErr.name = "TimeoutError";
      throw timeoutErr;
    }

    // Tangani server offline, koneksi ditolak, atau TypeError: Failed to fetch
    if (err instanceof TypeError || (err.message && err.message.toLowerCase().includes("fetch"))) {
      const connErr = new Error("Koneksi ke server gagal. Periksa koneksi atau pastikan server backend berjalan.");
      connErr.status = 0;
      connErr.originalError = err;
      throw connErr;
    }

    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

  // Tangani respons jika HTTP status tidak OK (4xx, 5xx)
  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch {
      // Respons bukan JSON (mis. pesan error HTML bawaan web server)
    }

    // Parsing format pesan error FastAPI ({ detail: ... } atau { message: ... })
    let errorMessage = "";
    if (errorData?.detail) {
      if (typeof errorData.detail === "string") {
        errorMessage = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
        // Format validasi Pydantic / FastAPI
        errorMessage = errorData.detail.map((d) => d.msg || JSON.stringify(d)).join(", ");
      } else if (typeof errorData.detail === "object") {
        errorMessage = JSON.stringify(errorData.detail);
      }
    } else if (errorData?.message) {
      errorMessage = errorData.message;
    } else {
      errorMessage = response.statusText || `Permintaan gagal dengan status ${response.status}`;
    }

    // Trigger auto-logout jika status 401 Unauthorized (token kedaluwarsa / tidak valid)
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      }
    }

    const httpError = new Error(errorMessage);
    httpError.status = response.status;
    httpError.detail = errorData?.detail;
    httpError.data = errorData;
    throw httpError;
  }

  // Respons 204 No Content
  if (response.status === 204) {
    return null;
  }

  // Parsing JSON jika tipe konten adalah application/json
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }

  return await response.text();
}
