import React, { useState } from "react";
import { formatDuration } from "../../utils/audioValidation";

/**
 * Menampilkan transkrip percakapan berstempel waktu.
 * Kalimat yang bernilai flagged: true disorot dengan warna dan border tegas.
 */
export default function TranscriptView({ transcript = [] }) {
  const [onlyFlagged, setOnlyFlagged] = useState(false);

  if (!transcript || transcript.length === 0) {
    return (
      <div className="glass-surface rounded-3xl p-8 border border-white/10 text-center">
        <i className="ri-file-text-line text-3xl text-slate-500 mb-2 block" aria-hidden="true" />
        <p className="text-sm font-semibold text-white">Transkrip Tidak Tersedia</p>
        <p className="text-xs text-slate-400 mt-1">
          Tidak ada data teks percakapan yang dihasilkan pada sesi analisis ini.
        </p>
      </div>
    );
  }

  const flaggedCount = transcript.filter((t) => t.flagged).length;
  const filteredTranscript = onlyFlagged
    ? transcript.filter((t) => t.flagged)
    : transcript;

  return (
    <div className="glass-surface rounded-3xl p-6 border border-white/10 space-y-5">
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <i className="ri-mic-ai-line text-cyan-400" aria-hidden="true" />
            Transkrip Percakapan Lengkap
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Total {transcript.length} segmen •{" "}
            <span className="text-red-400 font-semibold">{flaggedCount} kalimat berpotensi bahaya</span>
          </p>
        </div>

        {/* Tombol Filter Hanya Kalimat Berisiko */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOnlyFlagged(false)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              !onlyFlagged
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30"
                : "bg-white/[0.04] text-slate-400 hover:text-white border border-white/10"
            }`}
          >
            Semua ({transcript.length})
          </button>
          <button
            type="button"
            onClick={() => setOnlyFlagged(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              onlyFlagged
                ? "bg-red-500/20 text-red-300 border border-red-400/40"
                : "bg-white/[0.04] text-slate-400 hover:text-red-300 border border-white/10"
            }`}
          >
            <i className="ri-flag-fill text-xs text-red-400" aria-hidden="true" />
            Hanya Berbahaya ({flaggedCount})
          </button>
        </div>
      </div>

      {/* Daftar Percakapan Vertikal */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
        {filteredTranscript.map((segment, index) => {
          const timeStart = formatDuration(segment.start || 0);
          const timeEnd = formatDuration(segment.end || 0);

          return (
            <div
              key={index}
              className={`rounded-2xl p-4 transition-all duration-200 ${
                segment.flagged
                  ? "bg-red-500/[0.08] border-l-4 border-red-500 border-r border-t border-b border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.06)]"
                  : "bg-white/[0.02] border-l-2 border-white/15 border-r border-t border-b border-white/[0.05]"
              }`}
            >
              {/* Baris Meta Segmen: Stempel Waktu & Status Flag */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-mono text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                  <i className="ri-time-line text-slate-500" aria-hidden="true" />
                  [{timeStart} - {timeEnd}]
                </span>

                {segment.flagged ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-400/30">
                    <i className="ri-alarm-warning-fill text-xs" aria-hidden="true" />
                    Pola Berbahaya
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                    Normal
                  </span>
                )}
              </div>

              {/* Teks Dialog */}
              <p
                className={`text-sm leading-relaxed ${
                  segment.flagged ? "text-white font-medium" : "text-slate-300"
                }`}
              >
                {segment.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
