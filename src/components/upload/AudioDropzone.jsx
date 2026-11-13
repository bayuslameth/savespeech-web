import React, { useRef, useCallback, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import WaveformCanvas from "../WaveformCanvas";

/**
 * Komponen zona drag-and-drop untuk memilih file audio.
 * Mendukung klik, drag-over, dan keyboard (Enter / Space).
 */
export default function AudioDropzone({
  onFileSelected,
  dragState = "idle", // "idle" | "dragover" | "error"
  disabled = false,
}) {
  const inputRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Buka dialog file saat klik atau Enter/Space ditekan
  const openPicker = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openPicker();
      }
    },
    [openPicker]
  );

  const handleFileChange = useCallback(
    (e) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      onFileSelected(files[0]);
      // Reset input agar file yang sama bisa dipilih ulang
      e.target.value = "";
    },
    [onFileSelected]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      const files = e.dataTransfer.files;
      if (!files || files.length === 0) return;
      // Hanya ambil satu file; beri tahu pengguna bila lebih dari satu
      onFileSelected(files[0], files.length > 1);
    },
    [disabled, onFileSelected]
  );

  // Hentikan event bubble drag untuk menghindari konflik browser
  useEffect(() => {
    const prevent = (e) => e.preventDefault();
    document.addEventListener("dragover", prevent);
    document.addEventListener("drop", prevent);
    return () => {
      document.removeEventListener("dragover", prevent);
      document.removeEventListener("drop", prevent);
    };
  }, []);

  // Kelas border berdasarkan dragState
  const borderClass =
    dragState === "dragover"
      ? "border-cyan-400/80 shadow-[0_0_28px_rgba(34,211,238,0.3)]"
      : dragState === "error"
      ? "border-red-400/60 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
      : "border-white/15 hover:border-cyan-400/40";

  // Amplitudo waveform latar berubah saat dragover
  const waveAmp = dragState === "dragover" ? 0.65 : 0.22;

  return (
    <motion.div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Seret file audio ke sini atau klik untuk memilih file"
      aria-disabled={disabled}
      onClick={openPicker}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      animate={
        dragState === "error" && !shouldReduceMotion
          ? { x: [0, -6, 6, -4, 4, 0] }
          : { x: 0 }
      }
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`relative w-full rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden
        ${borderClass}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05060f]
      `}
    >
      {/* Waveform dekoratif di latar */}
      <div className="absolute inset-0 opacity-40 pointer-events-none" aria-hidden="true">
        <WaveformCanvas amplitude={waveAmp} speed={0.5} height={160} />
      </div>

      {/* Overlay gradien agar teks tetap terbaca */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,6,15,0.55) 0%, rgba(5,6,15,0.35) 50%, rgba(5,6,15,0.65) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Konten tengah */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-3 py-12 px-6 text-center min-h-[160px]">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            dragState === "dragover"
              ? "bg-cyan-500/25 border border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
              : "bg-white/[0.06] border border-white/15"
          }`}
        >
          <i
            className={`text-2xl transition-colors ${
              dragState === "dragover"
                ? "ri-upload-cloud-2-line text-cyan-400"
                : "ri-file-music-line text-slate-400"
            }`}
            aria-hidden="true"
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-white">
            {dragState === "dragover"
              ? "Lepaskan untuk mengunggah"
              : "Seret file audio ke sini atau klik untuk memilih"}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            WAV, MP3, M4A &bull; maks {25} MB &bull; maks 10 menit
          </p>
        </div>
      </div>

      {/* Input file tersembunyi */}
      <input
        ref={inputRef}
        type="file"
        accept=".wav,.mp3,.m4a,audio/*"
        className="sr-only"
        onChange={handleFileChange}
        tabIndex={-1}
        aria-hidden="true"
      />
    </motion.div>
  );
}
