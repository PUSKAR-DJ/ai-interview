import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import StatsGrid from "../../components/dashboard/StatsGrid";
import GlassPanel from "../../../shared/ui/GlassPanel";
import { Users, PlayCircle, FileText } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";

const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function HRDashboard({ stats }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const deptName = user.departmentId?.name || "Your Department";

    const actions = [
        {
            title: "Manage Candidates",
            desc: "Add new candidates or invite them to interviews.",
            icon: Users,
            color: "text-blue-600 bg-blue-50",
            path: "/app/candidates"
        },
        {
            title: "Review Results",
            desc: "Check assessment scores and feedback.",
            icon: FileText,
            color: "text-purple-600 bg-purple-50",
            path: "/app/candidates?filter=completed"
        }
    ];

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            <motion.div variants={item}>
                <h1 className="text-2xl font-bold text-slate-800">{deptName} Dashboard</h1>
                <p className="text-slate-500">Overview of your recruitment pipeline.</p>
            </motion.div>

            <motion.div variants={item}>
                <StatsGrid stats={stats} role="hr" />
            </motion.div>

            <motion.div variants={item}>
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {actions.map((action, index) => (
                        <GlassPanel
                            key={index}
                            hoverEffect={true}
                            onClick={() => navigate(action.path)}
                            className="p-6 cursor-pointer flex flex-col gap-4"
                        >
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.color}`}>
                                <action.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">{action.title}</h3>
                                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                    {action.desc}
                                </p>
                            </div>
                        </GlassPanel>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
