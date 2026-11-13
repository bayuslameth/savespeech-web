import React from "react";
import Button from "../ui/Button";

/**
 * Panel error yang tampil saat status "failed".
 * role="alert" agar screen reader membacanya segera.
 */
export default function ErrorPanel({ message, onRetry, onBack }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-2xl border border-red-400/30 bg-red-500/[0.06] p-6 text-center"
    >
      {/* Ikon */}
      <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-400/30 flex items-center justify-center mx-auto mb-4">
        <i className="ri-error-warning-line text-3xl text-red-400" aria-hidden="true" />
      </div>

      <h2 className="text-base font-bold text-red-300 mb-2">Proses Gagal</h2>

      <p className="text-sm text-slate-300 leading-relaxed mb-5">
        {message || "Terjadi kesalahan saat memproses audio. Silakan coba lagi."}
      </p>

      {/* Tombol aksi */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          onClick={onRetry}
          aria-label="Coba analisis ulang"
        >
          <i className="ri-refresh-line" aria-hidden="true" />
          <span>Coba Lagi</span>
        </Button>
        <Button
          variant="ghost"
          onClick={onBack}
          aria-label="Kembali ke halaman unggah"
        >
          <i className="ri-arrow-left-line" aria-hidden="true" />
          <span>Kembali ke Unggah</span>
        </Button>
      </div>
    </div>
  );
}
