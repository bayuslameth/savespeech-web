import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import TextField from "../components/ui/TextField";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
  const [serviceError, setServiceError] = useState("");

  // Rute tujuan setelah login berhasil (default ke "/analisis")
  const redirectPath = location.state?.from?.pathname || "/analisis";

  const validateForm = () => {
    const errors = { email: "", password: "" };
    let isValid = true;

    if (!email.trim()) {
      errors.email = "Alamat email wajib diisi";
      isValid = false;
    } else if (!EMAIL_REGEX.test(email.trim())) {
      errors.email = "Format alamat email tidak valid";
      isValid = false;
    }

    if (!password) {
      errors.password = "Kata sandi wajib diisi";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServiceError("");

    if (!validateForm()) return;

    try {
      await login({ email, password });
      navigate(redirectPath, { replace: true });
    } catch {
      // Selalu tampilkan pesan generik sesuai prinsip keamanan autentikasi
      setServiceError("Email atau kata sandi salah");
    }
  };

  return (
    <AuthLayout
      title="Masuk ke Akun"
      subtitle="Akses dashboard analisis panggilan untuk memeriksa indikasi penipuan finansial."
    >
      {location.state?.from && !serviceError && (
        <div
          role="status"
          className="mb-5 rounded-xl bg-cyan-500/10 border border-cyan-400/30 p-3.5 text-xs text-cyan-200 flex items-center gap-2.5"
        >
          <i className="ri-information-line text-base text-cyan-400 shrink-0" />
          <span>Silakan masuk terlebih dahulu untuk membuka halaman Analisis.</span>
        </div>
      )}

      {serviceError && (
        <div
          role="alert"
          className="mb-5 rounded-xl glass-surface bg-red-500/10 border border-red-400/40 p-3.5 text-xs text-red-200 flex items-center gap-2.5"
        >
          <i className="ri-shield-cross-line text-base text-red-400 shrink-0" />
          <span>{serviceError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <TextField
          label="Alamat Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="nama@domain.com"
          icon="ri-mail-line"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: "" }));
          }}
          error={fieldErrors.email}
          required
        />

        <TextField
          label="Kata Sandi"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Masukkan kata sandi"
          icon="ri-lock-password-line"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (fieldErrors.password)
              setFieldErrors((p) => ({ ...p, password: "" }));
          }}
          error={fieldErrors.password}
          required
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label={
                showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
              }
            >
              <i
                className={showPassword ? "ri-eye-off-line text-lg" : "ri-eye-line text-lg"}
              />
            </button>
          }
        />

        <div className="pt-1">
          <Button type="submit" variant="primary" fullWidth loading={loading}>
            Masuk
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-5 border-t border-white/10 text-center text-sm text-slate-300">
        Belum punya akun?{" "}
        <Link
          to="/daftar"
          className="font-semibold text-cyan-400 hover:text-cyan-300 underline-offset-4 hover:underline"
        >
          Daftar
        </Link>
      </div>
    </AuthLayout>
  );
}