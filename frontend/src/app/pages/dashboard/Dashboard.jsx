import { motion } from "framer-motion";
import { pageTransition } from "../../../shared/motion/animations";
import StatsGrid from "../../components/dashboard/StatsGrid";
import ActivityList from "../../components/dashboard/ActivityList";

export default function Dashboard() {
  return (
    <motion.div {...pageTransition} className="space-y-10">
      <StatsGrid />
      <ActivityList />
    </motion.div>
  );
}
