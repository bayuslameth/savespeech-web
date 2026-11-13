import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WaveformCanvas from "../components/WaveformCanvas";
import ProfileTab from "../components/settings/ProfileTab";
import SecurityTab from "../components/settings/SecurityTab";
import PrivacyTab from "../components/settings/PrivacyTab";
import Footer from "../components/Footer";

const TABS = [
  {
    id: "profile",
    label: "Profil Pengguna",
    shortLabel: "Profil",
    icon: "ri-user-settings-line",
    description: "Nama tampilan & identitas akun",
  },
  {
    id: "security",
    label: "Keamanan Akun",
    shortLabel: "Keamanan",
    icon: "ri-lock-password-line",
    description: "Kata sandi & proteksi akses",
  },
  {
    id: "privacy",
    label: "Preferensi Privasi",
    shortLabel: "Privasi",
    icon: "ri-shield-keyhole-line",
    description: "Opt-in riwayat & kontrol data",
  },
];

/**
 * Halaman Pengaturan Akun dan Preferensi Privasi (/pengaturan).
 * Menyediakan antarmuka terpadu untuk mengelola profil, keamanan, dan privasi (PRD FR-20).
 */
export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

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
        <div className="pb-6 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 mb-2">
            <i className="ri-settings-3-line text-cyan-400" aria-hidden="true" />
            <span>Pengaturan Akun & Privasi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Pengaturan Akun
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Kelola data profil pengguna, perbarui kata sandi keamanan, dan tentukan preferensi penyimpanan riwayat sesuai prinsip perlindungan privasi.
          </p>
        </div>

        {/* Kontrol Tab Mobile (< 768px) */}
        <div className="md:hidden">
          <div
            role="tablist"
            aria-label="Pilihan Kategori Pengaturan"
            className="flex p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md gap-1"
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`tab-button-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`tab-panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-[0_0_16px_rgba(139,92,246,0.35)]"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <i className={`${tab.icon} text-sm`} aria-hidden="true" />
                  <span>{tab.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Layout Desktop: Sidebar Navigasi + Konten Tab */}
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 lg:gap-8 items-start">
          {/* Sidebar Tab Navigasi Desktop */}
          <nav
            role="tablist"
            aria-label="Kategori Pengaturan Akun"
            className="hidden md:flex flex-col gap-2 p-2 rounded-2xl glass-surface border border-white/10 sticky top-24"
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`desktop-tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`tab-panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/15 to-violet-500/15 border border-cyan-400/40 text-white shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-300"
                        : "bg-white/5 text-slate-400"
                    }`}
                  >
                    <i className={`${tab.icon} text-base`} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <span
                      className={`block text-xs font-bold leading-tight ${
                        isActive ? "text-white" : "text-slate-300"
                      }`}
                    >
                      {tab.label}
                    </span>
                    <span className="block text-[11px] text-slate-500 truncate mt-0.5">
                      {tab.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Kartu Konten Tab Aktif */}
          <section
            id={`tab-panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`desktop-tab-${activeTab}`}
            className="glass-surface rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div
                  key="tab-profile"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProfileTab />
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div
                  key="tab-security"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <SecurityTab />
                </motion.div>
              )}

              {activeTab === "privacy" && (
                <motion.div
                  key="tab-privacy"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <PrivacyTab />
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
