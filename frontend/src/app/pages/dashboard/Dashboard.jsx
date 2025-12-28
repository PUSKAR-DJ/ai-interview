import useDashboard from "../../../hooks/useDashboard";
import StatsGrid from "../../components/dashboard/StatsGrid";

export default function Dashboard() {
  const { data, loading } = useDashboard();

  if (loading) return <div>Loading...</div>;
  if (!data) return null;

  return (
    <StatsGrid stats={data} />
  );
}
