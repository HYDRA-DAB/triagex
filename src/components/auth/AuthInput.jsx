import { useState } from "react";

export default function AuthInput({
  id,
  label,
  type = "text",
  placeholder,
  icon,
  value,
  onChange,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-medium tracking-wide text-slate-400 uppercase"
        >
          {label}
        </label>
      )}

      <div
        className={`
          relative flex items-center gap-3
          rounded-xl border px-4 py-3
          bg-white/[0.04] backdrop-blur-md
          transition-all duration-300
          ${
            focused
              ? "border-violet-500/60 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
              : "border-white/[0.08] hover:border-white/[0.14]"
          }
        `}
      >
        {icon && (
          <span className="text-slate-500 shrink-0">{icon}</span>
        )}

        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete="off"
          className="
            w-full bg-transparent text-sm text-slate-200
            placeholder:text-slate-600 outline-none
          "
        />
      </div>
    </div>
  );
}
