import React from "react";
import { motion, useReducedMotion } from "framer-motion";

// ─── Definisi 4 Tahap Pipeline ────────────────────────────────────────────────
const PIPELINE_STEPS = [
  {
    id: "uploading",
    label: "Mengunggah Audio",
    activeText: "Mengupload file ke server analisis…",
    icon: "ri-upload-cloud-2-line",
    doneIcon: "ri-checkbox-circle-line",
  },
  {
    id: "transcribing",
    label: "Speech-to-Text (Whisper)",
    activeText: "Mengubah suara menjadi teks…",
    icon: "ri-mic-ai-line",
    doneIcon: "ri-checkbox-circle-line",
  },
  {
    id: "analyzing",
    label: "AI Analysis",
    activeText: "Menganalisis pola penipuan…",
    icon: "ri-brain-line",
    doneIcon: "ri-checkbox-circle-line",
  },
  {
    id: "done",
    label: "Selesai",
    activeText: "Menyiapkan laporan…",
    icon: "ri-shield-check-line",
    doneIcon: "ri-shield-check-line",
  },
];

// Urutan tahap untuk menentukan apakah suatu langkah sudah done/active/pending
const STATUS_ORDER = ["uploading", "transcribing", "analyzing", "done"];

function getStepState(stepId, currentStatus) {
  const stepIdx = STATUS_ORDER.indexOf(stepId);
  const currentIdx = STATUS_ORDER.indexOf(currentStatus);

  if (currentStatus === "failed") {
    // Semua langkah setelah yang aktif terakhir dianggap pending
    return stepIdx < currentIdx ? "done" : stepIdx === currentIdx ? "failed" : "pending";
  }
  if (stepIdx < currentIdx) return "done";
  if (stepIdx === currentIdx) return "active";
  return "pending";
}

export default function PipelineStepper({ status, progress }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="w-full" aria-label="Tahap pemrosesan">
      <div className="flex flex-col gap-0">
        {PIPELINE_STEPS.map((step, i) => {
          const stepState = getStepState(step.id, status);
          const isLast = i === PIPELINE_STEPS.length - 1;

          return (
            <div key={step.id} className="flex gap-4">
              {/* ─ Kolom kiri: ikon + garis penghubung ─ */}
              <div className="flex flex-col items-center">
                {/* Ikon lingkaran */}
                <motion.div
                  animate={
                    stepState === "active" && !shouldReduceMotion
                      ? { scale: [1, 1.08, 1], opacity: [1, 0.85, 1] }
                      : { scale: 1, opacity: 1 }
                  }
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-500 ${
                    stepState === "done"
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-400"
                      : stepState === "active"
                      ? "bg-gradient-to-br from-cyan-500 to-violet-600 border-transparent text-white shadow-[0_0_20px_rgba(139,92,246,0.55)]"
                      : stepState === "failed"
                      ? "bg-red-500/15 border-red-400 text-red-400"
                      : "bg-white/[0.04] border-white/15 text-slate-500"
                  }`}
                >
                  {stepState === "done" && (
                    <i className="ri-check-line text-sm" aria-hidden="true" />
                  )}
                  {stepState === "failed" && (
                    <i className="ri-close-line text-sm" aria-hidden="true" />
                  )}
                  {(stepState === "active" || stepState === "pending") && (
                    <i className={`${step.icon} text-sm`} aria-hidden="true" />
                  )}
                </motion.div>

                {/* Garis penghubung vertikal */}
                {!isLast && (
                  <div className="w-px flex-1 mt-1 mb-1 min-h-[24px] overflow-hidden bg-white/10 rounded-full">
                    <motion.div
                      className="w-full bg-gradient-to-b from-cyan-400 to-violet-500 rounded-full"
                      initial={{ height: "0%" }}
                      animate={{
                        height:
                          stepState === "done"
                            ? "100%"
                            : stepState === "active"
                            ? `${Math.min(100, progress)}%`
                            : "0%",
                      }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: "easeOut" }}
                    />
                  </div>
                )}
              </div>

              {/* ─ Kolom kanan: label + status teks ─ */}
              <div className={`pb-5 ${isLast ? "pb-0" : ""} min-w-0`}>
                <p
                  className={`text-sm font-semibold transition-colors duration-300 ${
                    stepState === "done"
                      ? "text-cyan-400"
                      : stepState === "active"
                      ? "text-white"
                      : stepState === "failed"
                      ? "text-red-400"
                      : "text-slate-500"
                  }`}
                >
                  {step.label}
                </p>

                {/* Teks deskripsi aktif / selesai */}
                {stepState === "active" && (
                  <p
                    className="text-xs text-slate-400 mt-0.5"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {step.activeText}
                  </p>
                )}
                {stepState === "done" && (
                  <p className="text-xs text-cyan-400/70 mt-0.5">Selesai</p>
                )}
                {stepState === "failed" && (
                  <p className="text-xs text-red-400/80 mt-0.5">Gagal</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
