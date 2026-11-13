import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useAnalysis } from "../context/AnalysisContext";
import { validateBasic, validateFull } from "../utils/audioValidation";
import { computePeaks } from "../utils/waveformPeaks";
import WaveformCanvas from "../components/WaveformCanvas";
import AudioDropzone from "../components/upload/AudioDropzone";
import FileSummary from "../components/upload/FileSummary";
import FormatInfo from "../components/upload/FormatInfo";
import ConsentBox from "../components/upload/ConsentBox";
import Disclaimer from "../components/Disclaimer";
import Button from "../components/ui/Button";
import Footer from "../components/Footer";

// ─── Indikator Langkah ────────────────────────────────────────────────────────
const STEPS = [
  { label: "Unggah", icon: "ri-upload-cloud-2-line" },
  { label: "Proses", icon: "ri-cpu-line" },
  { label: "Hasil", icon: "ri-bar-chart-2-line" },
];

function StepIndicator({ activeStep = 0 }) {
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

// ─── Halaman Analyze ──────────────────────────────────────────────────────────
export default function Analyze() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { file: ctxFile, meta: ctxMeta, setFile: ctxSetFile, clearFile: ctxClear } =
    useAnalysis();

  // State file — pertahankan dari context bila pengguna kembali dari /proses
  const [file, setFileState] = useState(ctxFile || null);
  const [meta, setMetaState] = useState(ctxMeta || null);
  const [peaks, setPeaks] = useState(null);
  const [isValid, setIsValid] = useState(ctxFile ? true : false);
  const [errorMsg, setErrorMsg] = useState("");
  const [validating, setValidating] = useState(false);
  const [dragState, setDragState] = useState("idle"); // "idle"|"dragover"|"error"
  const [multiDropWarning, setMultiDropWarning] = useState(false);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Ref untuk input tersembunyi untuk ganti file
  const replaceInputRef = useRef(null);

  // Amplitudo waveform latar: naik bila file valid
  const bgAmp = isValid && file ? 0.5 : 0.25;

  // Proses file baru yang dipilih / di-drop
  const processFile = useCallback(async (newFile, wasMulti = false) => {
    if (!newFile) return;

    setMultiDropWarning(wasMulti);
    setDragState("idle");
    setIsValid(false);
    setErrorMsg("");
    setPeaks(null);
    setConsent(false);

    // Validasi cepat sinkron dulu agar UX responsif
    const quick = validateBasic(newFile);
    if (!quick.ok) {
      setFileState(newFile);
      setMetaState({ name: newFile.name, size: newFile.size, duration: 0 });
      setErrorMsg(quick.error);
      setDragState("error");
      setIsValid(false);
      return;
    }

    setValidating(true);
    setFileState(newFile);
    setMetaState({ name: newFile.name, size: newFile.size, duration: 0 });

    try {
      // Validasi penuh (magic bytes + durasi) secara paralel dengan komputasi peaks
      const [fullResult, computedPeaks] = await Promise.all([
        validateFull(newFile),
        computePeaks(newFile, 80),
      ]);

      if (!fullResult.ok) {
        setErrorMsg(fullResult.error);
        setDragState("error");
        setIsValid(false);
        setPeaks(computedPeaks);
        setMetaState({ name: newFile.name, size: newFile.size, duration: 0 });
      } else {
        setIsValid(true);
        setDragState("idle");
        setErrorMsg("");
        setPeaks(computedPeaks);
        setMetaState({
          name: newFile.name,
          size: newFile.size,
          duration: fullResult.duration,
        });
      }
    } finally {
      setValidating(false);
    }
  }, []);

  const handleFileSelected = useCallback(
    (newFile, wasMulti = false) => {
      processFile(newFile, wasMulti);
    },
    [processFile]
  );

  const handleReplace = useCallback(() => {
    replaceInputRef.current?.click();
  }, []);

  const handleReplaceChange = useCallback(
    (e) => {
      const f = e.target.files?.[0];
      if (f) processFile(f, false);
      e.target.value = "";
    },
    [processFile]
  );

  const handleRemove = useCallback(() => {
    setFileState(null);
    setMetaState(null);
    setPeaks(null);
    setIsValid(false);
    setErrorMsg("");
    setDragState("idle");
    setConsent(false);
    setMultiDropWarning(false);
    ctxClear();
  }, [ctxClear]);

  const handleDragEnter = useCallback(() => setDragState("dragover"), []);
  const handleDragLeave = useCallback(() => setDragState("idle"), []);

  // Submit: simpan ke context dan navigasi ke /proses
  const handleSubmit = useCallback(async () => {
    if (!isValid || !file || !consent) return;
    setSubmitting(true);
    ctxSetFile(file, meta);
    setTimeout(() => {
      navigate("/proses");
      setSubmitting(false);
    }, 400);
  }, [isValid, file, consent, ctxSetFile, meta, navigate]);

  const canSubmit = isValid && file && consent && !validating && !submitting;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-[#05060f] text-slate-100 bg-security-grid">
      {/* Waveform latar halaman */}
      <div
        className="fixed inset-x-0 top-16 pointer-events-none opacity-20"
        aria-hidden="true"
        style={{ height: "220px" }}
      >
        <WaveformCanvas amplitude={bgAmp} speed={0.6} height={220} />
      </div>

      <main className="relative z-10 flex-grow px-4 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">

          {/* Judul */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 mb-3">
              <i className="ri-user-smile-line text-cyan-400" aria-hidden="true" />
              <span>Halo, {user?.nama || "Pengguna"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Analisis Percakapan
            </h1>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Unggah rekaman percakapan untuk diperiksa pola risiko penipuan berbasis AI.
            </p>
          </div>

          {/* Indikator langkah */}
          <StepIndicator activeStep={0} />

          {/* Dua kolom layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

            {/* ── Kolom Kiri ── */}
            <div className="space-y-5">

              {/* Peringatan drop multi-file */}
              {multiDropWarning && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="status"
                  aria-live="polite"
                  className="flex items-center gap-2.5 text-xs text-yellow-300 bg-yellow-500/10 border border-yellow-400/25 rounded-xl px-4 py-2.5"
                >
                  <i className="ri-information-line text-sm shrink-0" aria-hidden="true" />
                  <span>Beberapa file terdeteksi. Hanya file pertama yang digunakan.</span>
                </motion.div>
              )}

              {/* Status validasi sedang berjalan */}
              {validating && (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex items-center gap-2.5 text-xs text-cyan-300 bg-cyan-500/10 border border-cyan-400/25 rounded-xl px-4 py-2.5"
                >
                  <i className="ri-loader-4-line animate-spin text-sm shrink-0" aria-hidden="true" />
                  <span>Memvalidasi file audio...</span>
                </div>
              )}

              {/* Dropzone atau FileSummary */}
              {!file ? (
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                >
                  <AudioDropzone
                    onFileSelected={handleFileSelected}
                    dragState={dragState}
                    disabled={validating}
                  />
                </div>
              ) : (
                <motion.div
                  key="file-summary"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <FileSummary
                    file={file}
                    meta={meta}
                    peaks={peaks}
                    isValid={isValid}
                    errorMsg={errorMsg}
                    onReplace={handleReplace}
                    onRemove={handleRemove}
                  />
                </motion.div>
              )}

              {/* Input tersembunyi untuk ganti file */}
              <input
                ref={replaceInputRef}
                type="file"
                accept=".wav,.mp3,.m4a,audio/*"
                className="sr-only"
                onChange={handleReplaceChange}
                tabIndex={-1}
                aria-hidden="true"
              />

              {/* Consent + Tombol — hanya tampil bila ada file */}
              {file && (
                <motion.div
                  key="consent-submit"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.1 }}
                  className="space-y-4"
                >
                  <ConsentBox checked={consent} onChange={setConsent} />

                  <Button
                    fullWidth
                    disabled={!canSubmit}
                    loading={submitting || validating}
                    onClick={handleSubmit}
                    aria-label="Mulai analisis percakapan"
                  >
                    {!submitting && !validating && (
                      <i className="ri-radar-line text-base" aria-hidden="true" />
                    )}
                    <span>
                      {validating
                        ? "Memvalidasi..."
                        : submitting
                        ? "Menyiapkan..."
                        : "Analyze Conversation"}
                    </span>
                  </Button>

                  {!canSubmit && !validating && file && (
                    <p
                      className="text-xs text-center text-slate-500"
                      aria-live="polite"
                    >
                      {!isValid
                        ? "Perbaiki file untuk melanjutkan."
                        : !consent
                        ? "Setujui ketentuan di atas untuk melanjutkan."
                        : ""}
                    </p>
                  )}
                </motion.div>
              )}
            </div>

            {/* ── Kolom Kanan ── */}
            <div className="space-y-5">
              <FormatInfo />
              <Disclaimer />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
