import React from "react";

const PRIVACY_POINTS = [
  {
    icon: "ri-database-2-line",
    title: "Data Minimization",
    desc: "Sistem hanya memproses fitur teks yang diperlukan untuk perhitungan risiko tanpa menyimpan identitas pribadi penelepon.",
  },
  {
    icon: "ri-file-shred-line",
    title: "Penghapusan Audio Otomatis",
    desc: "File rekaman suara langsung dihapus dari penyimpanan sementara segera setelah transkripsi dan analisis selesai.",
  },
  {
    icon: "ri-eye-off-line",
    title: "Tanpa Penyimpanan OTP / PIN",
    desc: "Deretan angka sensitif seperti kode OTP, PIN, atau nomor rekening disamarkan (masking) dan tidak pernah dicatat di dalam log.",
  },
];

export default function SecurityNote() {
  return (
    <section id="keamanan" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-surface rounded-3xl p-6 sm:p-10 lg:p-12 border border-cyan-400/20 shadow-[0_0_45px_rgba(34,211,238,0.08)]">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-3">
              <i className="ri-shield-keyhole-line" />
              <span>Security & Privacy by Design</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Privasi & Keamanan Pemrosesan Data
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-300">
              Rekaman percakapan telepon merupakan aset sensitif. SAVESPEECH menerapkan kontrol keamanan berlapis untuk memastikan data Anda tetap terlindungi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {PRIVACY_POINTS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-white/[0.03] border border-white/10 p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
                    <i className={`${item.icon} text-lg`} />
                  </div>
                  <h3 className="font-bold text-white text-base">{item.title}</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Kotak Disclaimer Wajib */}
          <div className="rounded-2xl bg-amber-500/10 border border-amber-400/30 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0 text-amber-300">
              <i className="ri-alert-line text-xl" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
                Peringatan & Disclaimer Keamanan
              </h4>
              <p className="text-sm text-amber-100/90 leading-relaxed font-medium">
                Hasil ini merupakan indikasi risiko berdasarkan pola komunikasi dan bukan keputusan final. Jangan pernah membagikan OTP, PIN, atau password kepada siapa pun.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}