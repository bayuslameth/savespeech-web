import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useAnalysis } from "../context/AnalysisContext";
import { getHistory, deleteHistoryItem } from "../services/historyApi";
import WaveformCanvas from "../components/WaveformCanvas";
import HistoryCard from "../components/history/HistoryCard";
import EmptyHistory from "../components/history/EmptyHistory";
import Footer from "../components/Footer";

/** Skeleton loader saat memuat riwayat */
function HistorySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="glass-surface rounded-2xl p-5 border border-white/10 space-y-4 animate-pulse"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2 w-2/3">
              <div className="h-3 bg-white/10 rounded w-24" />
              <div className="h-4 bg-white/10 rounded w-40" />
            </div>
            <div className="h-10 w-12 bg-white/10 rounded-xl" />
          </div>
          <div className="flex gap-2">
            <div className="h-5 w-24 bg-white/10 rounded-full" />
            <div className="h-5 w-32 bg-white/10 rounded-full" />
          </div>
          <div className="h-10 bg-white/5 rounded-xl" />
          <div className="h-8 bg-white/10 rounded-xl pt-2" />
        </div>
      ))}
    </div>
  );
}

/**
 * Halaman Riwayat Analisis Pengguna (/riwayat).
 * Menampilkan daftar hasil analisis lampau, kontrol penghapusan data (privasi),
 * dan navigasi untuk meninjau kembali laporan detail.
 */
export default function History() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { setResult } = useAnalysis();

  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Ambil data riwayat saat mount atau token berganti (pola data fetching resmi React)
  useEffect(() => {
    let ignore = false;

    getHistory(token)
      .then((data) => {
        if (!ignore) {
          setHistoryItems(data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setError("Gagal memuat riwayat analisis. Silakan periksa koneksi Anda.");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [token]);

  // Handler refresh manual lewat tombol aksi
  const handleRefresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHistory(token);
      setHistoryItems(data || []);
    } catch {
      setError("Gagal memuat riwayat analisis. Silakan periksa koneksi Anda.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Buka detail hasil analisis di halaman /hasil
  const handleViewDetail = useCallback(
    (item) => {
      // Simpan data riwayat ke result di context agar /hasil bisa membacanya
      setResult({
        jobId: item.jobId,
        label: item.label,
        scamCategory: item.scamCategory,
        riskScore: item.riskScore,
        riskLevel: item.riskLevel,
        explanation: item.explanation,
        indicators: item.indicators || [],
        transcript: item.transcript || [],
      });
      navigate("/hasil");
    },
    [navigate, setResult]
  );

  // Hapus item riwayat dengan Optimistic UI Update
  const handleDelete = useCallback(
    async (id) => {
      const confirmed = window.confirm(
        "Apakah Anda yakin ingin menghapus data analisis ini secara permanen?"
      );
      if (!confirmed) return;

      // Simpan state saat ini untuk rollback jika API gagal
      const previousItems = [...historyItems];

      // Optimistic update: hapus dari tampilan seketika
      setHistoryItems((prev) => prev.filter((item) => item.id !== id));
      setDeletingId(id);

      try {
        await deleteHistoryItem(id, token);
      } catch {
        // Rollback state jika penghapusan gagal
        setHistoryItems(previousItems);
        alert("Gagal menghapus data riwayat. Silakan coba lagi.");
      } finally {
        setDeletingId(null);
      }
    },
    [historyItems, token]
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-[#05060f] text-slate-100 bg-security-grid">
      {/* Waveform latar halus */}
      <div
        className="fixed inset-x-0 top-16 pointer-events-none opacity-10"
        aria-hidden="true"
        style={{ height: "200px" }}
      >
        <WaveformCanvas amplitude={0.25} speed={0.4} height={200} />
      </div>

      <main className="relative z-10 flex-grow px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl mx-auto w-full space-y-8">
        {/* Header Halaman */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 mb-2">
              <i className="ri-history-line text-cyan-400" aria-hidden="true" />
              <span>Manajemen Data Pengguna</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Riwayat Analisis Percakapan
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Daftar evaluasi percakapan yang pernah Anda lakukan. Sesuai komitmen privasi kami,{" "}
              <strong className="text-slate-300">berkas rekaman audio tidak pernah disimpan</strong> di server.
            </p>
          </div>

          {/* Tombol Refresh Manual */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white glass-surface border border-white/10 hover:border-cyan-400/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer disabled:opacity-50"
              aria-label="Muat ulang data riwayat"
            >
              <i className={`ri-refresh-line text-sm ${loading ? "animate-spin text-cyan-400" : ""}`} aria-hidden="true" />
              <span>Segarkan</span>
            </button>
          </div>
        </div>

        {/* Konten Utama */}
        {loading ? (
          <HistorySkeleton />
        ) : error ? (
          <div className="glass-surface rounded-2xl p-6 border border-red-400/30 text-center max-w-md mx-auto space-y-4">
            <i className="ri-error-warning-line text-3xl text-red-400 block" aria-hidden="true" />
            <p className="text-sm text-red-300">{error}</p>
            <button
              type="button"
              onClick={handleRefresh}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-500/80 hover:bg-red-500 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        ) : historyItems.length === 0 ? (
          <EmptyHistory />
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-slate-400">
                Menampilkan {historyItems.length} rekaman analisis
              </span>
            </div>

            {/* Grid Kartu Riwayat dengan Animasi Keluar (AnimatePresence) */}
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <AnimatePresence>
                {historyItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, y: 15 }}
                    transition={{ duration: 0.25 }}
                  >
                    <HistoryCard
                      item={item}
                      onViewDetail={handleViewDetail}
                      onDelete={handleDelete}
                      isDeleting={deletingId === item.id}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
