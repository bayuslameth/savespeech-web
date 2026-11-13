import React, { useState, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAnalysis } from "../context/AnalysisContext";
import WaveformCanvas from "../components/WaveformCanvas";
import Disclaimer from "../components/Disclaimer";
import Footer from "../components/Footer";
import RiskMeter from "../components/result/RiskMeter";
import ResultSummary from "../components/result/ResultSummary";
import IndicatorList from "../components/result/IndicatorList";
import TranscriptView from "../components/result/TranscriptView";
import ResultActions from "../components/result/ResultActions";

// ─── Indikator Langkah (Tahap ke-3: Hasil Aktif) ─────────────────────────────
const STEPS = [
  { label: "Unggah", icon: "ri-upload-cloud-2-line" },
  { label: "Proses", icon: "ri-cpu-line" },
  { label: "Hasil", icon: "ri-bar-chart-2-line" },
];

function StepIndicator({ activeStep = 2 }) {
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

/**
 * Halaman Dashboard Hasil Analisis Percakapan (Phase 5).
 * Memuat evaluasi risiko, indikator rekayasa sosial, transkrip bertanda waktu,
 * dan sistem tab navigasi yang aksesibel.
 */
export default function Result() {
  const navigate = useNavigate();
  const { result, clearFile, clearResult } = useAnalysis();
  const [activeTab, setActiveTab] = useState("summary"); // "summary" | "transcript"

  // Handler kembali / mulai analisis baru
  const handleNewAnalysis = useCallback(() => {
    clearResult();
    clearFile();
    navigate("/analisis", { replace: true });
  }, [clearFile, clearResult, navigate]);

  // Guard: Jika tidak ada data hasil di memori context → redirect ke /analisis
  if (!result) {
    return <Navigate to="/analisis" replace />;
  }

  const transcriptCount = result.transcript?.length || 0;
  const indicatorsCount = result.indicators?.length || 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-[#05060f] text-slate-100 bg-security-grid">
      {/* Waveform latar halaman */}
      <div
        className="fixed inset-x-0 top-16 pointer-events-none opacity-15"
        aria-hidden="true"
        style={{ height: "220px" }}
      >
        <WaveformCanvas amplitude={0.35} speed={0.5} height={220} />
      </div>

      <main className="relative z-10 flex-grow px-4 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Header Dashboard */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 mb-3">
              <i className="ri-shield-check-line text-cyan-400" aria-hidden="true" />
              <span>Sesi Analisis Selesai</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Laporan Analisis Percakapan
            </h1>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Hasil deteksi awal pola manipulasi, urgensi palsu, dan risiko keamanan informasi.
            </p>
          </div>

          {/* Stepper Progres (Tahap 3 Aktif) */}
          <StepIndicator activeStep={2} />

          {/* Sistem Tab Aksesibel */}
          <div className="flex justify-center">
            <div
              role="tablist"
              aria-label="Tampilan Laporan"
              className="inline-flex p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md"
            >
              {/* Tab 1: Ringkasan Hasil */}
              <button
                type="button"
                id="tab-summary"
                role="tab"
                aria-selected={activeTab === "summary"}
                aria-controls="panel-summary"
                onClick={() => setActiveTab("summary")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer ${
                  activeTab === "summary"
                    ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-[0_0_18px_rgba(139,92,246,0.4)]"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <i className="ri-dashboard-line text-sm" aria-hidden="true" />
                <span>Ringkasan Hasil</span>
                {indicatorsCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white">
                    {indicatorsCount}
                  </span>
                )}
              </button>

              {/* Tab 2: Transkrip Penuh */}
              <button
                type="button"
                id="tab-transcript"
                role="tab"
                aria-selected={activeTab === "transcript"}
                aria-controls="panel-transcript"
                onClick={() => setActiveTab("transcript")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer ${
                  activeTab === "transcript"
                    ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-[0_0_18px_rgba(139,92,246,0.4)]"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <i className="ri-chat-voice-line text-sm" aria-hidden="true" />
                <span>Transkrip Penuh</span>
                {transcriptCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white">
                    {transcriptCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Konten Tab Aktif */}
          <AnimatePresence mode="wait">
            {activeTab === "summary" ? (
              <motion.div
                key="panel-summary"
                id="panel-summary"
                role="tabpanel"
                aria-labelledby="tab-summary"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6"
              >
                {/* Kolom Kiri: Pengukur Risiko & Ringkasan Hasil */}
                <div className="space-y-6">
                  <RiskMeter score={result.riskScore} level={result.riskLevel} />
                  <ResultSummary
                    label={result.label}
                    scamCategory={result.scamCategory}
                    explanation={result.explanation}
                  />
                </div>

                {/* Kolom Kanan: Indikator Terdeteksi */}
                <div>
                  <IndicatorList indicators={result.indicators} />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="panel-transcript"
                id="panel-transcript"
                role="tabpanel"
                aria-labelledby="tab-transcript"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <TranscriptView transcript={result.transcript} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Area Footer: Disclaimer Standar & Tombol Aksi */}
          <div className="space-y-6 pt-2">
            <Disclaimer />
            <ResultActions onNewAnalysis={handleNewAnalysis} result={result} />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
