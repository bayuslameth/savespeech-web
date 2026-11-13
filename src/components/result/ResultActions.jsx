import React from "react";
import Button from "../ui/Button";

/**
 * Tombol-tombol aksi di bagian bawah dashboard hasil analisis:
 * 1. Unduh Laporan (Simulasi Ekspor JSON Mock)
 * 2. Mulai Analisis Baru (membersihkan state dan kembali ke /analisis)
 */
export default function ResultActions({ onNewAnalysis, result }) {
  // Simulasi ekspor laporan JSON (Mock Export)
  const handleDownloadReport = () => {
    try {
      const exportData = {
        meta: {
          application: "SAVESPEECH Defensive AI",
          exportTime: new Date().toISOString(),
          version: "1.0",
        },
        analysis: result || {},
      };

      // Buat file Blob JSON
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
      const objectUrl = URL.createObjectURL(blob);

      // Pancing dialog unduhan di browser
      const downloadLink = document.createElement("a");
      downloadLink.href = objectUrl;
      const fileId = result?.jobId || "latest";
      downloadLink.download = `savespeech-report-${fileId}.json`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Revoke Object URL segera setelah unduhan terpicu untuk mencegah memory leak
      URL.revokeObjectURL(objectUrl);
    } catch {
      alert("Gagal mengunduh berkas laporan.");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
      {/* Tombol Unduh Laporan JSON (Ghost) */}
      <Button
        variant="ghost"
        onClick={handleDownloadReport}
        className="w-full sm:w-auto"
        aria-label="Unduh Laporan Analisis format JSON"
      >
        <i className="ri-file-download-line text-lg" aria-hidden="true" />
        <span>Unduh Laporan</span>
      </Button>

      {/* Tombol Mulai Analisis Baru (Primary) */}
      <Button
        variant="primary"
        onClick={onNewAnalysis}
        className="w-full sm:w-auto"
        aria-label="Mulai Analisis Audio Baru"
      >
        <i className="ri-refresh-line text-lg" aria-hidden="true" />
        <span>Mulai Analisis Baru</span>
      </Button>
    </div>
  );
}
