import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useAnalysis } from "../context/AnalysisContext";
import { startAnalysis, getJobStatus, getResult, cancelAnalysis } from "../services/analysisApi";
import { addHistoryItem } from "../services/historyApi";

/**
 * Hook yang mengelola lifecycle satu job analisis terhadap backend nyata:
 * start → polling status berkala (1000-2000 ms) → done/failed → navigasi.
 *
 * Mengekspos: { status, progress, elapsedSec, error, retry, cancel }
 */
export function useAnalysisJob() {
  const navigate = useNavigate();
  const { token, preferences } = useAuth();
  const { file, setResult } = useAnalysis();

  const [status, setStatus] = useState("uploading");
  const [progress, setProgress] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [error, setError] = useState(null);

  // Ref guard: mencegah double-start di React StrictMode
  const startedRef = useRef(false);
  const jobIdRef = useRef(null);
  const abortRef = useRef(null);
  const pollTimerRef = useRef(null);
  const elapsedTimerRef = useRef(null);
  const startTimeRef = useRef(null);
  const pollRef = useRef(null);

  // ─── Cleanup total ────────────────────────────────────────────────────────
  const cleanup = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    if (elapsedTimerRef.current) {
      clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }
  }, []);

  // ─── Fungsi polling rekursif membaca status dari backend riil ─────────────
  const poll = useCallback(
    async (jobId) => {
      const ac = new AbortController();
      abortRef.current = ac;

      try {
        const job = await getJobStatus(jobId, token, ac.signal);

        // Jika request telah dibatalkan, hentikan pemrosesan
        if (ac.signal.aborted) return;

        setStatus(job.status);
        setProgress(job.progress ?? 0);

        if (job.status === "done") {
          cleanup();
          const resultData = await getResult(jobId, token, new AbortController().signal);

          // Sesuai PRD FR-20: catat riwayat hanya jika pengguna opt-in
          if (preferences?.saveHistory) {
            addHistoryItem(resultData, file?.name);
          }

          setResult(resultData);
          navigate("/hasil", { replace: true });
          return;
        }

        if (job.status === "failed") {
          cleanup();
          setError(job.errorMessage || "Proses analisis gagal diproses oleh server.");
          return;
        }

        // Jadwalkan polling berikutnya dalam 1500 ms
        pollTimerRef.current = setTimeout(() => {
          pollRef.current?.(jobId);
        }, 1500);
      } catch (err) {
        if (err.name === "AbortError") return;
        cleanup();
        setError(err.message || "Terjadi kesalahan saat memproses. Silakan coba lagi.");
      }
    },
    [cleanup, file, navigate, preferences, setResult, token]
  );

  useEffect(() => {
    pollRef.current = poll;
  }, [poll]);

  // ─── Start job: POST berkas multipart ke backend ──────────────────────────
  const startJob = useCallback(async () => {
    if (!file) return;
    cleanup();

    setStatus("uploading");
    setProgress(0);
    setError(null);
    startTimeRef.current = Date.now();

    elapsedTimerRef.current = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 500);

    try {
      const ac = new AbortController();
      abortRef.current = ac;
      const { jobId } = await startAnalysis(file, token, ac.signal);
      if (ac.signal.aborted) return;
      jobIdRef.current = jobId;
      poll(jobId);
    } catch (err) {
      if (err.name === "AbortError") return;
      cleanup();
      setError(err.message || "Gagal memulai analisis audio. Pastikan server backend aktif.");
    }
  }, [file, cleanup, poll, token]);

  // ─── Effect: start saat mount ─────────────────────────────────────────────
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    startJob();

    return () => {
      cleanup();
      if (jobIdRef.current) {
        cancelAnalysis(jobIdRef.current, token);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Fungsi kontrol publik ────────────────────────────────────────────────
  const retry = useCallback(() => {
    startedRef.current = true;
    jobIdRef.current = null;
    setElapsedSec(0);
    startJob();
  }, [startJob]);

  const cancel = useCallback(() => {
    cleanup();
    if (jobIdRef.current) {
      cancelAnalysis(jobIdRef.current, token);
      jobIdRef.current = null;
    }
    navigate("/analisis", { replace: true });
  }, [cleanup, navigate, token]);

  return { status, progress, elapsedSec, error, retry, cancel };
}
