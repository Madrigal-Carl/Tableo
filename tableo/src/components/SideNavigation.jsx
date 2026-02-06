import { useState } from "react";
import logo from "../assets/logo.svg";
import { Calendar, Archive, Settings, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function SideNavigation() {
  const [active, setActive] = useState("Events");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItem = (label, Icon, action) => {
    const isActive = active === label;

    return (
      <button
        onClick={() => {
          setActive(label);
          if (action) action();
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition
            ${isActive
            ? "bg-[#FA824C] text-white hover:bg-[#FF9768]"
            : "text-gray-700 hover:bg-[#FA824C] hover:text-white"
          }`}
      >
        <Icon size={20} />
        <span>{label}</span>
      </button>
    );
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-72 bg-white shadow-xl z-50 flex flex-col p-6">

      {/* Logo */}
      <img src={logo} alt="Tableo Logo" className="w-32 mb-10 self-center" />

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navItem("Events", Calendar, () => navigate("/home"))}
        {navItem("Archives", Archive, () => navigate("/archives"))}
      </nav>

      {/* Divider */}
      <div className="border-t border-gray-300 my-6" />

      {/* Settings */}
      <div className="flex flex-col gap-2">
        {navItem("Settings", Settings, () => navigate("/settings"))}
      </div>

      {/* Bottom Action */}
      <div className="mt-auto">
        {navItem("Logout", LogOut, async () => {
          await logout();        // call API + clear context
          navigate("/auth");     // redirect to login
        })}
      </div>
    </aside>
  );
}

export default SideNavigation;
