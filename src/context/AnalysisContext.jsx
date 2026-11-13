/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useCallback, useContext, useEffect } from "react";

export const AnalysisContext = createContext(null);

export function useAnalysis() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) {
    throw new Error("useAnalysis harus digunakan di dalam AnalysisProvider");
  }
  return ctx;
}

/**
 * Menyimpan file audio, metadata, dan hasil analisis HANYA di memori (useState).
 * Tidak ada penyimpanan ke localStorage, sessionStorage, atau IndexedDB.
 *
 * onRegisterClear: callback yang didaftarkan ke Root.jsx agar AuthProvider
 * dapat memanggil clearAll saat logout.
 */
export function AnalysisProvider({ children, onRegisterClear }) {
  const [file, setFileState] = useState(null);
  const [meta, setMeta] = useState(null);     // { name, size, duration }
  const [result, setResultState] = useState(null); // kontrak data Phase 4

  const setFile = useCallback((newFile, newMeta) => {
    setFileState(newFile);
    setMeta(newMeta || null);
  }, []);

  const setResult = useCallback((newResult) => {
    setResultState(newResult);
  }, []);

  const clearResult = useCallback(() => {
    setResultState(null);
  }, []);

  // Membersihkan file sekaligus result
  const clearFile = useCallback(() => {
    setFileState(null);
    setMeta(null);
    setResultState(null);
  }, []);

  // Membersihkan segalanya (logout)
  const clearAll = useCallback(() => {
    setFileState(null);
    setMeta(null);
    setResultState(null);
  }, []);

  // Daftarkan clearAll ke Root.jsx agar bisa dipanggil saat logout
  useEffect(() => {
    if (typeof onRegisterClear === "function") {
      onRegisterClear(clearAll);
    }
  }, [clearAll, onRegisterClear]);

  const value = { file, meta, result, setFile, setResult, clearResult, clearFile };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
}
