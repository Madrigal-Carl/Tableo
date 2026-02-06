import Crown from "../assets/Crown pic.svg";

function FirstPartLanding() {
  return (
    <section className="w-full  min-h-screen flex items-center justify-center px-12">

      {/* FULL PAGE CARD */}
      <div className="relative w-[96%] h-[86vh] mt-14 bg-white rounded-2xl overflow-hidden">

        {/* TEAL CUT SHAPE (PART OF THE CARD) */}
        <div className="absolute inset-y-0 right-0 w-[60%] bg-[#2F6B75] card-cut" />

        {/* CONTENT WRAPPER */}
        <div className="relative z-10 flex h-full">

          {/* LEFT CONTENT */}
          <div className="w-[55%] flex items-center ml-5">
            <div className="max-w-xl ml-2">
              <p className="tracking-widest text-gray-500 mb-4">
                TABLEO EVENT TABULATION SYSTEM
              </p>

              <h1 className="flex flex-col text-9xl font-medium text-gray-900 mb-5">
                <p>Fast.</p>
                <p>Fair.</p>
                <p>Flawless.</p>
              </h1>

              <p className="text-gray-500 text-lg leading-relaxed">
                Streamline scoring and automate results for pageants and
                competitive events. Experience faster, more accurate, and
                transparent judging—designed to deliver a seamless and
                professional event.
              </p>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="w-[45%] flex flex-col items-center justify-center text-white px-18 py-4">
            <img src={Crown} alt="Crown" className="w-[650px] -mt-10" />

            <p className="text-5xl font-semibold mt-6">
              Enter Code Here
            </p>

            <div className="flex items-center border border-white rounded-4xl  overflow-hidden mt-4">
              <input
                type="text"
                placeholder="Enter Code"
                className="px-8 py-4 text-base text-gray-700 focus:outline-none rounded-4xl bg-white text-center"
              />
              <button className="px-8 py-4 text-sm font-semibold hover:cursor-pointer ">
                JOIN EVENT
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default FirstPartLanding;
