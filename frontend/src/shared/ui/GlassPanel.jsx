import { motion } from "framer-motion";
import { hoverLift } from "../motion/animations";

export default function GlassPanel({ children, className = "", hoverEffect = false, ...props }) {
  return (
    <motion.div
      {...(hoverEffect ? hoverLift : {})}
      className={`rounded-xl border border-white/20 bg-white/70 backdrop-blur-glass shadow-glass overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
