import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Simpan lokasi tujuan agar setelah login berhasil pengguna dikembalikan ke halaman tersebut
    return <Navigate to="/masuk" state={{ from: location }} replace />;
  }

  return children;
}