import React, { useEffect, useState, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// Pemetaan warna dan label berdasarkan tingkat risiko
const RISK_LEVEL_CONFIG = {
  Low: {
    color: "#22c55e",
    bgBadge: "bg-emerald-500/15 text-emerald-400 border-emerald-400/30",
    labelId: "Rendah",
    desc: "Aktivitas percakapan terindikasi wajar dan aman.",
  },
  Medium: {
    color: "#eab308",
    bgBadge: "bg-yellow-500/15 text-yellow-400 border-yellow-400/30",
    labelId: "Sedang",
    desc: "Ditemukan beberapa pola yang perlu diwaspadai.",
  },
  High: {
    color: "#f97316",
    bgBadge: "bg-orange-500/15 text-orange-400 border-orange-400/30",
    labelId: "Tinggi",
    desc: "Terindikasi kuat upaya manipulasi psikologis / penipuan.",
  },
  Critical: {
    color: "#ef4444",
    bgBadge: "bg-red-500/15 text-red-400 border-red-400/30",
    labelId: "Kritis",
    desc: "Terindikasi sangat berbahaya dengan ancaman kehilangan akses/dana.",
  },
};

/**
 * Komponen gauge setengah lingkaran (SVG arc) untuk visualisasi skor risiko 0–100.
 * Skor beranimasi dari 0 ke nilai akhir saat dimuat.
 */
export default function RiskMeter({ score = 0, level = "Low" }) {
  const shouldReduceMotion = useReducedMotion();
  const [animatedScore, setAnimatedScore] = useState(0);
  const animFrameRef = useRef(null);

  const config = RISK_LEVEL_CONFIG[level] || RISK_LEVEL_CONFIG.Low;

  // Konfigurasi Geometri SVG Arc (Setengah Lingkaran)
  const radius = 90;
  const strokeWidth = 14;
  const arcLength = Math.PI * radius; // ~282.74

  // Animasi hitung angka dari 0 ke score
  useEffect(() => {
    if (shouldReduceMotion) return;

    const duration = 1200; // ms
    const startTime = performance.now();
    const startVal = 0;
    const targetVal = Math.min(100, Math.max(0, score));

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(startVal + (targetVal - startVal) * easeProgress);

      setAnimatedScore(currentVal);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [score, shouldReduceMotion]);

  // Jika prefers-reduced-motion aktif, langsung gunakan skor asli tanpa animasi
  const displayScore = shouldReduceMotion ? score : animatedScore;
  const strokeDashoffset = arcLength * (1 - displayScore / 100);

  return (
    <div
      role="meter"
      aria-label="Skor Risiko Penipuan"
      aria-valuenow={displayScore}
      aria-valuemin={0}
      aria-valuemax={100}
      className="glass-surface rounded-3xl p-6 border border-white/10 flex flex-col items-center justify-between text-center relative overflow-hidden"
    >
      {/* Background glow sesuai warna risiko */}
      <div
        className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-700"
        style={{ backgroundColor: config.color }}
        aria-hidden="true"
      />

      {/* Header Kecil */}
      <div className="w-full flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
          <i className="ri-dashboard-2-line text-cyan-400" aria-hidden="true" />
          Tingkat Risiko
        </span>
        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${config.bgBadge}`}>
          {level.toUpperCase()}
        </span>
      </div>

      {/* SVG Arc Gauge */}
      <div className="relative w-[240px] h-[130px] my-2 select-none">
        <svg
          viewBox="0 0 240 140"
          className="w-full h-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <filter id={`glow-${level}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={config.color} floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Jalur Track Belakang (Abu-abu transparan) */}
          <path
            d="M 30 125 A 90 90 0 0 1 210 125"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Jalur Progres Warna Risiko */}
          <path
            d="M 30 125 A 90 90 0 0 1 210 125"
            fill="none"
            stroke={config.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            filter={`url(#glow-${level})`}
            style={{
              transition: shouldReduceMotion ? "none" : "stroke-dashoffset 0.1s linear",
            }}
          />
        </svg>

        {/* Nilai Skor di Tengah Busur */}
        <div className="absolute inset-0 top-10 flex flex-col items-center justify-center">
          <div className="flex items-baseline gap-1">
            <span
              className="font-heading text-5xl font-extrabold tracking-tight tabular-nums"
              style={{ color: config.color }}
            >
              {displayScore}
            </span>
            <span className="text-xs font-semibold text-slate-400">/100</span>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 mt-1">
            Terindikasi {config.labelId}
          </span>
        </div>

        {/* Label Skala Bawah */}
        <div className="absolute bottom-0 inset-x-2 flex justify-between text-[10px] text-slate-500 font-mono">
          <span>0 (Aman)</span>
          <span>100 (Kritis)</span>
        </div>
      </div>

      {/* Deskripsi Singkat Risiko */}
      <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-xs">
        {config.desc}
      </p>
    </div>
  );
}
