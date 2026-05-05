import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { PlusCircle, Layers, LogOut, Menu, X, Loader2 } from "lucide-react";
import { useGetMeQuery, useLogoutMutation } from "@/redux/api/authApi";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // API Logout Mutation Hook
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();
  const { data: user } = useGetMeQuery(undefined);

  // --- Zara Vibe Dark Toast Configuration ---
  const zaraTheme = {
    background: "#121212",
    color: "#ffffff",
    confirmButtonColor: "#ffffff",
    cancelButtonColor: "transparent",
    customClass: {
      popup: "border border-white/10 rounded-none shadow-2xl font-serif",
      confirmButton:
        "text-black bg-white px-8 py-2 rounded-none uppercase tracking-widest text-[10px] font-bold border-none",
      cancelButton:
        "text-white border border-white/20 px-8 py-2 rounded-none uppercase tracking-widest text-[10px] font-bold ml-2",
      title: "text-lg italic tracking-tight",
    },
    buttonsStyling: false,
  };

  // --- Logout Handler with Zara Theme Toast ---
  const handleLogout = async () => {
    const result = await Swal.fire({
      ...zaraTheme,
      title: "Are you sure?",
      text: "You will be logged out of the admin panel!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout!",
    });

    if (result.isConfirmed) {
      try {
        await logoutApi(undefined).unwrap();
        localStorage.removeItem("token");

        Swal.fire({
          ...zaraTheme,
          title: "Logged Out!",
          text: "You have been logged out successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/", { replace: true });
      } catch (error: any) {
        console.error("Logout Error:", error);
        localStorage.removeItem("token");
        navigate("/");

        Swal.fire({
          ...zaraTheme,
          title: "Logged Out",
          text: "Session cleared.",
          icon: "info",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    }
  };

  const menuItems = [
    {
      icon: <PlusCircle size={20} />,
      label: "Add Product",
      path: `/adminpannel/add-product`,
    },
    {
      icon: <PlusCircle size={20} />,
      label: "All Product",
      path: `/adminpannel/all-product`,
    },
    {
      icon: <Layers size={20} />,
      label: "Add Categories",
      path: `/adminpannel/add-categories`,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-white font-serif">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-md transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Dark Aesthetic */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#121212] border-r border-white/5 p-6 transform transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Logo Area */}
        <div className="mb-12 px-4 flex justify-between items-center">
          <div>
            <Link to={"/"}>
              <h1 className="text-3xl font-black text-white tracking-tighter italic">
                Zayn
              </h1>
            </Link>
            <p className="text-[9px] text-white/40 font-bold uppercase tracking-[0.4em] mt-1">
              Admin Interface
            </p>
          </div>
          <button
            className="lg:hidden text-white/50 hover:text-white transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2 overflow-y-auto max-h-[calc(100vh-250px)] pr-2 custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-4 px-6 py-4 transition-all duration-300 border border-transparent ${
                  isActive
                    ? "bg-white text-black font-bold italic"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className={isActive ? "scale-110" : ""}>{item.icon}</span>
                <span className="text-xs uppercase tracking-widest">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Logout Area */}
        <div className="absolute bottom-10 left-6 right-6">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-3 px-6 py-4 w-full border border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/30 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <LogOut
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
            )}
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
              {isLoggingOut ? "Processing..." : "Sign Out"}
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header - Glassmorphism Dark */}
        <header className="h-24 bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 lg:px-12 sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <button
              className="lg:hidden p-2 text-white/50 hover:text-white transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="font-light text-white/80 text-sm uppercase tracking-[0.3em] hidden sm:block italic">
              Dashboard /{" "}
              <span className="text-white font-bold not-italic">
                Management
              </span>
            </h2>
          </div>

          {/* Profile Section */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-white tracking-widest uppercase">
                {user?.name}
              </p>
              <p className="text-[9px] text-white/30 font-bold uppercase tracking-tighter">
                Authorized Access
              </p>
            </div>
            <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-white italic font-black text-sm">
              {user?.name?.charAt(0) || "A"}
            </div>
          </div>
        </header>

        {/* Dynamic Outlet */}
        <main className="p-6 md:p-10 lg:p-12 animate-in fade-in duration-700">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
