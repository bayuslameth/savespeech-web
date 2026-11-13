import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import TextField from "../components/ui/TextField";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({});
  const [serviceError, setServiceError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Evaluasi aturan kata sandi secara real-time
  const passwordChecks = useMemo(() => {
    return [
      {
        id: "length",
        label: "Minimal 8 karakter",
        valid: password.length >= 8,
      },
      {
        id: "upper",
        label: "Mengandung huruf besar (A–Z)",
        valid: /[A-Z]/.test(password),
      },
      {
        id: "lower",
        label: "Mengandung huruf kecil (a–z)",
        valid: /[a-z]/.test(password),
      },
      {
        id: "number",
        label: "Mengandung angka (0–9)",
        valid: /[0-9]/.test(password),
      },
    ];
  }, [password]);

  const passedRulesCount = passwordChecks.filter((r) => r.valid).length;
  const isPasswordStrong = passedRulesCount === 4;

  const strengthMeta = useMemo(() => {
    if (!password) return { label: "Belum diisi", width: "0%" };
    if (passedRulesCount === 1) return { label: "Lemah", width: "25%" };
    if (passedRulesCount === 2) return { label: "Cukup", width: "50%" };
    if (passedRulesCount === 3) return { label: "Baik", width: "75%" };
    return { label: "Kuat", width: "100%" };
  }, [password, passedRulesCount]);

  // Validasi setiap field untuk pesan error inline
  const errors = useMemo(() => {
    return {
      nama:
        touched.nama && !nama.trim() ? "Nama lengkap wajib diisi" : "",
      email:
        touched.email && !email.trim()
          ? "Alamat email wajib diisi"
          : touched.email && !EMAIL_REGEX.test(email.trim())
          ? "Format alamat email tidak valid"
          : "",
      password:
        touched.password && !isPasswordStrong
          ? "Kata sandi belum memenuhi seluruh kriteria keamanan"
          : "",
      confirmPassword:
        touched.confirmPassword && !confirmPassword
          ? "Konfirmasi kata sandi wajib diisi"
          : touched.confirmPassword && confirmPassword !== password
          ? "Konfirmasi kata sandi tidak sama"
          : "",
    };
  }, [touched, nama, email, password, confirmPassword, isPasswordStrong]);

  const isFormValid =
    nama.trim().length > 0 &&
    EMAIL_REGEX.test(email.trim()) &&
    isPasswordStrong &&
    confirmPassword === password &&
    agreed;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServiceError("");
    setTouched({
      nama: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!isFormValid) return;

    try {
      await register({ nama, email, password });
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/analisis", { replace: true });
      }, 900);
    } catch (err) {
      // Tangkap detail pesan error dari backend FastAPI (mis. "Email sudah digunakan")
      setServiceError(err.message || "Terjadi kesalahan saat pendaftaran");
    }
  };

  return (
    <AuthLayout
      title="Buat Akun Baru"
      subtitle="Daftarkan akun untuk mulai menganalisis rekaman panggilan mencurigakan."
    >
      {serviceError && (
        <div
          role="alert"
          className="mb-5 rounded-xl glass-surface bg-red-500/10 border border-red-400/40 p-3.5 text-xs text-red-200 flex items-center gap-2.5"
        >
          <i className="ri-error-warning-line text-base text-red-400 shrink-0" />
          <span>{serviceError}</span>
        </div>
      )}

      {isSuccess && (
        <div
          role="status"
          className="mb-5 rounded-xl glass-surface bg-emerald-500/15 border border-emerald-400/40 p-3.5 text-xs text-emerald-200 flex items-center gap-2.5"
        >
          <i className="ri-checkbox-circle-line text-base text-emerald-400 shrink-0" />
          <span>
            Pendaftaran berhasil! Mengarahkan Anda ke ruang Analisis...
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <TextField
          label="Nama Lengkap"
          name="nama"
          type="text"
          autoComplete="name"
          placeholder="Nama lengkap Anda"
          icon="ri-user-line"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          onBlur={() => setTouched((p) => ({ ...p, nama: true }))}
          error={errors.nama}
          required
        />

        <TextField
          label="Alamat Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="nama@domain.com"
          icon="ri-mail-line"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((p) => ({ ...p, email: true }))}
          error={errors.email}
          required
        />

        <div>
          <TextField
            label="Kata Sandi"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Minimal 8 karakter kombinasi"
            icon="ri-lock-password-line"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, password: true }))}
            error={errors.password}
            required
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                aria-label={
                  showPassword
                    ? "Sembunyikan kata sandi"
                    : "Tampilkan kata sandi"
                }
              >
                <i
                  className={
                    showPassword ? "ri-eye-off-line text-lg" : "ri-eye-line text-lg"
                  }
                />
              </button>
            }
          />

          {/* Strength Meter Bergradien & Checklist Real-time */}
          <div className="mt-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400">Kekuatan Kata Sandi</span>
              <span
                className={`font-semibold ${
                  passedRulesCount === 4
                    ? "text-emerald-400"
                    : passedRulesCount >= 2
                    ? "text-cyan-300"
                    : "text-slate-400"
                }`}
              >
                {strengthMeta.label}
              </span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-3">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 transition-all duration-300"
                style={{ width: strengthMeta.width }}
              />
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
              {passwordChecks.map((rule) => (
                <li
                  key={rule.id}
                  className={`flex items-center gap-1.5 transition-colors ${
                    rule.valid ? "text-emerald-400 font-medium" : "text-slate-400"
                  }`}
                >
                  <i
                    className={
                      rule.valid
                        ? "ri-checkbox-circle-fill text-emerald-400 text-sm"
                        : "ri-checkbox-blank-circle-line text-slate-500 text-sm"
                    }
                    aria-hidden="true"
                  />
                  <span>{rule.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <TextField
          label="Konfirmasi Kata Sandi"
          name="confirmPassword"
          type={showConfirm ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Ulangi kata sandi"
          icon="ri-lock-check-line"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => setTouched((p) => ({ ...p, confirmPassword: true }))}
          error={errors.confirmPassword}
          required
          rightElement={
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label={
                showConfirm
                  ? "Sembunyikan konfirmasi kata sandi"
                  : "Tampilkan konfirmasi kata sandi"
              }
            >
              <i
                className={
                  showConfirm ? "ri-eye-off-line text-lg" : "ri-eye-line text-lg"
                }
              />
            </button>
          }
        />

        {/* Checkbox Persetujuan Wajib (SEC-12 pada PRD) */}
        <div className="pt-1">
          <label className="flex items-start gap-3 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-2 focus:ring-cyan-400 focus:ring-offset-0 cursor-pointer accent-cyan-400"
            />
            <span className="text-xs text-slate-300 leading-relaxed group-hover:text-slate-200">
              Saya menyetujui pemrosesan audio untuk analisis dan menyatakan berhak atas rekaman yang saya unggah.
            </span>
          </label>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading || isSuccess}
            disabled={!isFormValid}
          >
            Daftar
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-5 border-t border-white/10 text-center text-sm text-slate-300">
        Sudah memiliki akun?{" "}
        <Link
          to="/masuk"
          className="font-semibold text-cyan-400 hover:text-cyan-300 underline-offset-4 hover:underline"
        >
          Masuk
        </Link>
      </div>
    </AuthLayout>
  );
}
