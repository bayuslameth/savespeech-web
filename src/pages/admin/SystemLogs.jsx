import React, { useState, useEffect, useMemo } from "react";
import { getSystemLogs } from "../../services/adminApi";

// ─── Badge Status Log ─────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const config = {
    SUCCESS: {
      label: "Sukses",
      class: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
      icon: "ri-checkbox-circle-fill",
    },
    ERROR: {
      label: "Error",
      class: "bg-red-500/15 text-red-300 border-red-400/30",
      icon: "ri-close-circle-fill",
    },
    WARNING: {
      label: "Peringatan",
      class: "bg-yellow-500/15 text-yellow-300 border-yellow-400/30",
      icon: "ri-alert-fill",
    },
  };
  const cfg = config[status] || config.SUCCESS;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cfg.class}`}
    >
      <i className={`${cfg.icon} text-[10px]`} aria-hidden="true" />
      {cfg.label}
    </span>
  );
}

// ─── Badge Jenis Event ────────────────────────────────────────────────────────
function EventBadge({ event }) {
  const colorMap = {
    ANALYSIS_COMPLETED: "text-cyan-300 bg-cyan-500/10 border-cyan-400/20",
    UPLOAD_RECEIVED: "text-violet-300 bg-violet-500/10 border-violet-400/20",
    UPLOAD_FAILED: "text-red-300 bg-red-500/10 border-red-400/20",
    TRANSCRIPTION_FAILED: "text-orange-300 bg-orange-500/10 border-orange-400/20",
    RATE_LIMIT_HIT: "text-yellow-300 bg-yellow-500/10 border-yellow-400/20",
    SYSTEM_HEALTH_CHECK: "text-slate-300 bg-white/5 border-white/10",
  };
  const cls = colorMap[event] || "text-slate-300 bg-white/5 border-white/10";

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold border ${cls}`}>
      {event}
    </span>
  );
}

// ─── Format Timestamp ─────────────────────────────────────────────────────────
function formatTimestamp(isoString) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(isoString));
  } catch {
    return isoString;
  }
}

// ─── Halaman System Logs ──────────────────────────────────────────────────────
/**
 * Halaman Log Aktivitas Operasional Admin (/admin/logs).
 * Menampilkan tabel log sistem dengan filter pencarian sisi klien.
 *
 * SEC-09: Tidak ada transkrip percakapan, nama asli, atau email lengkap dalam tabel.
 */
export default function SystemLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    let ignore = false;
    getSystemLogs()
      .then((data) => {
        if (!ignore) {
          setLogs(data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setError("Gagal memuat log sistem. Periksa koneksi server.");
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  // Filter sisi klien berdasarkan query pencarian & filter status
  const filteredLogs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return logs.filter((log) => {
      const matchSearch =
        !q ||
        log.event.toLowerCase().includes(q) ||
        log.detail.toLowerCase().includes(q) ||
        (log.jobId && log.jobId.toLowerCase().includes(q)) ||
        log.maskedIp.toLowerCase().includes(q);

      const matchStatus = statusFilter === "ALL" || log.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [logs, searchQuery, statusFilter]);

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-white/[0.06]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-red-500/15 text-red-300 border border-red-400/30 mb-2 uppercase tracking-wider">
          <i className="ri-file-list-3-line" aria-hidden="true" />
          Admin · System Logs
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
          Log Aktivitas Sistem
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Log operasional real-time. Data telah dianonim sesuai{" "}
          <strong className="text-slate-300">SEC-09</strong> (tidak ada transkrip atau identitas pengguna).
        </p>
      </div>

      {/* Kontrol Pencarian & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Input Pencarian */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <i className="ri-search-line text-base" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan event, keterangan, Job ID, atau IP..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 focus:border-cyan-400/60 focus:ring-2 focus:ring-violet-500/20 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white transition-colors"
              aria-label="Hapus pencarian"
            >
              <i className="ri-close-line text-base" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Filter Status */}
        <div className="flex gap-2 shrink-0">
          {["ALL", "SUCCESS", "ERROR", "WARNING"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                statusFilter === s
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/40"
                  : "text-slate-400 hover:text-white bg-white/[0.03] border-white/10 hover:border-white/20"
              }`}
            >
              {s === "ALL"
                ? "Semua"
                : s === "SUCCESS"
                ? "Sukses"
                : s === "ERROR"
                ? "Error"
                : "Peringatan"}
            </button>
          ))}
        </div>
      </div>

      {/* Info Jumlah Hasil */}
      {!loading && !error && (
        <p className="text-[11px] font-mono text-slate-500">
          Menampilkan {filteredLogs.length} dari {logs.length} entri log
          {searchQuery && ` · filter: "${searchQuery}"`}
        </p>
      )}

      {/* Loading State */}
      {loading && (
        <div className="glass-surface rounded-2xl border border-white/10 overflow-hidden animate-pulse">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="flex items-center gap-4 px-5 py-4 border-b border-white/[0.05]">
              <div className="h-3 bg-white/10 rounded w-28" />
              <div className="h-5 bg-white/10 rounded w-40" />
              <div className="h-5 bg-white/10 rounded w-16" />
              <div className="h-3 bg-white/10 rounded flex-1" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="glass-surface rounded-2xl p-6 border border-red-400/30 text-center space-y-3">
          <i className="ri-error-warning-line text-3xl text-red-400 block" aria-hidden="true" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Tabel Log — overflow-x-auto agar tidak bocor di layar kecil */}
      {!loading && !error && (
        <div className="glass-surface rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">
                    Waktu
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">
                    Event
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Keterangan
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">
                    IP (Disamar)
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                      <i className="ri-search-2-line text-2xl block mb-2 text-slate-600" aria-hidden="true" />
                      Tidak ada log yang sesuai dengan pencarian
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log, idx) => (
                    <tr
                      key={log.id}
                      className={`border-b border-white/[0.05] hover:bg-white/[0.025] transition-colors ${
                        idx % 2 === 0 ? "" : "bg-white/[0.015]"
                      }`}
                    >
                      {/* Kolom: Waktu */}
                      <td className="px-4 py-3.5 text-[11px] font-mono text-slate-400 whitespace-nowrap">
                        {formatTimestamp(log.timestamp)}
                      </td>

                      {/* Kolom: Event */}
                      <td className="px-4 py-3.5">
                        <EventBadge event={log.event} />
                      </td>

                      {/* Kolom: Status */}
                      <td className="px-4 py-3.5">
                        <StatusBadge status={log.status} />
                      </td>

                      {/* Kolom: Keterangan */}
                      <td className="px-4 py-3.5 text-xs text-slate-300 max-w-xs">
                        <span className="line-clamp-2">{log.detail}</span>
                        {log.jobId && (
                          <span className="block text-[10px] font-mono text-slate-600 mt-0.5">
                            Job: {log.jobId}
                          </span>
                        )}
                      </td>

                      {/* Kolom: IP Tersamar */}
                      <td className="px-4 py-3.5 text-[11px] font-mono text-slate-500 whitespace-nowrap">
                        {log.maskedIp}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer tabel */}
          <div className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
            <p className="text-[10px] font-mono text-slate-600">
              {filteredLogs.length} entri ditampilkan · Data log tidak memuat transkrip atau identitas pengguna (SEC-09)
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
              <i className="ri-time-line" aria-hidden="true" />
              Diperbarui: {new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date())}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
