import React, { useEffect, useRef, useState, useCallback } from "react";
import { formatBytes, formatDuration } from "../../utils/audioValidation";
import WaveformBars from "./WaveformBars";

/**
 * Kartu pratinjau file audio yang sudah dipilih.
 * Object URL dibuat saat komponen mount dan di-revoke saat unmount / file berganti.
 */
export default function FileSummary({
  file,
  meta,       // { name, size, duration }
  peaks,      // number[] | null
  isValid,
  errorMsg,
  onReplace,
  onRemove,
}) {
  const audioRef = useRef(null);
  const objectUrlRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(meta?.duration || 0);

  // Buat object URL baru setiap kali file berubah; revoke yang lama
  useEffect(() => {
    if (!file) return;

    // Revoke URL sebelumnya jika ada
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;

    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.load();
      setPlaying(false);
      setCurrentTime(0);
    }

    return () => {
      // Bersihkan object URL saat komponen unmount atau file diganti
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [file]);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleEnded = useCallback(() => {
    setPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) audioRef.current.currentTime = 0;
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => setPlaying(false));
      setPlaying(true);
    }
  }, [playing]);

  // Progress 0–1 untuk WaveformBars
  const playProgress =
    audioDuration > 0 ? currentTime / audioDuration : 0;

  const totalDisplay = formatDuration(meta?.duration ?? audioDuration);
  const currentDisplay = formatDuration(currentTime);

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden
        ${isValid
          ? "border-cyan-400/25 bg-white/[0.04]"
          : "border-red-400/30 bg-red-500/[0.04]"
        }`}
    >
      {/* Header kartu: ikon + info */}
      <div className="flex items-start gap-3 p-4 pb-0">
        <div
          className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
            isValid
              ? "bg-cyan-500/15 border border-cyan-400/30"
              : "bg-red-500/15 border border-red-400/30"
          }`}
        >
          <i
            className={`text-xl ${
              isValid ? "ri-file-music-line text-cyan-400" : "ri-error-warning-line text-red-400"
            }`}
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p
            className="text-sm font-semibold text-white truncate"
            title={meta?.name ?? file?.name}
          >
            {meta?.name ?? file?.name}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-400">
              {formatBytes(meta?.size ?? file?.size ?? 0)}
            </span>
            {(meta?.duration ?? audioDuration) > 0 && (
              <>
                <span className="text-slate-600 text-xs">•</span>
                <span className="text-xs text-slate-400">
                  {totalDisplay}
                </span>
              </>
            )}
            {/* Badge status */}
            <span
              aria-live="polite"
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold
                ${isValid
                  ? "bg-green-500/15 text-green-400 border border-green-400/30"
                  : "bg-red-500/15 text-red-400 border border-red-400/30"
                }`}
            >
              <i
                className={isValid ? "ri-checkbox-circle-line" : "ri-close-circle-line"}
                aria-hidden="true"
              />
              {isValid ? "Valid" : "Tidak Valid"}
            </span>
          </div>
        </div>

        {/* Tombol Ganti & Hapus */}
        <div className="shrink-0 flex items-center gap-1.5 ml-1">
          <button
            type="button"
            onClick={onReplace}
            aria-label="Ganti file"
            className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <i className="ri-refresh-line text-base" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Hapus file"
            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <i className="ri-delete-bin-line text-base" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Pesan error */}
      {!isValid && errorMsg && (
        <div
          role="alert"
          className="mx-4 mt-3 flex items-start gap-2 text-xs text-red-400 bg-red-500/10 border border-red-400/20 rounded-xl px-3 py-2.5"
        >
          <i className="ri-error-warning-line text-sm shrink-0 mt-0.5" aria-hidden="true" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Waveform pratinjau */}
      <div className="px-4 pt-4">
        <div className="rounded-xl bg-black/30 border border-white/[0.07] p-3 overflow-hidden">
          <WaveformBars peaks={peaks} height={70} playProgress={playProgress} />
        </div>
      </div>

      {/* Pemutar audio */}
      {isValid && (
        <div className="flex items-center gap-3 px-4 pb-4 pt-3">
          {/* Tombol Play / Pause */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Jeda audio" : "Putar audio"}
            className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white shadow-[0_0_16px_rgba(139,92,246,0.4)] hover:shadow-[0_0_22px_rgba(34,211,238,0.5)] transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <i
              className={`text-sm ${playing ? "ri-pause-fill" : "ri-play-fill"}`}
              aria-hidden="true"
            />
          </button>

          {/* Waktu berjalan */}
          <span className="text-xs font-mono text-slate-400 w-10 text-center shrink-0">
            {currentDisplay}
          </span>

          {/* Progress bar */}
          <div className="flex-1 relative">
            <input
              type="range"
              min={0}
              max={audioDuration || 1}
              step={0.1}
              value={currentTime}
              aria-label="Posisi putar audio"
              onChange={(e) => {
                const t = parseFloat(e.target.value);
                setCurrentTime(t);
                if (audioRef.current) audioRef.current.currentTime = t;
              }}
              className="w-full h-1.5 appearance-none bg-white/10 rounded-full cursor-pointer accent-cyan-400"
              style={{
                background: `linear-gradient(to right, #22d3ee ${playProgress * 100}%, rgba(255,255,255,0.1) ${playProgress * 100}%)`,
              }}
            />
          </div>

          {/* Durasi total */}
          <span className="text-xs font-mono text-slate-400 w-10 text-center shrink-0">
            {totalDisplay}
          </span>
        </div>
      )}

      {/* Elemen audio tersembunyi */}
      <audio
        ref={audioRef}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
        className="sr-only"
        aria-hidden="true"
      />
    </div>
  );
}
