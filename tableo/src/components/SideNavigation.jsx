import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { Calendar, Archive, Settings, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

function SideNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItem = (label, Icon, paths, action) => {
    const normalizedPaths = Array.isArray(paths)
      ? paths
      : paths
        ? [paths]
        : [];

    const isActive = normalizedPaths.some(
      (p) =>
        location.pathname === p ||
        location.pathname.startsWith(p + "/")
    );

    return (
      <button
        onClick={() => {
          if (action) action();
          if (normalizedPaths[0]) navigate(normalizedPaths[0]);
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition
        ${isActive
            ? "bg-[#FA824C] text-white hover:bg-[#eb6e34]"
            : "text-gray-700 hover:bg-[#FA824C] hover:text-white"
          }`}
      >
        <Icon size={20} />
        <span>{label}</span>
      </button>
    );
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Log out?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FA824C",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    await logout();

    Swal.fire({
      icon: "success",
      title: "Logged out",
      timer: 1200,
      showConfirmButton: false,
    });

    navigate("/auth");
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-72 bg-white shadow-xl z-50 flex flex-col p-6">
      {/* Logo */}
      <img
        src={logo}
        alt="Tableo Logo"
        className="w-50 mt-10 mb-10 self-center"
      />

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navItem("Events", Calendar, ["/events", "/event"])}
        {navItem("Archives", Archive, ["/archive"])}
      </nav>

      {/* Divider */}
      <div className="border-t border-gray-300 my-6" />

      {/* Settings */}
      <div className="flex flex-col gap-2">
        {navItem("Profile Settings", Settings, "/settings")}
      </div>

      {/* Bottom Action */}
      <div className="mt-auto">
        {navItem("Logout", LogOut, null, handleLogout)}
      </div>
    </aside>
  );
}

export default SideNavigation;
