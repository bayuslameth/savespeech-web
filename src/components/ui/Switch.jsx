import React, { useId } from "react";

/**
 * Komponen Switch toggle yang aksesibel dan dapat digunakan kembali (reusable).
 * Menggunakan button dengan role="switch" dan atribut ARIA yang lengkap.
 *
 * @param {boolean} checked - Status switch (aktif / tidak aktif)
 * @param {function} onChange - Callback ketika nilai switch berubah (checked: boolean)
 * @param {boolean} [disabled=false] - Menonaktifkan interaksi switch
 * @param {string} [id] - ID elemen switch
 * @param {string} [label] - Label teks di samping switch
 * @param {string} [description] - Deskripsi tambahan di bawah label
 * @param {string} [ariaLabel] - Label aksesibilitas untuk screen reader jika label visual tidak disediakan
 * @param {string} [className] - Kelas CSS tambahan untuk kontainer
 */
export default function Switch({
  checked = false,
  onChange,
  disabled = false,
  id,
  label,
  description,
  ariaLabel,
  className = "",
}) {
  const generatedId = useId();
  const switchId = id || generatedId;
  const descriptionId = description ? `${switchId}-desc` : undefined;

  const handleToggle = () => {
    if (disabled || typeof onChange !== "function") return;
    onChange(!checked);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className={`flex items-start justify-between gap-4 select-none ${className}`}>
      {/* Label dan Deskripsi (jika disediakan) */}
      {(label || description) && (
        <div className="flex-1 pr-2">
          {label && (
            <label
              htmlFor={switchId}
              onClick={handleToggle}
              className={`block text-sm font-semibold text-white ${
                disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {label}
            </label>
          )}
          {description && (
            <p
              id={descriptionId}
              className="text-xs text-slate-400 mt-1 leading-relaxed"
            >
              {description}
            </p>
          )}
        </div>
      )}

      {/* Elemen Switch Interaktif */}
      <button
        type="button"
        role="switch"
        id={switchId}
        aria-checked={checked}
        aria-describedby={descriptionId}
        aria-label={ariaLabel || (typeof label === "string" ? label : "Toggle switch")}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-250 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05060f] ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-white/5 border border-white/5"
            : "cursor-pointer"
        } ${
          checked
            ? "bg-gradient-to-r from-cyan-500 to-violet-600 shadow-[0_0_16px_rgba(34,211,238,0.35)] border border-cyan-400/30"
            : "bg-white/10 hover:bg-white/15 border border-white/10"
        }`}
      >
        {/* Thumb yang bergeser */}
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform duration-200 ease-out ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
