export default function AuthButton({
  children,
  onClick,
  variant = "primary",
  type = "button",
  id,
  className = "",
}) {
  const base = `
    relative w-full flex items-center justify-center gap-2.5
    rounded-xl px-6 py-3.5 text-sm font-semibold tracking-wide
    cursor-pointer transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-violet-600 to-indigo-600
      text-white
      shadow-[0_4px_24px_rgba(139,92,246,0.3)]
      hover:shadow-[0_4px_32px_rgba(139,92,246,0.45)]
      hover:from-violet-500 hover:to-indigo-500
      active:scale-[0.98]
    `,
    google: `
      bg-white/[0.06] backdrop-blur-md
      border border-white/[0.1]
      text-slate-300
      hover:bg-white/[0.1] hover:border-white/[0.18]
      active:scale-[0.98]
    `,
  };

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
