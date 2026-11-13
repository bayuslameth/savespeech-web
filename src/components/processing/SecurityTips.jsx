import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const TIPS = [
  "Bank resmi tidak pernah meminta OTP lewat telepon.",
  "Jangan instal aplikasi atas arahan penelepon yang tidak dikenal.",
  "Tekanan waktu adalah taktik umum penipu — tetap tenang.",
  "Verifikasi lewat nomor resmi di kartu atau aplikasi bank Anda.",
  "Penipu sering berpura-pura menjadi petugas bank, polisi, atau instansi resmi.",
  "Jangan transfer uang ke 'rekening aman' atas permintaan telepon.",
];

/**
 * Kartu glass yang menampilkan tips keamanan berganti tiap 6 detik.
 * Menghormati prefers-reduced-motion: tanpa transisi, ganti langsung.
 */
export default function SecurityTips() {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % TIPS.length);
    }, 6000);

    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="rounded-2xl bg-white/[0.04] border border-cyan-400/15 p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center shrink-0">
          <i className="ri-shield-keyhole-line text-sm text-cyan-400" aria-hidden="true" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
          Tips Keamanan
        </p>
      </div>

      {/* Area tips berubah */}
      <div className="relative min-h-[52px] flex items-center">
        {shouldReduceMotion ? (
          <p className="text-sm text-slate-300 leading-relaxed" aria-live="polite" aria-atomic="true">
            <i className="ri-information-line text-cyan-400 mr-1.5" aria-hidden="true" />
            {TIPS[index]}
          </p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="text-sm text-slate-300 leading-relaxed"
              aria-live="polite"
              aria-atomic="true"
            >
              <i className="ri-information-line text-cyan-400 mr-1.5" aria-hidden="true" />
              {TIPS[index]}
            </motion.p>
          </AnimatePresence>
        )}
      </div>

      {/* Indikator titik */}
      <div className="flex items-center gap-1.5 mt-3" aria-hidden="true">
        {TIPS.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i === index
                ? "w-4 h-1.5 bg-cyan-400"
                : "w-1.5 h-1.5 bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
