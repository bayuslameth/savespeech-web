import React from "react";
import { Link } from "react-router-dom";
import WaveformCanvas from "../components/WaveformCanvas";

const HIGHLIGHTS = [
  {
    icon: "ri-radar-line",
    title: "Deteksi Pola Rekayasa Sosial",
    desc: "Mengidentifikasi klaim petugas bank/e-wallet palsu, intimidasi blokir akun, dan paksaan transfer.",
  },
  {
    icon: "ri-shield-keyhole-line",
    title: "Jaring Pengaman Kredensial",
    desc: "Aturan prioritas tinggi (override) ketika terdeteksi permintaan kode OTP, PIN, atau password.",
  },
  {
    icon: "ri-delete-bin-shield-line",
    title: "Privasi & Penghapusan Otomatis",
    desc: "Pemrosesan transkripsi Whisper lokal; rekaman suara langsung dihapus setelah analisis selesai.",
  },
];

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-stretch bg-[#05060f] bg-security-grid overflow-hidden">
      {/* Waveform redup sebagai latar belakang khusus tampilan Mobile */}
      <div
        aria-hidden="true"
        className="lg:hidden pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-20"
      >
        <WaveformCanvas amplitude={0.25} speed={0.6} height={240} />
      </div>

      {/* Cahaya latar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/15 blur-[120px] rounded-full"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 bg-violet-500/15 blur-[120px] rounded-full"
      />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
        {/* Panel Kiri: Identitas Visual & Waveform (Desktop) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-between pr-6">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 mb-6 group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/20 via-violet-500/20 to-pink-500/20 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <i className="ri-pulse-line text-xl text-cyan-400" />
              </div>
              <div>
                <span className="font-heading font-bold text-xl tracking-wider bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent block">
                  SAVESPEECH
                </span>
                <span className="text-[10px] uppercase tracking-widest text-cyan-400/80 block -mt-1">
                  Defensive AI Security
                </span>
              </div>
            </Link>

            <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-3">
              Sistem Pendukung Keputusan Deteksi{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-500 bg-clip-text text-transparent">
                Scam Impersonasi
              </span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-6 max-w-xl">
              Analisis rekaman percakapan telepon secara objektif untuk mengenali indikasi manipulasi psikologis sebelum Anda mengambil keputusan finansial.
            </p>

            {/* Visualisasi Waveform Amplitudo Rendah */}
            <div className="rounded-2xl glass-surface p-4 border border-white/10 mb-7 shadow-[0_0_35px_rgba(34,211,238,0.08)]">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  GUARDIAN SIGNAL MONITOR
                </span>
                <span>16kHz MONO • ID-STT</span>
              </div>
              <WaveformCanvas amplitude={0.28} speed={0.75} height={150} />
            </div>

            {/* 3 Poin Keunggulan */}
            <div className="space-y-3.5">
              {HIGHLIGHTS.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.03] border border-white/10"
                >
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-400/25 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <i className={`${item.icon} text-lg`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel Kanan: Kartu Form Glassmorphism */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="glass-surface rounded-3xl p-6 sm:p-8 md:p-9 border border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.16)]">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>
              {subtitle && (
                <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}