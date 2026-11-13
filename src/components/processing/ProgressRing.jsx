import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// Label per status
const STATUS_LABEL = {
  uploading: "Mengunggah Audio",
  transcribing: "Speech-to-Text",
  analyzing: "AI Analysis",
  done: "Selesai",
  failed: "Gagal",
};

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Ring progres SVG bergradien dengan angka persentase beranimasi di tengah
 * dan label status + waktu berjalan di luar ring.
 */
export default function ProgressRing({ progress = 0, status = "uploading", elapsedSec = 0 }) {
  const shouldReduceMotion = useReducedMotion();
  const displayRef = useRef(null);
  const animRef = useRef(null);
  const currentRef = useRef(progress);

  const size = 160;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Animasi angka counter dengan requestAnimationFrame agar mulus
  useEffect(() => {
    if (shouldReduceMotion) {
      currentRef.current = progress;
      if (displayRef.current) displayRef.current.textContent = `${Math.round(progress)}%`;
      return;
    }

    const target = Math.round(progress);
    const start = currentRef.current;
    const startTime = performance.now();
    const duration = 500;

    if (animRef.current) cancelAnimationFrame(animRef.current);

    const step = (now) => {
      const elapsed = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3); // ease-out cubic
      const value = Math.round(start + (target - start) * eased);
      currentRef.current = value;
      if (displayRef.current) displayRef.current.textContent = `${value}%`;
      if (elapsed < 1) animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [progress, shouldReduceMotion]);

  // Hitung stroke offset dari progress
  const offset = circumference - (progress / 100) * circumference;

  const isFailed = status === "failed";
  const isDone = status === "done";

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Ring SVG */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          aria-hidden="true"
        >
          {/* Definisi gradien */}
          <defs>
            <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="ring-failed" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="ring-done" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>

          {/* Track (latar) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
          />

          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={
              isFailed
                ? "url(#ring-failed)"
                : isDone
                ? "url(#ring-done)"
                : "url(#ring-grad)"
            }
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={shouldReduceMotion ? offset : offset}
            style={{
              transition: shouldReduceMotion
                ? "none"
                : "stroke-dashoffset 0.5s cubic-bezier(0.4,0,0.2,1)",
              filter: isFailed
                ? "drop-shadow(0 0 6px rgba(239,68,68,0.6))"
                : isDone
                ? "drop-shadow(0 0 8px rgba(52,211,153,0.5))"
                : "drop-shadow(0 0 8px rgba(139,92,246,0.6))",
            }}
          />
        </svg>

        {/* Teks di tengah ring */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isFailed ? (
            <i className="ri-close-circle-line text-3xl text-red-400" aria-hidden="true" />
          ) : isDone ? (
            <i className="ri-shield-check-line text-3xl text-emerald-400" aria-hidden="true" />
          ) : (
            <span
              ref={displayRef}
              className="text-2xl font-bold text-white tabular-nums"
              aria-live="polite"
              aria-label={`Progress ${Math.round(progress)} persen`}
            >
              {Math.round(progress)}%
            </span>
          )}
        </div>
      </div>

      {/* Label status */}
      <div className="text-center">
        <p
          className={`text-sm font-semibold transition-colors duration-300 ${
            isFailed ? "text-red-400" : isDone ? "text-emerald-400" : "text-white"
          }`}
          aria-live="polite"
        >
          {STATUS_LABEL[status] || status}
        </p>
        <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
          Waktu: {formatTime(elapsedSec)}
        </p>
      </div>
    </div>
  );
}
