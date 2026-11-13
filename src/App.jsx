import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import Analyze from "./pages/Analyze";
import Processing from "./pages/Processing";
import Result from "./pages/Result";
import History from "./pages/History";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/admin/Dashboard";
import SystemLogs from "./pages/admin/SystemLogs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";

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
          {/* Route Phase 4: halaman pemrosesan */}
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
          {/* Route Phase 5: halaman hasil analisis */}
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
          {/* Route Phase 6: halaman riwayat analisis */}
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
          {/* Route Phase 7: halaman pengaturan akun & preferensi privasi */}
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
            {/* /admin → Dashboard Overview */}
            <Route index element={<AdminDashboard />} />
            {/* /admin/logs → System Logs */}
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
    </div>
  );
}
