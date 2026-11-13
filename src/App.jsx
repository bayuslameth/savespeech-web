import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import { useAuth } from "./context/AuthContext";

// ─── Route-level Code Splitting (Lazy Loading) ──────────────────────────────
// Memecah bundle utama menjadi chunk terpisah agar muatan awal aplikasi ringan
const Home = lazy(() => import("./pages/Home"));
const Analyze = lazy(() => import("./pages/Analyze"));
const Processing = lazy(() => import("./pages/Processing"));
const Result = lazy(() => import("./pages/Result"));
const History = lazy(() => import("./pages/History"));
const Settings = lazy(() => import("./pages/Settings"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const SystemLogs = lazy(() => import("./pages/admin/SystemLogs"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const NotFound = lazy(() => import("./pages/NotFound"));

/**
 * Komponen PageLoader - Indikator pemuatan halaman saat chunk diunduh (Suspense fallback).
 * Didesain minimalis dan halus untuk mencegah efek kedip (flicker) antarmuka.
 */
function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Memuat halaman..."
      className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 bg-[#05060f]"
    >
      <div className="relative flex items-center justify-center">
        {/* Lingkaran luar berdenyut */}
        <div className="w-12 h-12 rounded-full border border-cyan-400/20 animate-ping absolute" />
        {/* Spinner berputar bergradien */}
        <div className="w-10 h-10 rounded-full border-2 border-transparent border-t-cyan-400 border-r-violet-500 animate-spin" />
      </div>
      <span className="mt-4 text-xs font-medium text-slate-400 tracking-wider">
        Memuat...
      </span>
    </div>
  );
}

// Menggulir otomatis ke atas setiap kali berpindah rute halaman (kecuali navigasi hash di beranda)
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname, hash]);

  return null;
}

// Mencegah pengguna yang sudah login membuka kembali halaman Masuk atau Daftar
function GuestOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/analisis" replace />;
  }
  return children;
}

function PageTransition({ children }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  // Deteksi apakah berada di area admin — jika iya, Navbar publik disembunyikan
  const isAdminArea = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-[#05060f] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <ScrollToTop />
      {/* Navbar publik disembunyikan di area admin karena AdminLayout punya top-bar sendiri */}
      {!isAdminArea && <Navbar />}

      {/* Seluruh rute dilindungi oleh ErrorBoundary untuk mencegah White Screen of Death (NFR-03) */}
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* ── Rute Publik ───────────────────────────────────── */}
              <Route
                path="/"
                element={
                  <PageTransition>
                    <Home />
                  </PageTransition>
                }
              />
              <Route
                path="/masuk"
                element={
                  <GuestOnlyRoute>
                    <PageTransition>
                      <Login />
                    </PageTransition>
                  </GuestOnlyRoute>
                }
              />
              <Route
                path="/daftar"
                element={
                  <GuestOnlyRoute>
                    <PageTransition>
                      <Register />
                    </PageTransition>
                  </GuestOnlyRoute>
                }
              />

              {/* ── Rute Terproteksi (semua pengguna login) ────────── */}
              <Route
                path="/analisis"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <Analyze />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/proses"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <Processing />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hasil"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <Result />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/riwayat"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <History />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pengaturan"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <Settings />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />

              {/* ── Rute Admin (Phase 8) — RBAC: hanya role 'admin' ─ */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="logs" element={<SystemLogs />} />
              </Route>

              {/* ── Fallback 404 ───────────────────────────────────── */}
              <Route
                path="*"
                element={
                  <PageTransition>
                    <NotFound />
                  </PageTransition>
                }
              />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
