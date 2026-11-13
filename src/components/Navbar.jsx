import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const NAV_ITEMS = [
  { label: "Beranda", targetId: "beranda" },
  { label: "Cara Kerja", targetId: "cara-kerja" },
  { label: "Fitur", targetId: "fitur" },
  { label: "Keamanan", targetId: "keamanan" },
];

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Tutup dropdown saat klik di luar atau menekan tombol Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSectionNavigation = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (location.pathname !== "/") {
      navigate(`/#${targetId}`);
      return;
    }

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#05060f]/80 border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={(e) => handleSectionNavigation(e, "beranda")}
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400/20 via-violet-500/20 to-pink-500/20 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.2)] group-hover:shadow-[0_0_22px_rgba(139,92,246,0.4)] transition-shadow">
            <i className="ri-pulse-line text-xl text-cyan-400 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-lg tracking-wider bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent">
              SAVESPEECH
            </span>
            <span className="text-[10px] uppercase tracking-widest text-cyan-400/80 -mt-1 font-medium">
              Defensive AI
            </span>
          </div>
        </Link>

        {/* Menu Navigasi Desktop */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.targetId}
              href={`#${item.targetId}`}
              onClick={(e) => handleSectionNavigation(e, item.targetId)}
              className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors focus:outline-none focus-visible:text-cyan-400"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Area Aksi & Autentikasi Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/analisis"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-cyan-200 bg-cyan-500/10 border border-cyan-400/30 hover:bg-cyan-500/20 transition-all"
          >
            <i className="ri-shield-flash-line text-sm text-cyan-400" />
            <span>Mulai Analisis</span>
          </Link>

          {!isAuthenticated ? (
            <>
              <Link
                to="/masuk"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
              >
                Masuk
              </Link>
              <Link
                to="/daftar"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-95 transition-all shadow-[0_0_20px_rgba(139,92,246,0.35)]"
              >
                Daftar
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-expanded={dropdownOpen}
                aria-haspopup="menu"
                className="inline-flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl glass-surface hover:border-cyan-400/40 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                  {getInitials(user?.nama)}
                </span>
                <span className="text-sm font-medium text-slate-100 max-w-[130px] truncate">
                  {user?.nama}
                </span>
                <i
                  className={`ri-arrow-down-s-line text-slate-400 transition-transform ${
                    dropdownOpen ? "rotate-180 text-cyan-400" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#0a0d1d]/95 backdrop-blur-xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.65)] py-2 z-50"
                >
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-xs font-semibold text-white truncate">
                      {user?.nama}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {user?.email}
                    </p>
                    {user?.role === "admin" && (
                      <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-400/30">
                        <i className="ri-shield-star-line text-[9px]" aria-hidden="true" />
                        Administrator
                      </span>
                    )}
                  </div>

                  {/* Menu Admin Panel — hanya untuk role admin */}
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-200 hover:text-red-100 hover:bg-red-500/10 transition-colors border-b border-white/[0.06]"
                    >
                      <i className="ri-dashboard-3-line text-base text-red-400" />
                      <span>Admin Panel</span>
                    </Link>
                  )}

                  <Link
                    to="/analisis"
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-200 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                  >
                    <i className="ri-sound-module-line text-base text-cyan-400" />
                    <span>Analisis</span>
                  </Link>

                  <Link
                    to="/riwayat"
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-200 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                  >
                    <i className="ri-history-line text-base text-cyan-400" />
                    <span>Riwayat Analisis</span>
                  </Link>

                  <Link
                    to="/pengaturan"
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-200 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                  >
                    <i className="ri-settings-3-line text-base text-cyan-400" />
                    <span>Pengaturan</span>
                  </Link>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
                  >
                    <i className="ri-logout-box-r-line text-base text-red-400" />
                    <span>Keluar</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tombol Hamburger Mobile */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
          aria-expanded={mobileMenuOpen}
          aria-label="Buka menu navigasi"
        >
          <i
            className={`text-xl ${
              mobileMenuOpen ? "ri-close-line" : "ri-menu-3-line"
            }`}
          />
        </button>
      </div>

      {/* Panel Menu Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-surface border-t border-white/10 px-4 pt-3 pb-5 space-y-3">
          {isAuthenticated && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 text-white text-xs font-bold flex items-center justify-center">
                {getInitials(user?.nama)}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.nama}
                </p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.targetId}
                href={`#${item.targetId}`}
                onClick={(e) => handleSectionNavigation(e, item.targetId)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:text-cyan-400 hover:bg-white/5 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2.5">
            <Link
              to="/analisis"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-cyan-200 bg-cyan-500/15 border border-cyan-400/30"
            >
              <i className="ri-shield-flash-line text-cyan-400" />
              <span>Mulai Analisis</span>
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/riwayat"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 glass-surface border border-white/10 hover:border-cyan-400/30 transition-colors"
                >
                  <i className="ri-history-line text-cyan-400" />
                  <span>Riwayat Analisis</span>
                </Link>

                <Link
                  to="/pengaturan"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 glass-surface border border-white/10 hover:border-cyan-400/30 transition-colors"
                >
                  <i className="ri-settings-3-line text-cyan-400" />
                  <span>Pengaturan</span>
                </Link>
              </>
            )}

            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  to="/masuk"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 glass-surface border border-white/10"
                >
                  Masuk
                </Link>
                <Link
                  to="/daftar"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500"
                >
                  Daftar
                </Link>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-300 bg-red-500/10 border border-red-400/30 cursor-pointer"
              >
                <i className="ri-logout-box-r-line" />
                <span>Keluar</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}