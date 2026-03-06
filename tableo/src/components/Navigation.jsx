import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";

function Navigation() {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-2 left-0 w-full flex justify-between items-center p-2 bg-white z-50 px-12">
      {/* Logo */}
      <img src={logo} alt="Tableo Logo" className="w-70 p-2 ml-10" />

      {/* RIGHT SIDE */}
      <div className="flex space-x-16 items-center pr-8">
        <button className="text-2xl font-medium text-gray-700 hover:text-gray-900"
        onClick={() => navigate("/about")}>
          About
        </button>

        <a href="/auth"
          onClick={() => setStarted(true)}
          className="bg-[#192BC2] text-base text-white px-8 py-5 rounded-3xl hover:bg-[#354AFB] font-bold"
        >
          Get Started
        </a>
      </div>
    </nav>
  );
}

export default Navigation;
