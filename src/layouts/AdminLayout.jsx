import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const ADMIN_NAV = [
  {
    to: "/admin",
    end: true,
    icon: "ri-dashboard-3-line",
    label: "Overview",
    desc: "Statistik agregat sistem",
  },
  {
    to: "/admin/logs",
    end: false,
    icon: "ri-file-list-3-line",
    label: "System Logs",
    desc: "Log aktivitas operasional",
  },
];

/**
 * Layout khusus area Admin Panel.
 * Menampilkan sidebar navigasi admin di kiri dan konten halaman di kanan.
 * Di layar mobile, sidebar berubah menjadi top navigation bar.
 */
export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#030409] text-slate-100 flex flex-col">
      {/* ── Top Bar Admin ──────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-cyan-500/15 bg-[#030409]/90 backdrop-blur-xl">
        <div className="flex items-center justify-between h-14 px-4 sm:px-6">
          {/* Logo & Badge Admin */}
          <div className="flex items-center gap-3">
            {/* Tombol hamburger mobile */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen((p) => !p)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Buka menu admin"
            >
              <i className={`text-lg ${mobileSidebarOpen ? "ri-close-line" : "ri-menu-3-line"}`} aria-hidden="true" />
            </button>

            {/* Brand */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400/20 via-violet-500/20 to-pink-500/20 border border-cyan-400/30 flex items-center justify-center">
                <i className="ri-pulse-line text-sm text-cyan-400" aria-hidden="true" />
              </div>
              <span className="font-heading font-bold text-sm tracking-wider bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent hidden sm:block">
                SAVESPEECH
              </span>
            </Link>

            {/* Badge Admin */}
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-400/30">
              <i className="ri-shield-star-line text-[10px]" aria-hidden="true" />
              Admin Panel
            </span>
          </div>

          {/* Kanan: Info Admin & Aksi */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-semibold text-white leading-tight">{user?.nama}</span>
              <span className="text-[10px] text-red-300 font-mono leading-tight">Administrator</span>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white glass-surface border border-white/10 hover:border-cyan-400/40 transition-all"
            >
              <i className="ri-arrow-left-line text-sm" aria-hidden="true" />
              <span className="hidden sm:inline">Kembali ke Publik</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-300 hover:text-red-200 bg-red-500/10 hover:bg-red-500/15 border border-red-400/25 transition-all cursor-pointer"
            >
              <i className="ri-logout-box-r-line text-sm" aria-hidden="true" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation (collapsed menu) */}
        {mobileSidebarOpen && (
          <nav className="lg:hidden border-t border-white/5 px-4 py-2 flex gap-2 overflow-x-auto">
            {ADMIN_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileSidebarOpen(false)}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                <i className={`${item.icon} text-sm`} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      {/* ── Layout Utama: Sidebar + Konten ────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-white/[0.06] bg-[#040509] pt-6 pb-4 px-3 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          {/* Label Seksi */}
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-3">
            Navigasi Admin
          </p>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1">
            {ADMIN_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-start gap-3 px-3 py-3 rounded-xl transition-all duration-150 group ${
                    isActive
                      ? "bg-cyan-500/15 border border-cyan-400/35 text-white shadow-[0_0_16px_rgba(34,211,238,0.12)]"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isActive ? "bg-cyan-500/20 text-cyan-300" : "bg-white/5 text-slate-500 group-hover:text-slate-300"
                      }`}
                    >
                      <i className={`${item.icon} text-sm`} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <span className={`block text-xs font-bold ${isActive ? "text-white" : "text-slate-300"}`}>
                        {item.label}
                      </span>
                      <span className="block text-[10px] text-slate-500 truncate">{item.desc}</span>
                    </div>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Divider */}
          <div className="mt-auto pt-4 border-t border-white/[0.06]">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all"
            >
              <i className="ri-arrow-left-line text-sm" aria-hidden="true" />
              <span>Kembali ke Publik</span>
            </Link>
          </div>
        </aside>

        {/* Area Konten Halaman */}
        <main className="flex-1 overflow-y-auto min-h-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
