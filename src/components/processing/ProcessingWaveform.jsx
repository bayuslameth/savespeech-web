import React, { useRef, useEffect } from "react";
import WaveformCanvas from "../WaveformCanvas";

/**
 * Konfigurasi amplitude dan speed per status.
 * "failed" menggunakan canvas khusus (garis datar merah), bukan WaveformCanvas.
 */
const STAGE_CONFIG = {
  uploading:   { amplitude: 0.25, speed: 0.5 },
  transcribing:{ amplitude: 0.85, speed: 1.6 },
  analyzing:   { amplitude: 0.55, speed: 1.0 },
  done:        { amplitude: 0.15, speed: 0.4 },
  failed:      { amplitude: 0, speed: 0 },
};

/**
 * Canvas garis datar merah redup untuk status "failed".
 */
function FlatlineCanvas({ height = 120 }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animId = null;
    const dpr = window.devicePixelRatio || 1;
    const W = container.clientWidth || 400;
    const H = height;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Periksa prefers-reduced-motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReduced = mq.matches;
    const handleMQ = (e) => { prefersReduced = e.matches; };
    mq.addEventListener("change", handleMQ);

    let phase = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const centerY = H / 2;

      // Garis datar merah redup dengan sedikit noise
      ctx.save();
      ctx.strokeStyle = "rgba(239, 68, 68, 0.6)";
      ctx.lineWidth = 2;
      ctx.shadowColor = "rgba(239,68,68,0.3)";
      ctx.shadowBlur = 10;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 4) {
        // Noise kecil (bukan animasi penuh) agar terlihat "mati"
        const noise = prefersReduced ? 0 : Math.sin(x * 0.3 + phase) * 1.2;
        const y = centerY + noise;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      if (!prefersReduced) {
        phase += 0.04;
        animId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      if (animId) cancelAnimationFrame(animId);
      mq.removeEventListener("change", handleMQ);
    };
  }, [height]);

  return (
    <div ref={containerRef} className="w-full" style={{ height }} aria-hidden="true">
      <canvas ref={canvasRef} className="block w-full" />
    </div>
  );
}

/**
 * Overlay "scanner" garis vertikal bergradien yang menyapu kiri-kanan.
 * Hanya tampil saat status "analyzing".
 * Dihentikan bila prefers-reduced-motion aktif.
 */
function ScannerOverlay({ height = 120 }) {
  const divRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return; // Tidak ada animasi bila reduced motion

    const el = divRef.current;
    if (!el) return;

    const animate = () => {
      posRef.current = (posRef.current + 0.4) % 100;
      el.style.left = `${posRef.current}%`;
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
      style={{ height }}
    >
      <div
        ref={divRef}
        className="absolute top-0 bottom-0"
        style={{
          width: "2px",
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(34,211,238,0.9) 50%, transparent 100%)",
          boxShadow: "0 0 12px rgba(34,211,238,0.6)",
          left: "0%",
        }}
      />
    </div>
  );
}

/**
 * Waveform reaktif yang mengubah amplitude/speed berdasarkan tahap status.
 * Saat "failed" menampilkan garis datar merah; saat "analyzing" menampilkan scanner.
 */
export default function ProcessingWaveform({ status = "uploading", height = 120 }) {
  const cfg = STAGE_CONFIG[status] || STAGE_CONFIG.uploading;
  const isFailed = status === "failed";
  const isAnalyzing = status === "analyzing";

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border ${
        isFailed
          ? "border-red-400/20 bg-red-500/[0.04]"
          : "border-white/10 bg-black/20"
      }`}
      style={{ height }}
    >
      {isFailed ? (
        <FlatlineCanvas height={height} />
      ) : (
        <>
          <WaveformCanvas
            amplitude={cfg.amplitude}
            speed={cfg.speed}
            height={height}
          />
          {isAnalyzing && <ScannerOverlay height={height} />}
        </>
      )}
    </div>
  );
}
