import AdminDashboard from "@/components/global/dashboard/AdminDashboard";
import UserDashboard from "@/components/global/dashboard/UserDashboard";
import { useAuth } from "@/stores/authStore";

const Dashboard = () => {
  const user = useAuth((state) => state.user);
  return (
    <div className="mt-40 px-10">
      {user?.role === "admin" && <AdminDashboard />}
      {user?.role === "professor" ||
        (user?.role === "student" && <UserDashboard />)}
    </div>
  );
};

export default Dashboard;
