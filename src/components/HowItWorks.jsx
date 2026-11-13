import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const STEPS = [
  {
    step: "01",
    title: "Unggah Audio",
    desc: "Pilih rekaman panggilan telepon (.wav, .mp3, atau .m4a) yang mencurigakan untuk diperiksa.",
    icon: "ri-upload-cloud-2-line",
  },
  {
    step: "02",
    title: "Transkripsi",
    desc: "Model Whisper mengubah percakapan suara Bahasa Indonesia menjadi teks berstempel waktu secara lokal.",
    icon: "ri-file-text-line",
  },
  {
    step: "03",
    title: "Analisis AI",
    desc: "Ekstraksi fitur TF-IDF dan model Machine Learning mendeteksi pola klaim otoritas palsu serta paksaan.",
    icon: "ri-cpu-line",
  },
  {
    step: "04",
    title: "Skor Risiko",
    desc: "Risk Engine menggabungkan probabilitas ML dan bobot indikator untuk menghitung skor 0–100.",
    icon: "ri-speed-up-line",
  },
  {
    step: "05",
    title: "Hasil & Penjelasan",
    desc: "Tampilkan level risiko, kategori penipuan, dan kutipan kalimat berbahaya secara transparan.",
    icon: "ri-file-shield-2-line",
  },
];

export default function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="cara-kerja" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
            Alur Sistem Defensive AI
          </span>
          <h2 className="mt-2 text-2xl sm:text-4xl font-bold text-white">
            Cara Kerja Deteksi Penipuan
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Lima tahapan terstruktur untuk mengubah rekaman suara menjadi analisis risiko keamanan yang mudah dipahami.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {STEPS.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.45,
                delay: shouldReduceMotion ? 0 : idx * 0.09,
              }}
              className="glass-surface rounded-2xl p-6 relative group hover:border-cyan-400/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                    <i className={`${item.icon} text-xl`} />
                  </div>
                  <span className="font-heading text-xs font-bold tracking-widest text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                     TAHAP {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Indikator panah penghubung pada layar besar */}
              {idx < STEPS.length - 1 && (
                <div className="hidden lg:flex items-center justify-end mt-4 text-slate-500 group-hover:text-cyan-400 transition-colors">
                  <i className="ri-arrow-right-line text-lg" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}