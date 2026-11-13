import React from "react";

/**
 * Kotak persetujuan privasi sebelum analisis.
 * Checkbox wajib dicentang sebelum tombol Analyze aktif.
 */
export default function ConsentBox({ checked, onChange }) {
  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 space-y-3">
      {/* Checkbox persetujuan */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative shrink-0 mt-0.5">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            aria-required="true"
            aria-describedby="consent-privacy-note"
            className="sr-only peer"
          />
          {/* Kotak visual checkbox custom */}
          <div
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
              checked
                ? "bg-gradient-to-br from-cyan-500 to-violet-600 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.35)]"
                : "bg-white/[0.06] border-white/20 group-hover:border-cyan-400/50"
            }`}
          >
            {checked && (
              <i className="ri-check-line text-white text-sm leading-none" aria-hidden="true" />
            )}
          </div>
        </div>
        <span className="text-sm text-slate-300 leading-relaxed select-none">
          Saya menyetujui pemrosesan audio ini untuk analisis dan menyatakan berhak atas rekaman yang saya unggah.
        </span>
      </label>

      {/* Catatan privasi */}
      <div
        id="consent-privacy-note"
        className="flex items-start gap-2.5 text-xs text-slate-400 bg-slate-800/40 rounded-xl px-3 py-2.5 border border-white/[0.07]"
      >
        <i className="ri-lock-2-line text-sm text-cyan-400/80 shrink-0 mt-0.5" aria-hidden="true" />
        <span className="leading-relaxed">
          Audio dihapus otomatis setelah analisis selesai.{" "}
          <strong className="text-slate-300">SAVESPEECH</strong> tidak menyimpan OTP, PIN, atau nomor rekening.
        </span>
      </div>
    </div>
  );
}
