import React, { useId } from "react";

export default function TextField({
  id,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  icon,
  error,
  autoComplete,
  name,
  required = false,
  disabled = false,
  rightElement = null,
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
        >
          {label}
          {required && <span className="text-pink-400 ml-1">*</span>}
        </label>
      )}

      <div className="relative group">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 group-focus-within:text-cyan-400 transition-colors">
            <i className={`${icon} text-lg`} aria-hidden="true" />
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`w-full rounded-xl bg-white/[0.04] text-sm text-white placeholder-slate-500 transition-all duration-200 py-3 ${
            icon ? "pl-10" : "pl-4"
          } ${rightElement ? "pr-11" : "pr-4"} border ${
            error
              ? "border-red-500/70 focus:border-red-400 focus:ring-2 focus:ring-red-500/25 shadow-[0_0_15px_rgba(239,68,68,0.12)]"
              : "border-white/10 hover:border-white/20 focus:border-cyan-400/70 focus:ring-2 focus:ring-violet-500/25 focus:shadow-[0_0_22px_rgba(34,211,238,0.2)]"
          } focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
        />

        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-xs text-red-400 flex items-center gap-1.5 font-medium"
        >
          <i className="ri-error-warning-line text-sm shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}