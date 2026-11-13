import React from "react";
import { Link } from "react-router-dom";
import WaveformCanvas from "../components/WaveformCanvas";
import Footer from "../components/Footer";

export default function Analyze() {
  return (
    <div className="min-h-screen flex flex-col bg-[#05060f] text-slate-100 bg-security-grid">
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full glass-surface rounded-3xl p-8 sm:p-10 text-center border border-white/10 shadow-[0_0_40px_rgba(139,92,246,0.15)]">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-400/30 flex items-center justify-center mx-auto mb-5 text-cyan-400">
            <i className="ri-sound-module-line text-3xl" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/15 text-violet-300 border border-violet-400/30 mb-3">
            Phase 2 Deliverable
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Halaman Analisis — segera hadir
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
            Modul unggah rekaman percakapan (.wav, .mp3, .m4a), validasi keamanan berkas, serta tampilan skor risiko dan transkrip sedang disiapkan untuk tahap pengembangan berikutnya.
          </p>

          <div className="rounded-xl bg-[#05060f]/70 border border-white/10 p-3 mb-7">
            <WaveformCanvas amplitude={0.35} speed={0.8} height={110} />
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-95 transition-all"
          >
            <i className="ri-arrow-left-line" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}