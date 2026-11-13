/**
 * Menghitung puncak amplitudo dari file audio menggunakan Web Audio API.
 * Digunakan untuk merender pratinjau waveform statis (bar chart peaks).
 *
 * CATATAN: AudioContext ditutup setelah decoding selesai untuk menghindari kebocoran sumber daya.
 * Jika codec tidak didukung browser (mis. AAC/M4A di beberapa browser) atau file terlalu besar,
 * fungsi mengembalikan null sehingga UI dapat menampilkan fallback dekoratif.
 *
 * @param {File} file - File audio yang akan dianalisis
 * @param {number} bars - Jumlah bar yang diinginkan (default 120)
 * @returns {Promise<number[] | null>} Array nilai 0–1 atau null jika gagal
 */
export async function computePeaks(file, bars = 120) {
  let audioCtx = null;
  try {
    // Baca seluruh file sebagai ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Buat AudioContext baru; gunakan try/catch karena beberapa browser
    // membatasi jumlah konteks yang dapat dibuka bersamaan
    audioCtx = new AudioContext();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    // Ambil channel 0 (mono / channel kiri) untuk perhitungan puncak
    const channelData = audioBuffer.getChannelData(0);
    const totalSamples = channelData.length;
    const samplesPerBar = Math.floor(totalSamples / bars);

    if (samplesPerBar === 0) return null;

    const peaks = [];
    for (let i = 0; i < bars; i++) {
      const start = i * samplesPerBar;
      const end = Math.min(start + samplesPerBar, totalSamples);
      let max = 0;
      // Cari nilai absolut maksimum dalam segmen ini
      for (let j = start; j < end; j++) {
        const abs = Math.abs(channelData[j]);
        if (abs > max) max = abs;
      }
      peaks.push(max);
    }

    // Normalisasi: bagi semua nilai dengan nilai puncak tertinggi
    // agar bar tertinggi selalu menyentuh 1.0
    const globalMax = Math.max(...peaks, 0.001);
    return peaks.map((v) => v / globalMax);
  } catch {
    // Decode gagal (codec tidak didukung, file rusak, dll.) → kembalikan null
    return null;
  } finally {
    // Tutup AudioContext untuk membebaskan sumber daya audio hardware
    if (audioCtx) {
      await audioCtx.close().catch(() => {});
    }
  }
}
