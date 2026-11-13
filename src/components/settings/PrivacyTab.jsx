import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import Switch from "../ui/Switch";

/**
 * Tab Preferensi Privasi & Kontrol Data (/pengaturan).
 * Mengimplementasikan Functional Requirement FR-20 (Opt-in penyimpanan riwayat)
 * dan SEC-05 Data Minimization (penghapusan audio percakapan tanpa penyimpanan).
 */
export default function PrivacyTab() {
  const { preferences, updatePreferences } = useAuth();
  const [saveHistory, setSaveHistory] = useState(
    Boolean(preferences?.saveHistory)
  );
  const [toastMessage, setToastMessage] = useState(null);

  const handleToggleSaveHistory = (checked) => {
    setSaveHistory(checked);
    updatePreferences({ saveHistory: checked });

    const message = checked
      ? "Preferensi disimpan: Riwayat analisis selanjutnya akan dicatat di akun Anda."
      : "Preferensi disimpan: Riwayat analisis selanjutnya tidak akan disimpan di akun Anda.";

    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  return (
    <div className="space-y-6">
      {/* Header Tab */}
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <i className="ri-shield-keyhole-line text-cyan-400" aria-hidden="true" />
          <span>Preferensi Privasi & Kontrol Data</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Kontrol penuh atas bagaimana data Anda diproses. SAVESPEECH dirancang dengan prinsip{" "}
          <strong className="text-slate-300">Privacy by Design</strong> dan kepatuhan perlindungan data pribadi.
        </p>
      </div>

      {/* Banner Notifikasi Status Preferensi */}
      {toastMessage && (
        <div
          role="status"
          className="flex items-center gap-2.5 p-3.5 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-200 text-xs font-semibold animate-fade-in"
        >
          <i className="ri-information-fill text-cyan-400 text-base shrink-0" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Bagian 1: Kebijakan Tetap Pemrosesan Audio (Data Minimization SEC-05) */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Penyimpanan Berkas Rekaman Audio
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              Sesuai standar keamanan <strong className="text-slate-300">PRD SEC-05 Data Minimization</strong>, berkas audio suara Anda{" "}
              <span className="text-cyan-300 font-semibold">dihapus secara otomatis dan permanen</span> dari memori pemrosesan segera setelah tahap inferensi AI selesai. Rekaman audio tidak pernah disimpan di disk atau database.
            </p>
          </div>

          <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
            Dihapus Otomatis
          </span>
        </div>
      </div>

      {/* Bagian 2: Fitur Opt-in Penyimpanan Riwayat Analisis (PRD FR-20) */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${saveHistory ? "bg-cyan-400" : "bg-slate-500"}`} />
            <h3 className="text-sm font-bold text-white">
              Penyimpanan Riwayat Analisis (Opt-in)
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Penyimpanan ringkasan hasil (skor risiko, indikator bahaya, dan cuplikan transkrip) bersifat eksplisit (*opt-in*). Secara default bernilai <strong className="text-slate-300">tidak aktif</strong> (FR-20).
          </p>
        </div>

        <div className="pt-2 border-t border-white/5">
          <Switch
            id="opt-in-save-history"
            checked={saveHistory}
            onChange={handleToggleSaveHistory}
            label="Simpan Riwayat Hasil Analisis di Akun Saya"
            description={
              saveHistory
                ? "Aktif: Ringkasan hasil evaluasi akan disimpan di akun Anda dan dapat ditinjau kapan saja melalui halaman Riwayat Analisis."
                : "Nonaktif: Hasil analisis hanya tersedia selama sesi browser aktif dan tidak akan dicatat di database riwayat."
            }
          />
        </div>
      </div>

      {/* Bagian 3: Hak Pengguna & Akses Cepat */}
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-200">
            Kelola atau Hapus Data Riwayat yang Tersimpan
          </h4>
          <p className="text-[11px] text-slate-400">
            Anda dapat menghapus masing-masing riwayat analisis kapan saja dengan kontrol penghapusan permanen.
          </p>
        </div>

        <Link
          to="/riwayat"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-cyan-300 hover:text-white glass-surface border border-cyan-400/30 hover:border-cyan-400/60 transition-all shrink-0"
        >
          <i className="ri-history-line text-sm" aria-hidden="true" />
          <span>Buka Riwayat Analisis</span>
        </Link>
      </div>
    </div>
  );
}
