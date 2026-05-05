
import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useGetMeQuery } from "@/redux/api/authApi";

const AdminGuard = () => {
  const { data: user, isLoading } = useGetMeQuery(undefined);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#1F5E3B]" />
      </div>
    );
  }

  // Jodi user login na thake athoba role ADMIN na hoy, tobe home-e pathiye dibe
  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminGuard;