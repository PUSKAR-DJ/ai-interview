import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAdminStats, getHRStats } from "../api/dashboard.api";

export default function useDashboard() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        let stats = null;

        if (user.role === "admin") {
          stats = await getAdminStats();
        } else if (user.role === "hr") {
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

    fetchStats();
  }, [user]);

  return { data, loading, error };
}