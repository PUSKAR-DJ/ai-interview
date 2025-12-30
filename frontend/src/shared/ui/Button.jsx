import { motion } from "framer-motion";

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-accent text-white hover:bg-accent/90",
    secondary:
      "bg-accentSoft text-accent hover:bg-accentSoft/70",
    ghost: "text-accent hover:bg-black/5",
    outline: "border border-slate-200 text-slate-700 hover:bg-slate-50",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
