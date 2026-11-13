import React, { useRef, useCallback } from "react";
import { AuthProvider } from "./AuthContext";
import { AnalysisProvider } from "./AnalysisContext";
import App from "../App";

/**
 * Root provider wrapper yang menghubungkan AuthProvider dan AnalysisProvider.
 * Ref digunakan sebagai jembatan agar clearFile dari AnalysisProvider
 * dapat dipanggil oleh AuthProvider saat logout — tanpa re-render berlebihan.
 */
export default function Root() {
  const clearFileRef = useRef(null);

  const registerClearFile = useCallback((fn) => {
    clearFileRef.current = fn;
  }, []);

  const handleLogout = useCallback(() => {
    if (typeof clearFileRef.current === "function") {
      clearFileRef.current();
    }
  }, []);

  return (
    <AuthProvider onLogoutCallback={handleLogout}>
      <AnalysisProvider onRegisterClear={registerClearFile}>
        <App />
      </AnalysisProvider>
    </AuthProvider>
  );
}
