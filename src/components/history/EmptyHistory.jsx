import React from "react";
import { Link } from "react-router-dom";

/**
 * Tampilan status kosong (empty state) jika pengguna belum memiliki riwayat analisis
 * atau seluruh data riwayat telah dihapus.
 */
export default function EmptyHistory() {
  return (
    <div className="glass-surface rounded-3xl p-8 sm:p-12 border border-white/10 text-center max-w-lg mx-auto my-6 space-y-5">
      {/* Ikon Besar Redup */}
      <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-slate-500">
        <i className="ri-history-line text-3xl" aria-hidden="true" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-bold text-white">Belum Ada Riwayat Analisis</h3>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
          Setiap hasil analisis baru yang Anda jalankan akan dicatat di sini. Sesuai prinsip{" "}
          <strong className="text-slate-300">Data Minimization (PRD SEC-05)</strong>, rekaman suara percakapan{" "}
          <span className="text-cyan-400">tidak pernah disimpan</span> di server.
        </p>
      </div>

      {/* Tombol Aksi Mulai Analisis */}
      <div className="pt-2">
        <Link
          to="/analisis"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-95 shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <i className="ri-shield-flash-line text-base" aria-hidden="true" />
          <span>Mulai Analisis Baru</span>
        </Link>
      </div>
    </div>
  );
}
