import React, { useEffect, useRef } from "react";

/**
 * Merender waveform statis berbasis bar dari array peaks (nilai 0–1).
 * Jika peaks null, menampilkan bar dekoratif fallback.
 */
export default function WaveformBars({ peaks, height = 80, playProgress = 0 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = height;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const bars = 80;
    const barW = Math.max(2, (W / bars) * 0.6);
    const gap = W / bars;
    const centerY = H / 2;

    // Gradien utama cyan → violet → magenta
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, "#22d3ee");
    grad.addColorStop(0.5, "#8b5cf6");
    grad.addColorStop(1, "#ec4899");

    // Gradien "played" (bagian yang sudah diputar) — lebih cerah
    const playedGrad = ctx.createLinearGradient(0, 0, W, 0);
    playedGrad.addColorStop(0, "#67e8f9");
    playedGrad.addColorStop(0.5, "#a78bfa");
    playedGrad.addColorStop(1, "#f9a8d4");

    const playedX = W * playProgress;

    for (let i = 0; i < bars; i++) {
      const normI = i / (bars - 1);
      let amplitude;

      if (peaks && peaks.length > 0) {
        // Interpolasi dari array peaks ke jumlah bar yang dirender
        const peakIdx = Math.min(
          Math.floor(normI * (peaks.length - 1)),
          peaks.length - 1
        );
        amplitude = peaks[peakIdx];
      } else {
        // Fallback dekoratif: gelombang sinusoidal sederhana
        const envelope = Math.sin(normI * Math.PI);
        amplitude =
          (0.3 +
            Math.abs(Math.sin(i * 0.4)) * 0.4 +
            Math.abs(Math.sin(i * 0.15)) * 0.3) *
          envelope;
      }

      const minH = 3;
      const barH = Math.max(minH, amplitude * centerY * 0.95);
      const x = i * gap + (gap - barW) / 2;

      ctx.fillStyle = x < playedX ? playedGrad : grad;
      ctx.globalAlpha = x < playedX ? 1 : 0.7;

      // Gambar bar simetris (atas dan bawah dari garis tengah)
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, centerY - barH, barW, barH * 2, barW / 2);
      } else {
        ctx.rect(x, centerY - barH, barW, barH * 2);
      }
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }, [peaks, height, playProgress]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: `${height}px` }}
      aria-hidden="true"
    />
  );
}
