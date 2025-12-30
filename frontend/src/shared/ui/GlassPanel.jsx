import { motion } from "framer-motion";
import { hoverLift } from "../motion/animations";

export default function GlassPanel({ children, className = "", hoverEffect = false, ...props }) {
  return (
    <motion.div
      {...(hoverEffect ? hoverLift : {})}
      className={`rounded-xl border border-black/5 bg-white/70 backdrop-blur-glass shadow-glass ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
