import Navigation from "./Navigation"

function LandingPage() {
  return (
    <>
      <Navigation />

        <section className="w-full min-h-screen flex relative bg-[#C8D8E4]">
        {/* LEFT SIDE */}
        <div className="w-1/2 bg-[#2B6777] text-white flex flex-col justify-center px-16 relative rounded-br-[40px] z-10">
            <div className="w-35 h-35 bg-white rounded-full mb-8"></div>

            <p className="text-sm leading-relaxed max-w-md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
            </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 flex flex-col justify-center items-center -mt-[40px] relative z-0">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            Enter Code Here
            </h1>

            <div className="flex items-center gap-4">
            <input
                type="text"
                placeholder="Enter Code"
                className="px-6 py-4 bg-white rounded-full border border-gray-300 focus:outline-none text-center h-12"
            />
            <button className="text-[#2B6777] font-semibold tracking-wide">
                JOIN EVENT
            </button>
            </div>
        </div>
        </section>
    </>
  )
}

export default LandingPage
