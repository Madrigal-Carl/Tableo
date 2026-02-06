import logo from "../assets/logo.svg";

function Navigation() {

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center p-4 bg-white z-50">
      {/* Logo */}
      <img src={logo} alt="Tableo Logo" className="w-60 p-2" />

      {/* RIGHT SIDE */}
        <div className="flex space-x-6 items-center">
          <button className="text-xl font-medium text-gray-700 hover:text-gray-900">
            About
          </button>

          <a href="/auth"
            onClick={() => setStarted(true)}
            className="bg-[#FA824C] text-base text-white px-6 py-3 rounded-3xl hover:bg-[#FF9768] font-bold"
          >
            Get Started
          </a>
        </div>
    </nav>
  );
}

export default Navigation;
