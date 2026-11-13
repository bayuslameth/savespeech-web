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
    badgeClass: "bg-red-500/15 text-red-400 border-red-400/30",
    icon: "ri-alarm-warning-line",
  },
  SUSPICIOUS: {
    title: "Terindikasi Mencurigakan",
    badgeClass: "bg-yellow-500/15 text-yellow-400 border-yellow-400/30",
    icon: "ri-alert-line",
  },
  NORMAL: {
    title: "Terindikasi Normal",
    badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-400/30",
    icon: "ri-shield-check-line",
  },
};

const RISK_COLOR_MAP = {
  Low: "text-emerald-400",
  Medium: "text-yellow-400",
  High: "text-orange-400",
  Critical: "text-red-400",
};

/** Format tanggal ISO ke format Bahasa Indonesia */
function formatLocalDate(isoString) {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return isoString;
  }
}

/**
 * Kartu ringkasan tiap item riwayat analisis.
 * Memuat tanggal, badge label, skor risiko, kategori scam, dan tombol aksi.
 */
export default function HistoryCard({ item, onViewDetail, onDelete, isDeleting }) {
  const labelData = LABEL_CONFIG[item.label] || LABEL_CONFIG.NORMAL;
  const scoreColor = RISK_COLOR_MAP[item.riskLevel] || "text-slate-300";
  const categoryTitle = item.scamCategory
    ? CATEGORY_NAMES[item.scamCategory] || item.scamCategory
    : "Percakapan Normal";

  return (
    <div className="glass-surface rounded-2xl p-5 border border-white/10 hover:border-cyan-400/30 transition-all duration-200 flex flex-col justify-between gap-4 group relative overflow-hidden">
      {/* Glow halus di latar belakang saat hover */}
      <div
        className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-15 transition-opacity duration-300 bg-cyan-400"
        aria-hidden="true"
      />

      <div className="space-y-3">
        {/* Baris Atas: Tanggal & Nama File */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <i className="ri-calendar-line text-slate-500" aria-hidden="true" />
              {formatLocalDate(item.createdAt)}
            </span>
            <p
              className="text-xs font-semibold text-slate-200 truncate mt-1"
              title={item.fileName}
            >
              <i className="ri-file-music-line text-cyan-400/80 mr-1 text-[11px]" aria-hidden="true" />
              {item.fileName || "audio_recording.mp3"}
            </p>
          </div>

          {/* Skor Risiko */}
          <div className="text-right shrink-0 bg-white/[0.03] px-2.5 py-1 rounded-xl border border-white/[0.08]">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Skor</span>
            <span className={`text-xl font-heading font-extrabold tabular-nums ${scoreColor}`}>
              {item.riskScore}
            </span>
            <span className="text-[10px] text-slate-500">/100</span>
          </div>
        </div>

        {/* Badges: Label & Kategori */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${labelData.badgeClass}`}
          >
            <i className={labelData.icon} aria-hidden="true" />
            {labelData.title}
          </span>

          {item.scamCategory && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-violet-500/15 text-violet-300 border border-violet-400/25">
              {categoryTitle}
            </span>
          )}
        </div>

        {/* Cuplikan Singkat Penjelasan */}
        {item.explanation && (
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed pt-1">
            {item.explanation}
          </p>
        )}
      </div>

      {/* Tombol Aksi Bawah */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/[0.07]">
        {/* Tombol Lihat Detail */}
        <button
          type="button"
          onClick={() => onViewDetail(item)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/25 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
          aria-label={`Lihat detail analisis tanggal ${formatLocalDate(item.createdAt)}`}
        >
          <i className="ri-eye-line text-sm" aria-hidden="true" />
          <span>Lihat Detail</span>
        </button>

        {/* Tombol Hapus Riwayat */}
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          disabled={isDeleting}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-400/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 cursor-pointer disabled:opacity-50"
          aria-label={`Hapus riwayat analisis ${item.fileName}`}
        >
          {isDeleting ? (
            <i className="ri-loader-4-line animate-spin text-sm" aria-hidden="true" />
          ) : (
            <i className="ri-delete-bin-line text-sm" aria-hidden="true" />
          )}
          <span>Hapus</span>
        </button>
      </div>
    </div>
  );
}
