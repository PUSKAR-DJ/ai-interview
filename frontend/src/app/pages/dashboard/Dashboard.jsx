import StatsGrid from "../../components/dashboard/StatsGrid";
import ActivityList from "../../components/dashboard/ActivityList";

export default function Dashboard() {
  return (
    <div className="space-y-10">
      <StatsGrid />
      <ActivityList />
    </div>
  );
}
