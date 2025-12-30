import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import StatsGrid from "../../components/dashboard/StatsGrid";
import GlassPanel from "../../../shared/ui/GlassPanel";
import { Users, Building, UserPlus, Briefcase } from "lucide-react";

const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function AdminDashboard({ stats }) {
    const navigate = useNavigate();

    const actions = [
        {
            title: "Manage Departments",
            desc: "Create and manage organization departments.",
            icon: Building,
            color: "text-blue-600 bg-blue-50",
            path: "/app/admin/departments"
        },
        {
            title: "Manage HRs",
            desc: "Assign HR managers to departments.",
            icon: Users,
            color: "text-purple-600 bg-purple-50",
            path: "/app/admin/hrs"
        },
        {
            title: "Candidates",
            desc: "View all candidates across the organization.",
            icon: UserPlus,
            color: "text-green-600 bg-green-50",
            path: "/app/candidates"
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
                <h1 className="text-2xl font-bold text-slate-800">Admin Overview</h1>
                <p className="text-slate-500">System-wide performance and management.</p>
            </motion.div>

            <motion.div variants={item}>
                <StatsGrid stats={stats} role="admin" />
            </motion.div>

            <motion.div variants={item}>
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Management Console</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
