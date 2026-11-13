import React, { useState } from "react";
import { useAuth } from "../../context/useAuth";
import TextField from "../ui/TextField";
import Button from "../ui/Button";

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Tab Profil Pengguna (/pengaturan).
 * Mengizinkan pengguna mengubah nama tampilan akun.
 * Alamat email bersifat read-only sebagai pengenal identitas utama akun.
 */
export default function ProfileTab() {
  const { user, updateProfile } = useAuth();

  const [nama, setNama] = useState(user?.nama || "");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const cleanNama = nama.trim();
    if (!cleanNama) {
      setErrorMessage("Nama lengkap tidak boleh kosong");
      return;
    }

    setLoading(true);
    try {
      await updateProfile({ nama: cleanNama });
      setSuccessMessage("Profil Anda berhasil diperbarui");
      // Sembunyikan notifikasi sukses otomatis setelah 4 detik
      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    } catch (err) {
      setErrorMessage(err.message || "Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Tab */}
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <i className="ri-user-3-line text-cyan-400" aria-hidden="true" />
          <span>Informasi Profil Pengguna</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Kelola nama tampilan akun Anda. Perubahan nama akan otomatis disinkronkan ke seluruh aplikasi.
        </p>
      </div>

      {/* Preview Avatar Akun */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 text-white font-heading font-extrabold text-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.25)] shrink-0">
          {getInitials(nama || user?.nama)}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-white truncate">
            {nama || user?.nama || "Pengguna Savespeech"}
          </h3>
          <p className="text-xs text-slate-400 truncate mt-0.5 font-mono">
            {user?.email || "user@example.com"}
          </p>
          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-400/25">
            <i className="ri-shield-check-line" aria-hidden="true" />
            Akun Terverifikasi
          </span>
        </div>
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

      {/* Form Ubah Profil */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Field Alamat Email (Read-Only) */}
        <div>
          <TextField
            id="profile-email"
            label="Alamat Email"
            type="email"
            value={user?.email || ""}
            disabled
            icon="ri-mail-line"
            autoComplete="email"
          />
          <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
            <i className="ri-information-line text-slate-400" aria-hidden="true" />
            Alamat email digunakan sebagai pengenal utama akun dan tidak dapat diubah.
          </p>
        </div>

        {/* Field Nama Lengkap (Editable) */}
        <TextField
          id="profile-nama"
          label="Nama Lengkap"
          type="text"
          value={nama}
          onChange={(e) => {
            setNama(e.target.value);
            if (errorMessage) setErrorMessage(null);
          }}
          placeholder="Masukkan nama lengkap Anda"
          icon="ri-user-line"
          autoComplete="name"
          required
        />

        {/* Tombol Simpan Perubahan */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading || nama.trim() === (user?.nama || "")}
          >
            <i className="ri-save-line text-base" aria-hidden="true" />
            <span>Simpan Perubahan</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
