import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const FEATURES = [
  {
    title: "Deteksi Indikator Social Engineering",
    desc: "Mengenali 9 pola manipulasi utama seperti klaim petugas bank/e-wallet, ancaman blokir akun, tekanan waktu, hingga permintaan kode OTP.",
    icon: "ri-radar-line",
    accent: "from-cyan-400 to-blue-500",
  },
  {
    title: "Skor Risiko 0–100",
    desc: "Perhitungan skor terukur dengan empat tingkat kewaspadaan (Low, Medium, High, Critical) beserta aturan pengaman otomatis (override) saat OTP/PIN diminta.",
    icon: "ri-dashboard-3-line",
    accent: "from-violet-400 to-purple-500",
  },
  {
    title: "Transkrip Berstempel Waktu",
    desc: "Setiap segmen percakapan dilengkapi penanda waktu [mm:ss] dan sorotan khusus pada kalimat yang mengandung sinyal ancaman.",
    icon: "ri-time-line",
    accent: "from-pink-400 to-rose-500",
  },
  {
    title: "Penjelasan Hasil",
    desc: "Keputusan AI tidak bersifat kotak hitam; setiap skor disertai ringkasan alasan dan bukti kutipan langsung dari percakapan.",
    icon: "ri-chat-check-line",
    accent: "from-cyan-400 to-violet-500",
  },
  {
    title: "Audio Dihapus Otomatis",
    desc: "Berkas suara disimpan sementara dengan nama acak (UUID) dan langsung dihapus permanen begitu proses analisis selesai.",
    icon: "ri-delete-bin-shield-line",
    accent: "from-emerald-400 to-teal-500",
  },
  {
    title: "Pemrosesan Lokal",
    desc: "Transkripsi Whisper dan inferensi Machine Learning berjalan di lingkungan terisolasi tanpa mengirim rekaman suara ke pihak ketiga.",
    icon: "ri-server-line",
    accent: "from-amber-400 to-orange-500",
  },
];

export default function Features() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="fitur" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">
            Kapabilitas Inti
          </span>
          <h2 className="mt-2 text-2xl sm:text-4xl font-bold text-white">
            Fitur Keamanan Berfokus Privasi
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Menggabungkan klasifikasi teks Machine Learning dan aturan deteksi deterministik untuk menekan risiko lolosnya panggilan penipuan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, idx) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.45,
                delay: shouldReduceMotion ? 0 : idx * 0.07,
              }}
              className="glass-surface rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-400/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] group"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:border-cyan-400/40 transition-colors">
                <i
                  className={`${feat.icon} text-2xl bg-gradient-to-r ${feat.accent} bg-clip-text text-transparent`}
                />
              </div>
              <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-cyan-300 transition-colors">
                {feat.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}