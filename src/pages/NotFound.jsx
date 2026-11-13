import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-[#05060f] text-slate-100 bg-security-grid">
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full glass-surface rounded-3xl p-8 sm:p-12 text-center border border-white/10 shadow-[0_0_50px_rgba(236,72,153,0.12)]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-400/30 text-red-300 text-xs font-mono uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            <span>SIGNAL LOST • ERROR 404</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-3">
            404 — Sinyal Terputus
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto mb-8 leading-relaxed">
            Frekuensi halaman yang Anda tuju tidak ditemukan atau telah dipindahkan dari radar sistem SAVESPEECH.
          </p>

          {/* Visualisasi Waveform "Flatline" (Garis Lurus dengan denyut kecil) */}
          <div
            aria-hidden="true"
            className="relative rounded-2xl bg-[#05060f]/90 border border-white/10 p-6 mb-8 overflow-hidden"
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-3">
              <span>CHANNEL: UNKNOWN</span>
              <span className="text-red-400">AMPLITUDE: 0.00 dB (FLATLINE)</span>
            </div>

            <svg
              viewBox="0 0 600 80"
              className="w-full h-16 overflow-visible"
              fill="none"
            >
              <defs>
                <linearGradient id="flatlineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              {/* Garis lurus flatline dengan satu blip lemah */}
              <path
                d="M 0 40 L 230 40 L 245 40 L 255 18 L 268 62 L 278 34 L 286 40 L 600 40"
                stroke="url(#flatlineGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="594" cy="40" r="4" fill="#ec4899" />
            </svg>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-95 transition-all shadow-[0_0_25px_rgba(139,92,246,0.4)]"
          >
            <i className="ri-arrow-left-line text-lg" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}