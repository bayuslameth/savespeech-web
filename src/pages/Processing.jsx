import React, { useEffect, useRef, useState, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAnalysis } from "../context/AnalysisContext";
import { useAnalysisJob } from "../hooks/useAnalysisJob";
import { formatBytes, formatDuration } from "../utils/audioValidation";
import ProcessingWaveform from "../components/processing/ProcessingWaveform";
import ProgressRing from "../components/processing/ProgressRing";
import PipelineStepper from "../components/processing/PipelineStepper";
import SecurityTips from "../components/processing/SecurityTips";
import ErrorPanel from "../components/processing/ErrorPanel";
import Disclaimer from "../components/Disclaimer";
import Button from "../components/ui/Button";
import Footer from "../components/Footer";

// ─── Indikator Langkah (sama dengan Analyze.jsx, tahap ke-2 aktif) ────────────
const STEPS = [
  { label: "Unggah", icon: "ri-upload-cloud-2-line" },
  { label: "Proses", icon: "ri-cpu-line" },
  { label: "Hasil", icon: "ri-bar-chart-2-line" },
];

function StepIndicator({ activeStep = 1 }) {
  return (
    <div role="list" aria-label="Langkah analisis" className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, i) => {
        const isActive = i === activeStep;
        const isDone = i < activeStep;
        return (
          <React.Fragment key={step.label}>
            <div
              role="listitem"
              aria-current={isActive ? "step" : undefined}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isDone
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-400"
                    : isActive
                    ? "bg-gradient-to-br from-cyan-500 to-violet-600 border-transparent text-white shadow-[0_0_18px_rgba(139,92,246,0.5)]"
                    : "bg-white/[0.04] border-white/15 text-slate-500"
                }`}
              >
                {isDone ? (
                  <i className="ri-check-line text-sm" aria-hidden="true" />
                ) : (
                  <i className={`${step.icon} text-sm`} aria-hidden="true" />
                )}
              </div>
              <span
                className={`text-[11px] font-semibold ${
                  isActive ? "text-white" : isDone ? "text-cyan-400" : "text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                aria-hidden="true"
                className={`h-px w-16 mx-1 mt-[-12px] transition-colors duration-300 ${
                  i < activeStep ? "bg-cyan-400/60" : "bg-white/10"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Dialog Konfirmasi Batalkan ────────────────────────────────────────────────
function CancelDialog({ onConfirm, onClose }) {
  const dialogRef = useRef(null);

  // Fokus ke tombol Batalkan Proses saat dialog muncul
  useEffect(() => {
    dialogRef.current?.querySelector("button")?.focus();
  }, []);

  // Tutup dengan Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <motion.div
        ref={dialogRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18 }}
        className="relative w-full max-w-sm glass-surface rounded-2xl p-6 border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-10"
      >
        <div className="w-12 h-12 rounded-xl bg-orange-500/15 border border-orange-400/30 flex items-center justify-center mx-auto mb-4">
          <i className="ri-stop-circle-line text-2xl text-orange-400" aria-hidden="true" />
        </div>

        <h2
          id="cancel-dialog-title"
          className="text-base font-bold text-white text-center mb-2"
        >
          Batalkan Proses?
        </h2>
        <p className="text-sm text-slate-400 text-center mb-5 leading-relaxed">
          Proses analisis akan dihentikan. File audio Anda tetap tersimpan dan dapat dianalisis ulang.
        </p>

        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={onClose} aria-label="Lanjutkan proses">
            Lanjutkan
          </Button>
          <button
            type="button"
            onClick={onConfirm}
            aria-label="Konfirmasi batalkan proses"
            className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-orange-500/80 hover:bg-orange-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 cursor-pointer"
          >
            Batalkan Proses
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Halaman Processing ────────────────────────────────────────────────────────
export default function Processing() {
  const navigate = useNavigate();
  const { file, meta } = useAnalysis();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Guard: tidak ada file → redirect ke /analisis
  if (!file) {
    return <Navigate to="/analisis" replace />;
  }

  return <ProcessingContent file={file} meta={meta} navigate={navigate} showCancelDialog={showCancelDialog} setShowCancelDialog={setShowCancelDialog} />;
}

/**
 * Komponen dalam terpisah agar hook useAnalysisJob tidak dipanggil secara kondisional.
 */
function ProcessingContent({ file, meta, navigate, showCancelDialog, setShowCancelDialog }) {
  const { status, progress, elapsedSec, error, retry, cancel } = useAnalysisJob();
  const isActive = status !== "done" && status !== "failed";

  // Peringatan beforeunload saat proses berjalan
  useEffect(() => {
    if (!isActive) return;

    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "Proses analisis sedang berlangsung. Yakin ingin meninggalkan halaman?";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isActive]);

  const handleBackFromError = useCallback(() => {
    navigate("/analisis", { replace: true });
  }, [navigate]);

  const handleCancelConfirm = useCallback(() => {
    setShowCancelDialog(false);
    cancel();
  }, [cancel, setShowCancelDialog]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-[#05060f] text-slate-100 bg-security-grid">
      <main className="relative z-10 flex-grow px-4 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto">

          {/* Judul */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Memproses Percakapan
            </h1>
            <p className="text-sm text-slate-400">
              Mohon tunggu, proses berlangsung selama ±11 detik.
            </p>
          </div>

          {/* Indikator langkah — tahap 2 (Proses) aktif */}
          <StepIndicator activeStep={1} />

          {/* Info file ringkas */}
          <div className="flex items-center gap-3 glass-surface rounded-2xl px-4 py-3 mb-6 border border-white/10">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center shrink-0">
              <i className="ri-file-music-line text-sm text-cyan-400" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="text-sm font-semibold text-white truncate"
                title={meta?.name ?? file?.name}
              >
                {meta?.name ?? file?.name}
              </p>
              <p className="text-xs text-slate-400">
                {formatBytes(meta?.size ?? file?.size ?? 0)}
                {meta?.duration > 0 && <> &bull; {formatDuration(meta.duration)}</>}
              </p>
            </div>
            {/* Badge status */}
            <div
              className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                error
                  ? "bg-red-500/15 text-red-400 border border-red-400/30"
                  : status === "done"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-400/30"
                  : "bg-cyan-500/15 text-cyan-300 border border-cyan-400/30"
              }`}
              aria-live="polite"
            >
              {error ? (
                <i className="ri-close-circle-line" aria-hidden="true" />
              ) : status === "done" ? (
                <i className="ri-checkbox-circle-line" aria-hidden="true" />
              ) : (
                <i className="ri-loader-4-line animate-spin" aria-hidden="true" />
              )}
              <span>
                {error ? "Gagal" : status === "done" ? "Selesai" : "Memproses"}
              </span>
            </div>
          </div>

          {/* Waveform reaktif */}
          <div className="mb-6">
            <ProcessingWaveform status={error ? "failed" : status} height={120} />
          </div>

          {/* Error panel */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <ErrorPanel
                message={error}
                onRetry={retry}
                onBack={handleBackFromError}
              />
            </motion.div>
          )}

          {/* Layout dua kolom: ring + stepper */}
          {!error && (
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 mb-6 items-start">
              {/* Progress Ring */}
              <div className="flex justify-center sm:justify-start">
                <ProgressRing
                  progress={progress}
                  status={status}
                  elapsedSec={elapsedSec}
                />
              </div>

              {/* Pipeline Stepper */}
              <div className="glass-surface rounded-2xl p-5 border border-white/10">
                <PipelineStepper status={status} progress={progress} />
              </div>
            </div>
          )}

          {/* Security Tips + Disclaimer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <SecurityTips />
            <Disclaimer compact />
          </div>

          {/* Tombol Batalkan — hanya saat proses berjalan */}
          {isActive && !error && (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() => setShowCancelDialog(true)}
                aria-label="Batalkan proses analisis"
                className="text-orange-300 border-orange-400/30 hover:text-orange-200 hover:bg-orange-500/10"
              >
                <i className="ri-stop-circle-line" aria-hidden="true" />
                <span>Batalkan</span>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Dialog konfirmasi batalkan */}
      {showCancelDialog && (
        <CancelDialog
          onConfirm={handleCancelConfirm}
          onClose={() => setShowCancelDialog(false)}
        />
      )}
    </div>
  );
}
