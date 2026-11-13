import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useAnalysis } from "../context/AnalysisContext";
import { startAnalysis, getJobStatus, getResult, cancelAnalysis } from "../services/analysisApi";
import { addHistoryItem } from "../services/historyApi";

/**
 * Hook yang mengelola lifecycle satu job analisis:
 * start → polling setiap 1000 ms → done/failed → navigasi.
 *
 * Mengekspos: { status, progress, elapsedSec, error, retry, cancel }
 */
export function useAnalysisJob() {
  const navigate = useNavigate();
  const { preferences } = useAuth();
  const { file, setResult } = useAnalysis();

  const [status, setStatus] = useState("uploading");   // status job saat ini
  const [progress, setProgress] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [error, setError] = useState(null);

  // Ref guard: mencegah double-start di React StrictMode (effect dipanggil 2×)
  const startedRef = useRef(false);
  const jobIdRef = useRef(null);
  const abortRef = useRef(null);           // AbortController aktif
  const pollTimerRef = useRef(null);       // ID setTimeout polling saat ini
  const elapsedTimerRef = useRef(null);    // ID setInterval untuk waktu berjalan
  const startTimeRef = useRef(null);
  const pollRef = useRef(null);            // Ref untuk fungsi polling rekursif

  // ─── Cleanup total ────────────────────────────────────────────────────────
  const cleanup = useCallback(() => {
    // Batalkan semua pending async
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    // Hentikan polling dan timer elapsed
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    if (elapsedTimerRef.current) {
      clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }
  }, []);

  // ─── Fungsi polling rekursif ──────────────────────────────────────────────
  const poll = useCallback(
    async (jobId) => {
      // Buat AbortController baru untuk request ini
      const ac = new AbortController();
      abortRef.current = ac;

      try {
        const job = await getJobStatus(jobId, ac.signal);

        // Jika sudah di-abort (unmount / cancel), tidak proses lebih lanjut
        if (ac.signal.aborted) return;

        setStatus(job.status);
        setProgress(job.progress);

        if (job.status === "done") {
          // Ambil hasil dan simpan ke context
          cleanup();
          const resultData = await getResult(jobId, new AbortController().signal);
          // Sesuai PRD FR-20: catat ke riwayat hanya jika pengguna opt-in
          if (preferences?.saveHistory) {
            addHistoryItem(resultData, file?.name);
          }
          setResult(resultData);
          navigate("/hasil", { replace: true });
          return;
        }

        if (job.status === "failed") {
          cleanup();
          setError(job.errorMessage || "Proses analisis gagal. Silakan coba lagi.");
          return;
        }

        // Jadwalkan polling berikutnya 1000 ms kemudian lewat ref rekursif
        pollTimerRef.current = setTimeout(() => {
          pollRef.current?.(jobId);
        }, 1000);
      } catch (err) {
        if (err.name === "AbortError") return; // Dibatalkan — abaikan
        cleanup();
        setError("Terjadi kesalahan saat memproses. Silakan coba lagi.");
      }
    },
    [cleanup, file, navigate, preferences, setResult]
  );

  // Selalu perbarui pollRef ke versi terbaru fungsi poll
  useEffect(() => {
    pollRef.current = poll;
  }, [poll]);

  // ─── Start job ────────────────────────────────────────────────────────────
  const startJob = useCallback(async () => {
    if (!file) return;
    cleanup();

    setStatus("uploading");
    setProgress(0);
    setError(null);
    startTimeRef.current = Date.now();

    // Timer elapsed (detik berjalan)
    elapsedTimerRef.current = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 500);

    try {
      const ac = new AbortController();
      abortRef.current = ac;
      const { jobId } = await startAnalysis(file, ac.signal);
      if (ac.signal.aborted) return;
      jobIdRef.current = jobId;
      poll(jobId);
    } catch (err) {
      if (err.name === "AbortError") return;
      cleanup();
      setError("Gagal memulai analisis. Silakan coba lagi.");
    }
  }, [file, cleanup, poll]);

  // ─── Effect: start saat mount ─────────────────────────────────────────────
  useEffect(() => {
    // Ref guard mencegah React StrictMode double-invoke effect memulai 2 job
    if (startedRef.current) return;
    startedRef.current = true;

    startJob();

    return () => {
      // Cleanup saat komponen unmount (navigasi pergi)
      cleanup();
      if (jobIdRef.current) {
        cancelAnalysis(jobIdRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // hanya sekali saat mount

  // ─── Fungsi publik ────────────────────────────────────────────────────────

  /**
   * Coba lagi setelah failed: reset startedRef, panggil ulang startJob.
   */
  const retry = useCallback(() => {
    startedRef.current = true;
    jobIdRef.current = null;
    setElapsedSec(0);
    startJob();
  }, [startJob]);

  /**
   * Batalkan job: hentikan polling, panggil cancelAnalysis, kembali ke /analisis.
   * File tetap tersimpan di context.
   */
  const cancel = useCallback(() => {
    cleanup();
    if (jobIdRef.current) {
      cancelAnalysis(jobIdRef.current);
      jobIdRef.current = null;
    }
    navigate("/analisis", { replace: true });
  }, [cleanup, navigate]);

  return { status, progress, elapsedSec, error, retry, cancel };
}
