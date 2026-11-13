import React from "react";

const CATEGORY_NAMES = {
  BANK_IMPERSONATION: "Penipuan Impersonasi Bank",
  E_WALLET_IMPERSONATION: "Penipuan Dompet Digital",
  OTP_SCAM: "Pencurian Kode OTP",
  TRANSFER_SCAM: "Modus Instruksi Transfer",
  ACCOUNT_BLOCKING_SCAM: "Ancaman Pemblokiran Akun",
};

const LABEL_CONFIG = {
  SCAM: {
    title: "Terindikasi Penipuan",
    icon: "ri-alarm-warning-line",
    badgeClass: "bg-red-500/15 text-red-400 border-red-400/30",
  },
  SUSPICIOUS: {
    title: "Terindikasi Mencurigakan",
    icon: "ri-alert-line",
    badgeClass: "bg-yellow-500/15 text-yellow-400 border-yellow-400/30",
  },
  NORMAL: {
    title: "Terindikasi Wajar / Aman",
    icon: "ri-shield-check-line",
    badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-400/30",
  },
};

/**
 * Kartu ringkasan hasil analisis utama.
 * Menggunakan bahasa non-absolut ("Terindikasi", bukan "Pasti Penipu").
 */
export default function ResultSummary({
  label = "SCAM",
  scamCategory = null,
  explanation = "",
}) {
  const labelData = LABEL_CONFIG[label] || LABEL_CONFIG.SUSPICIOUS;
  const categoryText = scamCategory
    ? CATEGORY_NAMES[scamCategory] || scamCategory
    : null;

  return (
    <div className="glass-surface rounded-3xl p-6 border border-white/10 space-y-4">
      {/* Header & Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${labelData.badgeClass}`}
        >
          <i className={labelData.icon} aria-hidden="true" />
          {labelData.title}
        </span>

        {categoryText && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/15 text-violet-300 border border-violet-400/30">
            <i className="ri-folder-warning-line" aria-hidden="true" />
            Kategori: {categoryText}
          </span>
        )}
      </div>

      {/* Judul Seksi */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
          <i className="ri-file-text-line text-cyan-400" aria-hidden="true" />
          Ulasan AI & Kesimpulan
        </h3>
        <p className="text-sm text-slate-200 leading-relaxed bg-black/25 p-4 rounded-2xl border border-white/[0.06]">
          {explanation ||
            "Pola komunikasi telah dianalisis untuk mendeteksi indikasi rekayasa sosial dan urgensi palsu."}
        </p>
      </div>

      {/* Catatan Kaki Evaluasi */}
      <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
        <i className="ri-shield-flash-line text-cyan-400 text-sm" aria-hidden="true" />
        <span>Hasil didasarkan pada klasifikasi model Natural Language Processing (NLP) SAVESPEECH.</span>
      </div>
    </div>
  );
}
