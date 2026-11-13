import React from "react";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className = "",
}) {
  const isDisabled = disabled || loading;

  const baseStyles =
    "relative inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05060f] select-none";

  const variants = {
    primary:
      "text-white bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-95 shadow-[0_0_24px_rgba(139,92,246,0.35)] hover:shadow-[0_0_32px_rgba(34,211,238,0.55)] disabled:opacity-40 disabled:shadow-none",
    ghost:
      "text-slate-200 glass-surface hover:bg-white/10 hover:text-white border border-white/10 disabled:opacity-40",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${
        fullWidth ? "w-full" : ""
      } ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      {loading && (
        <i
          className="ri-loader-4-line animate-spin text-lg leading-none"
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </button>
  );
}