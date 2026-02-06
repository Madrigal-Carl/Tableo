import logo from "../assets/logo.svg";

function Navigation() {

  return (
    <nav className="fixed top-2 left-0 w-full flex justify-between items-center p-2 bg-white z-50 px-12">
      {/* Logo */}
      <img src={logo} alt="Tableo Logo" className="w-70 p-2 ml-10"/>

      {/* RIGHT SIDE */}
        <div className="flex space-x-6 items-center pr-8">
          <button className="text-2xl font-medium text-gray-700 hover:text-gray-900">
            About
          </button>

          <a href="/auth"
            onClick={() => setStarted(true)}
            className="bg-[#FA824C] text-base text-white px-8 py-5 rounded-3xl hover:bg-[#FF9768] font-bold"
          >
            Get Started
          </a>
        </div>
    </nav>
  );
}

export default Navigation;
