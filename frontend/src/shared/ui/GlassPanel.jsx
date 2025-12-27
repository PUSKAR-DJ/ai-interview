import { motion } from "framer-motion";
import { hoverLift } from "../motion/animations";

export default function GlassPanel({ children, className = "" }) {
  return (
    <motion.div
      {...hoverLift}
      className={`rounded-xl border border-black/5 bg-white/70 backdrop-blur-glass shadow-glass ${className}`}
    >
      {children}
    </motion.div>
  );
}
