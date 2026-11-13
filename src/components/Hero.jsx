import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import WaveformCanvas from "./WaveformCanvas";

const BADGES = [
  { icon: "ri-mic-2-ai-line", text: "Whisper Speech-to-Text" },
  { icon: "ri-brain-line", text: "Machine Learning" },
  { icon: "ri-lock-password-line", text: "Privasi Terjaga" },
];

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const [barMode, setBarMode] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: "easeOut" },
    },
  };

  const scrollToHowItWorks = (e) => {
    e.preventDefault();
    const el = document.getElementById("cara-kerja");
    if (el) {
      el.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
    }
  };

  return (
    <section
      id="beranda"
      className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-security-grid"
    >
      {/* Cahaya latar (ambient glow blobs) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[340px] sm:w-[620px] h-[320px] bg-gradient-to-tr from-cyan-500/20 via-violet-500/20 to-pink-500/15 blur-[110px] rounded-full animate-blob-slow"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          {/* Tiga Badge Fitur Inti */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-7"
          >
            {BADGES.map((badge) => (
              <span
                key={badge.text}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-cyan-200 glass-surface border-cyan-400/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
              >
                <i className={`${badge.icon} text-cyan-400 text-sm`} />
                {badge.text}
              </span>
            ))}
          </motion.div>

          {/* Headline Utama */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] mb-6"
          >
            Deteksi Panggilan Penipuan{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-500 bg-clip-text text-transparent">
              Impersonasi Finansial
            </span>{" "}
            Berbasis AI
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-9"
          >
            Lindungi diri dari manipulasi psikologis penipu yang mengaku sebagai petugas bank atau e-wallet. Unggah rekaman percakapan untuk mendeteksi sinyal rekayasa sosial, permintaan OTP/PIN, serta tingkat risiko secara transparan.
          </motion.p>

          {/* Dua Tombol Aksi */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-12"
          >
            <Link
              to="/analisis"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-95 transition-all shadow-[0_0_30px_rgba(139,92,246,0.45)] hover:shadow-[0_0_40px_rgba(34,211,238,0.65)]"
            >
              <i className="ri-waveform-line text-lg" />
              <span>Analisis Percakapan</span>
            </Link>
            <a
              href="#cara-kerja"
              onClick={scrollToHowItWorks}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-slate-200 glass-surface hover:bg-white/10 hover:text-white transition-all"
            >
              <i className="ri-play-circle-line text-lg text-cyan-400" />
              <span>Pelajari Cara Kerja</span>
            </a>
          </motion.div>

          {/* Panel Visualisasi Waveform AI */}
          <motion.div
            variants={itemVariants}
            className="relative rounded-2xl glass-surface p-4 sm:p-6 border border-white/10 shadow-[0_0_50px_rgba(34,211,238,0.12)]"
          >
            {/* Header bar di dalam kartu waveform */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-2 border-b border-white/10 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-mono uppercase tracking-wider text-slate-300">
                  AI Audio Signal Inspector — Siaga
                </span>
              </div>
              <button
                type="button"
                onClick={() => setBarMode((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors cursor-pointer"
                title="Ganti mode visualisasi gelombang"
              >
                <i className={barMode ? "ri-Sliders-line" : "ri-equalizer-line"} />
                <span>{barMode ? "Mode Sinus" : "Mode Equalizer"}</span>
              </button>
            </div>

            <WaveformCanvas amplitude={0.55} speed={1} height={220} barMode={barMode} />

            {/* Keterangan indikator level risiko di bagian bawah kanvas */}
            <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <i className="ri-shield-check-line text-cyan-400" />
                Pipeline: Audio → Whisper STT → TF-IDF + ML → Risk Engine
              </span>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#22c55e]" /> Low
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#eab308]" /> Medium
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#f97316]" /> High
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#ef4444]" /> Critical
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}