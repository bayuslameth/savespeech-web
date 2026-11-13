import React from "react";
import { MAX_SIZE_MB, MAX_DURATION_SEC, ALLOWED_EXT } from "../../utils/audioValidation";

const FORMAT_DETAILS = [
  {
    ext: "WAV",
    icon: "ri-file-music-line",
    color: "text-cyan-400",
    desc: "Kualitas terbaik, lossless. Disarankan untuk rekaman yang jelas.",
  },
  {
    ext: "MP3",
    icon: "ri-file-music-2-line",
    color: "text-violet-400",
    desc: "Format populer, terkompresi. Cocok untuk rekaman umum.",
  },
  {
    ext: "M4A",
    icon: "ri-file-music-fill",
    color: "text-pink-400",
    desc: "Format Apple Audio, kualitas baik dengan ukuran kecil.",
  },
];

const TIPS = [
  { icon: "ri-mic-line", text: "Gunakan rekaman yang jelas dan minim noise latar." },
  { icon: "ri-translate-2", text: "Percakapan dalam Bahasa Indonesia memberikan hasil terbaik." },
  { icon: "ri-volume-up-line", text: "Pastikan volume cukup keras agar transkripsi akurat." },
  { icon: "ri-time-line", text: `Durasi minimal ${3} detik, maksimal ${MAX_DURATION_SEC / 60} menit.` },
];

export default function FormatInfo() {
  return (
    <div className="space-y-4">
      {/* Panel Format yang Didukung */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
          <i className="ri-file-list-3-line text-cyan-400" aria-hidden="true" />
          Format yang Didukung
        </h3>
        <div className="space-y-3">
          {FORMAT_DETAILS.map((f) => (
            <div key={f.ext} className="flex items-start gap-3">
              <div className="shrink-0 w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center">
                <i className={`${f.icon} ${f.color} text-sm`} aria-hidden="true" />
              </div>
              <div>
                <p className={`text-xs font-bold ${f.color}`}>{f.ext}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel Batasan */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
          <i className="ri-ruler-line text-violet-400" aria-hidden="true" />
          Batasan File
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-3 text-center">
            <p className="text-lg font-bold text-white">{MAX_SIZE_MB} MB</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Ukuran Maksimum</p>
          </div>
          <div className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-3 text-center">
            <p className="text-lg font-bold text-white">10 Mnt</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Durasi Maksimum</p>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-slate-500 text-center">
          Ekstensi yang diterima: {ALLOWED_EXT.join(", ")}
        </p>
      </div>

      {/* Saran Kualitas */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
          <i className="ri-lightbulb-line text-yellow-400" aria-hidden="true" />
          Saran Kualitas Rekaman
        </h3>
        <ul className="space-y-2.5">
          {TIPS.map((tip, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <i className={`${tip.icon} text-sm text-slate-400 mt-0.5 shrink-0`} aria-hidden="true" />
              <span className="text-xs text-slate-300 leading-relaxed">{tip.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
