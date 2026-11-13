import React, { useState, useEffect } from "react";
import { getAggregateStats } from "../../services/adminApi";

// ─── Komponen Bar Chart Horizontal CSS Murni ────────────────────────────────
/**
 * Satu bar horizontal untuk distribusi kategori scam.
 * Menggunakan CSS flexbox + width persentase (tidak ada library chart).
 *
 * @param {string} label - Label kategori
 * @param {number} count - Jumlah kejadian
 * @param {number} maxCount - Nilai maksimum untuk normalisasi lebar bar
 * @param {string} colorClass - Kelas Tailwind gradient untuk warna bar
 * @param {number} totalCount - Total semua kategori untuk persentase
 */
function CategoryBar({ label, count, maxCount, colorClass, totalCount }) {
  // Hitung lebar bar sebagai persentase relatif terhadap nilai terbesar
  const widthPercent = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;
  // Hitung porsi dari total
  const portion = totalCount > 0 ? ((count / totalCount) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-1.5">
      {/* Label + nilai */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="text-slate-300 font-medium truncate max-w-[200px]">{label}</span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono font-bold text-white tabular-nums">{count.toLocaleString("id-ID")}</span>
          <span className="text-slate-500 font-mono text-[11px]">({portion}%)</span>
        </div>
      </div>

      {/* Track bar */}
      <div className="relative h-5 w-full rounded-full bg-white/[0.05] overflow-hidden">
        {/* Bar berisi gradien dengan lebar sesuai data */}
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorClass} transition-all duration-700 ease-out relative`}
          style={{ width: `${widthPercent}%` }}
          role="progressbar"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={maxCount}
          aria-label={label}
        >
          {/* Glow efek di ujung kanan bar */}
          <div className="absolute right-0 top-0 h-full w-6 bg-white/20 blur-sm rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ─── Komponen Kartu Statistik ────────────────────────────────────────────────
function StatCard({ icon, label, value, subtitle, color = "text-cyan-400", bgColor = "bg-cyan-500/10 border-cyan-400/20" }) {
  return (
    <div className={`glass-surface rounded-2xl p-5 border ${bgColor} flex items-start gap-4`}>
      <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0`}>
        <i className={`${icon} text-lg ${color}`} aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-1">{label}</p>
        <p className={`text-2xl font-heading font-extrabold tabular-nums ${color}`}>{value}</p>
        {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── Komponen Skeleton Loading ───────────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="glass-surface rounded-2xl p-5 border border-white/10 h-24 bg-white/[0.02]" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-surface rounded-2xl p-6 border border-white/10 h-72 bg-white/[0.02]" />
        <div className="glass-surface rounded-2xl p-6 border border-white/10 h-72 bg-white/[0.02]" />
      </div>
    </div>
  );
}

// ─── Halaman Utama Dashboard Admin ───────────────────────────────────────────
/**
 * Halaman Overview Admin Dashboard (/admin).
 * Menampilkan statistik agregat sistem dan visualisasi distribusi kategori scam
 * menggunakan bar chart CSS murni (tanpa library eksternal).
 */
export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    getAggregateStats()
      .then((data) => {
        if (!ignore) {
          setStats(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setError("Gagal memuat statistik sistem. Periksa koneksi server.");
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-5 border-b border-white/[0.06]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-red-500/15 text-red-300 border border-red-400/30 mb-2 uppercase tracking-wider">
          <i className="ri-dashboard-3-line" aria-hidden="true" />
          Admin · Overview
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
          Statistik Agregat Sistem
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Data statistik global SAVESPEECH. Tidak memuat informasi identitas atau transkrip pengguna.
        </p>
      </div>

      {/* Konten */}
      {loading && <DashboardSkeleton />}

      {error && (
        <div className="glass-surface rounded-2xl p-6 border border-red-400/30 text-center space-y-3">
          <i className="ri-error-warning-line text-3xl text-red-400 block" aria-hidden="true" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {stats && (
        <div className="space-y-8">
          {/* ── Kartu Statistik Utama ─────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              icon="ri-bar-chart-box-line"
              label="Analisis Hari Ini"
              value={stats.totalAnalysisToday.toLocaleString("id-ID")}
              subtitle={`Total: ${stats.totalAnalysisAllTime.toLocaleString("id-ID")} analisis`}
              color="text-cyan-400"
              bgColor="glass-surface border-cyan-400/15"
            />
            <StatCard
              icon="ri-timer-flash-line"
              label="Rata-rata Proses"
              value={`${stats.avgProcessTimeSec}d`}
              subtitle="detik per analisis"
              color="text-violet-400"
              bgColor="glass-surface border-violet-400/15"
            />
            <StatCard
              icon="ri-shield-check-line"
              label="Success Rate"
              value={`${stats.successRate}%`}
              subtitle="dari seluruh job analisis"
              color="text-emerald-400"
              bgColor="glass-surface border-emerald-400/15"
            />
            <StatCard
              icon="ri-server-line"
              label="System Uptime"
              value={`${stats.systemUptimePercent}%`}
              subtitle={`Model: ${stats.modelVersion}`}
              color="text-yellow-400"
              bgColor="glass-surface border-yellow-400/15"
            />
          </div>

          {/* ── Visualisasi: Distribusi Kategori Scam ────────── */}
          <div className="glass-surface rounded-2xl p-6 border border-white/10">
            <div className="flex items-start justify-between gap-3 mb-6">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <i className="ri-pie-chart-2-line text-cyan-400" aria-hidden="true" />
                  Distribusi Kategori Scam (Minggu Ini)
                </h2>
                <p className="text-[11px] text-slate-500 mt-1">
                  Data agregat tanpa informasi identitas pengguna
                </p>
              </div>
              <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-400/25">
                {stats.scamCategoryDistribution
                  .reduce((s, c) => s + c.count, 0)
                  .toLocaleString("id-ID")}{" "}
                total
              </span>
            </div>

            {/* Bar chart CSS murni — tidak menggunakan library */}
            <div className="space-y-5">
              {(() => {
                // Hitung nilai maksimum untuk normalisasi lebar bar relatif
                const maxCount = Math.max(...stats.scamCategoryDistribution.map((c) => c.count));
                const totalCount = stats.scamCategoryDistribution.reduce((s, c) => s + c.count, 0);
                return stats.scamCategoryDistribution.map((cat) => (
                  <CategoryBar
                    key={cat.key}
                    label={cat.label}
                    count={cat.count}
                    maxCount={maxCount}
                    totalCount={totalCount}
                    colorClass={cat.color}
                  />
                ));
              })()}
            </div>
          </div>

          {/* ── Visualisasi: Distribusi Label Hasil ──────────── */}
          <div className="glass-surface rounded-2xl p-6 border border-white/10">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-6">
              <i className="ri-donut-chart-line text-violet-400" aria-hidden="true" />
              Distribusi Label Analisis (Minggu Ini)
            </h2>

            {/* Bar chart CSS murni untuk label SCAM/SUSPICIOUS/NORMAL */}
            <div className="space-y-5">
              {(() => {
                const maxCount = Math.max(...stats.labelDistribution.map((l) => l.count));
                const totalCount = stats.labelDistribution.reduce((s, l) => s + l.count, 0);
                return stats.labelDistribution.map((item) => (
                  <CategoryBar
                    key={item.label}
                    label={item.label}
                    count={item.count}
                    maxCount={maxCount}
                    totalCount={totalCount}
                    colorClass={item.color}
                  />
                ));
              })()}
            </div>
          </div>

          {/* ── Info Model & False Positive ──────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-surface rounded-2xl p-5 border border-white/10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-400/20 flex items-center justify-center shrink-0">
                <i className="ri-alert-line text-lg text-orange-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Laporan False Positive</p>
                <p className="text-2xl font-heading font-extrabold text-orange-400 tabular-nums">
                  {stats.falsePositiveReportedPercent}%
                </p>
                <p className="text-[11px] text-slate-500">dari total prediksi SCAM</p>
              </div>
            </div>

            <div className="glass-surface rounded-2xl p-5 border border-white/10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-400/20 flex items-center justify-center shrink-0">
                <i className="ri-cpu-line text-lg text-violet-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Versi Model AI</p>
                <p className="text-sm font-heading font-bold text-violet-300 font-mono mt-1">{stats.modelVersion}</p>
                <p className="text-[11px] text-slate-500">
                  Diperbarui:{" "}
                  {new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(
                    new Date(stats.lastModelUpdate)
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
