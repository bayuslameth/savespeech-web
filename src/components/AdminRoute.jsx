import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

/**
 * Komponen pelindung rute khusus administrator (RBAC Phase 8).
 *
 * Logika akses:
 * - Belum login → arahkan ke /masuk (dengan state `from` untuk redirect balik)
 * - Sudah login tapi role bukan 'admin' → arahkan ke / (halaman publik)
 * - Login dan role 'admin' → render children
 */
export default function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/masuk" state={{ from: location }} replace />;
  }

  if (user?.role !== "admin") {
    // Pengguna sudah login tapi bukan admin → redirect ke beranda
    return <Navigate to="/" replace />;
  }

  return children;
}
