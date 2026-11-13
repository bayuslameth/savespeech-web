import React, { useEffect, useRef } from "react";

const WAVE_LAYERS = [
  { freq: 0.012, speedMod: 1.1, ampMod: 1.0, opacity: 0.9, width: 2.5, phaseOffset: 0 },
  { freq: 0.018, speedMod: -0.8, ampMod: 0.7, opacity: 0.65, width: 2.0, phaseOffset: 2.1 },
  { freq: 0.008, speedMod: 0.6, ampMod: 0.55, opacity: 0.45, width: 1.5, phaseOffset: 4.2 },
  { freq: 0.024, speedMod: 1.4, ampMod: 0.35, opacity: 0.3, width: 1.2, phaseOffset: 1.1 },
];

export default function WaveformCanvas({
  amplitude = 0.5,
  speed = 1,
  height = 220,
  barMode = false,
  className = "",
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const currentAmpRef = useRef(amplitude);
  const targetAmpRef = useRef(amplitude);
  const phaseRef = useRef(0);

  // Perbarui target amplitudo saat prop berubah agar transisi halus dengan lerp
  useEffect(() => {
    targetAmpRef.current = Math.max(0.05, Math.min(1, amplitude));
  }, [amplitude]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId = null;
    let width = container.clientWidth || 800;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = mediaQuery.matches;

    const handleMotionChange = (e) => {
      prefersReducedMotion = e.matches;
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    // Penyesuaian resolusi layar Retina (DPI tinggi)
    const updateSize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth || 800;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
      if (prefersReducedMotion) {
        drawFrame(0);
      }
    });
    resizeObserver.observe(container);

    const createMainGradient = () => {
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0, "#22d3ee");
      grad.addColorStop(0.5, "#8b5cf6");
      grad.addColorStop(1, "#ec4899");
      return grad;
    };

    const drawFrame = (timeStep) => {
      ctx.clearRect(0, 0, width, height);

      // Interpolasi linear (lerp) untuk menghaluskan perubahan amplitudo
      currentAmpRef.current += (targetAmpRef.current - currentAmpRef.current) * 0.06;
      const activeAmp = currentAmpRef.current;
      const centerY = height / 2;
      const maxWaveHeight = height * 0.42;

      const mainGradient = createMainGradient();

      ctx.save();
      ctx.shadowColor = "rgba(139, 92, 246, 0.55)";
      ctx.shadowBlur = 18;

      if (barMode) {
        // Mode alternatif: batang equalizer
        const barWidth = 4;
        const gap = 6;
        const step = barWidth + gap;
        const barCount = Math.floor(width / step);

        ctx.fillStyle = mainGradient;

        for (let i = 0; i < barCount; i++) {
          const x = i * step;
          // Envelope agar ujung kiri dan kanan meruncing halus
          const normX = i / barCount;
          const envelope = Math.sin(normX * Math.PI);

          const wave1 = Math.sin(i * 0.18 + phaseRef.current * 1.3);
          const wave2 = Math.cos(i * 0.09 - phaseRef.current * 0.8);
          const combined = Math.abs((wave1 + wave2) * 0.5);

          const barHeight = Math.max(
            4,
            combined * maxWaveHeight * activeAmp * envelope * 1.6
          );

          ctx.globalAlpha = 0.85;
          ctx.beginPath();
          ctx.roundRect(x, centerY - barHeight / 2, barWidth, barHeight, 2);
          ctx.fill();
        }
      } else {
        // Mode utama: 4 lapisan gelombang sinus bertumpuk
        WAVE_LAYERS.forEach((layer) => {
          ctx.beginPath();
          ctx.strokeStyle = mainGradient;
          ctx.lineWidth = layer.width;
          ctx.globalAlpha = layer.opacity;

          for (let x = 0; x <= width; x += 3) {
            const normX = x / width;
            // Fungsi Hann window sederhana agar ujung kiri-kanan gelombang menyatu ke garis tengah
            const envelope = Math.pow(Math.sin(normX * Math.PI), 1.4);

            const primarySine = Math.sin(
              x * layer.freq + phaseRef.current * layer.speedMod + layer.phaseOffset
            );
            const secondaryHarmonic =
              Math.sin(x * layer.freq * 2.1 - phaseRef.current * 0.5) * 0.25;

            const yOffset =
              (primarySine + secondaryHarmonic) *
              maxWaveHeight *
              activeAmp *
              layer.ampMod *
              envelope;

            const y = centerY + yOffset;

            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        });
      }

      ctx.restore();

      // Garis tengah tipis sebagai referensi sumbu audio
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      ctx.restore();

      if (!prefersReducedMotion) {
        phaseRef.current += 0.028 * speed * timeStep;
      }
    };

    const renderLoop = () => {
      drawFrame(1);
      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(renderLoop);
      }
    };

    renderLoop();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      resizeObserver.disconnect();
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, [height, speed, barMode]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none ${className}`}
      style={{ height: `${height}px` }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}