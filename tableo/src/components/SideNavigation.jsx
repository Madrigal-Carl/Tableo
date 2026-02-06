import { useState } from "react";
import logo from "../assets/logo.png";
import { Calendar, Archive, Settings, LogOut } from "lucide-react";

function SideNavigation() {
  const [active, setActive] = useState("Events");

    const navItem = (label, Icon) => {
    const isActive = active === label;

    return (
        <button
        onClick={() => setActive(label)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition
            ${
            isActive
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
      <img
        src={logo}
        alt="Tableo Logo"
        className="w-36 mb-10 self-center mt-10"
      />

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navItem("Events", Calendar)}
        {navItem("Archives", Archive)}
      </nav>

      {/* Divider */}
      <div className="border-t border-gray-300 my-6" />

      {/* Settings */}
      <div className="flex flex-col gap-2">
        {navItem("Settings", Settings)}
      </div> 

      {/* Bottom Action */}
      <div className="mt-auto">
        {navItem("Logout", LogOut)} 
      </div>
    </aside>
  );
}

export default SideNavigation;
