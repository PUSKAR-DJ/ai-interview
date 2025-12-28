import { useState, useEffect } from "react";
import { useAuth } from "./useAuth"; // Ensure this path is correct for your project
import { getAdminStats, getHRStats } from "../api/dashboard.api";

export default function useDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        let stats = null;

        if (user.role === "admin") {
          // Backend returns: { totalCandidates, totalHRs, totalDepts, completedInterviews }
          stats = await getAdminStats();
        } else if (user.role === "hr") {
          // Backend returns: { totalDeptCandidates, pendingInterviews, completedInterviews }
          stats = await getHRStats();
        }
        
        setData(stats);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchStats();
  }, [user]);

  return { data, loading, error };
}