import React, { Component } from "react";

/**
 * ErrorBoundary - Menangkap error fatal pada pohon komponen antarmuka React (NFR-03).
 * Mencegah White Screen of Death (layar putih kosong) dengan menampilkan UI fallback
 * yang informatif tanpa membocorkan stack trace teknis ke pengguna akhir.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // Mengubah state saat terjadi error render agar UI fallback ditampilkan
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // Mencatat rincian error ke konsol pengembang (tidak bocor ke UI pengguna)
  componentDidCatch(error, errorInfo) {
    console.error("SAVESPEECH ErrorBoundary mendeteksi error fatal:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen bg-[#05060f] text-slate-100 flex items-center justify-center p-4 bg-security-grid selection:bg-red-500/30"
        >
          <div className="w-full max-w-md glass-surface rounded-3xl p-8 border border-red-500/30 shadow-[0_20px_60px_rgba(239,68,68,0.2)] text-center relative overflow-hidden animate-fade-in">
            {/* Dekorasi Cahaya Latar */}
            <div
              className="absolute -top-20 -left-20 w-44 h-44 bg-red-500/15 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-20 -right-20 w-44 h-44 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            {/* Ikon Peringatan Sistem */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-400/40 flex items-center justify-center mx-auto mb-5 shadow-[0_0_24px_rgba(239,68,68,0.3)]">
              <i className="ri-shield-cross-line text-3xl text-red-400" aria-hidden="true" />
            </div>

            {/* Judul & Pesan Ramah Pengguna */}
            <h1 className="text-xl font-heading font-bold text-white mb-2">
              Terjadi Kesalahan Fatal pada Antarmuka
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Sistem mendeteksi kendala tak terduga saat memuat tampilan. Demi keamanan sesi dan kestabilan aplikasi, silakan muat ulang halaman.
            </p>

            {/* Tombol Aksi */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 transition-all shadow-[0_0_20px_rgba(239,68,68,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 cursor-pointer"
              >
                <i className="ri-refresh-line text-base" aria-hidden="true" />
                <span>Muat Ulang Aplikasi</span>
              </button>

              <button
                type="button"
                onClick={this.handleHome}
                className="px-4 py-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white glass-surface border border-white/10 hover:border-white/20 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
              >
                Beranda
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
