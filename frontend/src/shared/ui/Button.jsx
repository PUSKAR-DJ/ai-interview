export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-accent/30";

  const variants = {
    primary: "bg-accent text-white hover:bg-accent/90",
    secondary:
      "bg-accentSoft text-accent hover:bg-accentSoft/70",
    ghost: "text-accent hover:bg-black/5",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
