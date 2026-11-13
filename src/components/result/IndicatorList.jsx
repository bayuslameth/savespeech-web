import React from "react";

/**
 * Merender daftar indikator manipulasi / rekayasa sosial yang terdeteksi
 * beserta persentase bobot dan kutipan langsung percakapan yang memicu indikator tersebut.
 */
export default function IndicatorList({ indicators = [] }) {
  if (!indicators || indicators.length === 0) {
    return (
      <div className="glass-surface rounded-3xl p-6 border border-white/10 text-center">
        <i className="ri-shield-check-line text-3xl text-emerald-400 mb-2 block" aria-hidden="true" />
        <p className="text-sm font-semibold text-white">Tidak Ada Indikator Berbahaya</p>
        <p className="text-xs text-slate-400 mt-1">Percakapan tidak menunjukkan pola penipuan yang mencurigakan.</p>
      </div>
    );
  }

  return (
    <div className="glass-surface rounded-3xl p-6 border border-white/10 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <i className="ri-radar-line text-violet-400" aria-hidden="true" />
          Indikator Rekayasa Sosial ({indicators.length})
        </h3>
        <span className="text-[11px] text-slate-500 font-mono">
          Urutan berdasarkan relevansi
        </span>
      </div>

      {/* Daftar Kartu Indikator */}
      <div className="space-y-3">
        {indicators.map((ind, idx) => {
          const weightPercent = Math.round((ind.weight || 0) * 100);

          return (
            <div
              key={ind.code || idx}
              className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-4 transition-all hover:border-cyan-400/30 hover:bg-white/[0.05]"
            >
              {/* Baris Atas: Ikon, Nama Indikator, & Bobot */}
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-red-500/15 border border-red-400/30 flex items-center justify-center shrink-0 text-red-400">
                    <i className="ri-error-warning-line text-base" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {ind.label}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      KODE: {ind.code || "DETECTION"}
                    </span>
                  </div>
                </div>

                {/* Badge Bobot */}
                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-red-500/15 text-red-400 border border-red-400/25">
                    <i className="ri-scales-3-line text-[11px]" aria-hidden="true" />
                    {weightPercent}%
                  </span>
                </div>
              </div>

              {/* Kutipan Kalimat Pemicu (Blockquote Glassmorphism Miring) */}
              {ind.quote && (
                <blockquote
                  className="rounded-xl bg-black/30 border-l-2 border-red-400/70 p-3 text-xs text-slate-300 italic leading-relaxed backdrop-blur-sm"
                  cite="transkrip"
                >
                  <span className="not-italic text-red-400/80 mr-1.5 font-bold">"</span>
                  {ind.quote}
                  <span className="not-italic text-red-400/80 ml-1.5 font-bold">"</span>
                </blockquote>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
