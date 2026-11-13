import React from "react";

/**
 * Disclaimer standar yang dapat dipakai ulang di halaman hasil analisis.
 * Mengingatkan pengguna bahwa hasil hanya merupakan indikasi risiko,
 * bukan keputusan final, dan agar tidak membagikan data sensitif.
 */
export default function Disclaimer({ compact = false }) {
  return (
    <div
      role="note"
      className={`rounded-2xl border border-yellow-400/20 bg-yellow-500/[0.05] ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <div className="flex items-start gap-2.5">
        <i
          className={`ri-alert-line text-yellow-400 shrink-0 ${compact ? "text-sm mt-0.5" : "text-base mt-0.5"}`}
          aria-hidden="true"
        />
        <div className="space-y-1.5">
          <p
            className={`font-semibold text-yellow-300 ${compact ? "text-xs" : "text-sm"}`}
          >
            Penting — Baca Sebelum Melanjutkan
          </p>
          <p className={`text-slate-300 leading-relaxed ${compact ? "text-[11px]" : "text-xs"}`}>
            Hasil yang diberikan merupakan{" "}
            <strong className="text-white">indikasi risiko berdasarkan pola komunikasi</strong>{" "}
            dan <strong className="text-white">bukan keputusan final</strong>. Gunakan sebagai
            panduan tambahan, bukan satu-satunya dasar pengambilan keputusan.
          </p>
          <p className={`text-slate-300 leading-relaxed ${compact ? "text-[11px]" : "text-xs"}`}>
            <strong className="text-red-300">
              Jangan pernah membagikan OTP, PIN, atau password kepada siapa pun,
            </strong>{" "}
            termasuk pihak yang mengaku sebagai petugas bank atau instansi resmi.
          </p>
        </div>
      </div>
    </div>
  );
}
