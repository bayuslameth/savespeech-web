import React, { useState, useMemo } from "react";
import { useAuth } from "../../context/useAuth";
import TextField from "../ui/TextField";
import Button from "../ui/Button";

/**
 * Tab Keamanan & Kata Sandi (/pengaturan).
 * Mengizinkan pengguna mengubah kata sandi akun dengan validasi ketat di sisi klien.
 */
export default function SecurityTab() {
  const { updatePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [touched, setTouched] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Validasi kriteria kata sandi baru
  const passwordChecks = useMemo(() => {
    return [
      {
        id: "len",
        label: "Minimal 8 karakter",
        valid: newPassword.length >= 8,
      },
      {
        id: "upper",
        label: "Mengandung huruf besar (A–Z)",
        valid: /[A-Z]/.test(newPassword),
      },
      {
        id: "lower",
        label: "Mengandung huruf kecil (a–z)",
        valid: /[a-z]/.test(newPassword),
      },
      {
        id: "num",
        label: "Mengandung angka (0–9)",
        valid: /[0-9]/.test(newPassword),
      },
    ];
  }, [newPassword]);

  const isNewPasswordStrong = passwordChecks.every((check) => check.valid);
  const isConfirmMatching = newPassword && confirmPassword === newPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    setTouched({ current: true, new: true, confirm: true });

    if (!currentPassword) {
      setErrorMessage("Kata sandi saat ini wajib diisi");
      return;
    }

    if (!isNewPasswordStrong) {
      setErrorMessage("Kata sandi baru belum memenuhi semua syarat keamanan");
      return;
    }

    if (!isConfirmMatching) {
      setErrorMessage("Konfirmasi kata sandi baru tidak cocok");
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMessage("Kata sandi baru harus berbeda dari kata sandi saat ini");
      return;
    }

    setLoading(true);
    try {
      await updatePassword({ currentPassword, newPassword });
      setSuccessMessage("Kata sandi akun Anda berhasil diperbarui");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTouched({ current: false, new: false, confirm: false });

      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      setErrorMessage(err.message || "Gagal memperbarui kata sandi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Tab */}
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <i className="ri-lock-password-line text-cyan-400" aria-hidden="true" />
          <span>Keamanan & Kata Sandi</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Perbarui kata sandi akun secara berkala untuk menjaga keamanan akses dan perlindungan akun.
        </p>
      </div>

      {/* Banner Pesan Sukses */}
      {successMessage && (
        <div
          role="status"
          className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold animate-fade-in"
        >
          <i className="ri-checkbox-circle-fill text-emerald-400 text-base shrink-0" aria-hidden="true" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Banner Pesan Error */}
      {errorMessage && (
        <div
          role="alert"
          className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/15 border border-red-400/30 text-red-300 text-xs font-semibold"
        >
          <i className="ri-error-warning-fill text-red-400 text-base shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Ubah Kata Sandi */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Kata Sandi Saat Ini */}
        <div>
          <TextField
            id="current-password"
            label="Kata Sandi Saat Ini"
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            onBlur={() => setTouched((p) => ({ ...p, current: true }))}
            placeholder="Masukkan kata sandi saat ini"
            icon="ri-key-line"
            autoComplete="current-password"
            required
            error={
              touched.current && !currentPassword
                ? "Kata sandi saat ini wajib diisi"
                : ""
            }
            rightElement={
              <button
                type="button"
                onClick={() => setShowCurrent((p) => !p)}
                aria-label={showCurrent ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
              >
                <i className={showCurrent ? "ri-eye-off-line text-lg" : "ri-eye-line text-lg"} aria-hidden="true" />
              </button>
            }
          />
        </div>

        {/* Kata Sandi Baru */}
        <div>
          <TextField
            id="new-password"
            label="Kata Sandi Baru"
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            onBlur={() => setTouched((p) => ({ ...p, new: true }))}
            placeholder="Kombinasi minimal 8 karakter"
            icon="ri-lock-line"
            autoComplete="new-password"
            required
            error={
              touched.new && newPassword && !isNewPasswordStrong
                ? "Kata sandi baru belum memenuhi kriteria keamanan di bawah"
                : ""
            }
            rightElement={
              <button
                type="button"
                onClick={() => setShowNew((p) => !p)}
                aria-label={showNew ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
              >
                <i className={showNew ? "ri-eye-off-line text-lg" : "ri-eye-line text-lg"} aria-hidden="true" />
              </button>
            }
          />

          {/* Checklist Syarat Keamanan Kata Sandi */}
          <div className="mt-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Syarat Keamanan Kata Sandi:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {passwordChecks.map((check) => (
                <div
                  key={check.id}
                  className={`flex items-center gap-1.5 text-xs transition-colors ${
                    check.valid ? "text-emerald-400" : "text-slate-500"
                  }`}
                >
                  <i
                    className={
                      check.valid
                        ? "ri-checkbox-circle-fill text-emerald-400 text-sm"
                        : "ri-checkbox-blank-circle-line text-slate-600 text-sm"
                    }
                    aria-hidden="true"
                  />
                  <span>{check.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Konfirmasi Kata Sandi Baru */}
        <div>
          <TextField
            id="confirm-password"
            label="Konfirmasi Kata Sandi Baru"
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            onBlur={() => setTouched((p) => ({ ...p, confirm: true }))}
            placeholder="Ketik ulang kata sandi baru"
            icon="ri-shield-check-line"
            autoComplete="new-password"
            required
            error={
              touched.confirm && confirmPassword && !isConfirmMatching
                ? "Konfirmasi kata sandi tidak cocok dengan kata sandi baru"
                : ""
            }
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                aria-label={showConfirm ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
              >
                <i className={showConfirm ? "ri-eye-off-line text-lg" : "ri-eye-line text-lg"} aria-hidden="true" />
              </button>
            }
          />
        </div>

        {/* Tombol Simpan Kata Sandi */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={
              loading ||
              !currentPassword ||
              !isNewPasswordStrong ||
              !isConfirmMatching
            }
          >
            <i className="ri-shield-keyhole-line text-base" aria-hidden="true" />
            <span>Perbarui Kata Sandi</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
