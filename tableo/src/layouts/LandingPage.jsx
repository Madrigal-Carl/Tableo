import Navigation from "../components/Navigation"

function LandingPage() {
  return (
    <>
      <Navigation />

        <section className="w-full min-h-screen flex relative bg-white">
        {/* LEFT SIDE */}
        <div className="w-1/2 bg-[#7D8CC4] text-white flex flex-col justify-center px-16 relative rounded-br-[40px] z-10">
          <div className="flex justify-center">
            <div className="w-32 h-32 bg-white rounded-full mb-8"></div>
          </div>

          <p className="text-sm leading-relaxed max-w-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
            ex ea commodo consequat.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 flex flex-col justify-center items-center -mt-[40px] relative z-0">
            <h1 className="text-5xl font-bold text-gray-800 mb-4 text-center mt-20">
            Enter Code Here
            </h1>

            <div className="flex items-center gap-4">
            <input
                type="text"
                placeholder="Enter Code"
                className="px-6 py-4 bg-white rounded-full border border-gray-300 focus:outline-none text-center h-12"
            />
            <button className="text-[#FA824C] font-semibold tracking-wide">
                JOIN EVENT
            </button>
            </div>
        </div>
        </section>
    </>
  )
}

export default LandingPage
