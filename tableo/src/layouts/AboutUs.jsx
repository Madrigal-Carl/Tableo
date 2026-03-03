import React from "react";

function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* HERO SECTION */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#192BC2] to-[#354AFB] bg-clip-text text-transparent mb-6">
            About TABLEO
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            TABLEO is a modern tabulation system designed to simplify scoring,
            ranking, and results management for events, competitions, and
            pageants. We provide fast, accurate, and transparent scoring for
            organizers and judges.
          </p>
        </div>

        {/* MISSION & VISION */}
        <div className="grid md:grid-cols-2 gap-10 mb-24">
          <div className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition duration-300">
            <h2 className="text-2xl font-bold text-[#192BC2] mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              To deliver an efficient and user-friendly tabulation system that
              eliminates manual errors, speeds up computation, and enhances
              fairness in every event.
            </p>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition duration-300">
            <h2 className="text-2xl font-bold text-[#192BC2] mb-4">
              Our Vision
            </h2>
            <p className="text-gray-600 leading-relaxed">
              To become a trusted digital solution for event tabulation,
              empowering schools, organizations, and communities with reliable
              and transparent scoring technology.
            </p>
          </div>
        </div>

        {/* FEATURES */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">
            What TABLEO Offers
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Real-Time Scoring",
                desc: "Judges can input scores instantly with automatic live ranking updates.",
              },
              {
                title: "Accurate Ranking",
                desc: "Automatic average calculations ensure fairness and eliminate manual errors.",
              },
              {
                title: "Secure & Reliable",
                desc: "Built with modern web technologies to protect and safeguard event data.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300 text-center"
              >
                <h3 className="text-xl font-semibold mb-3 text-[#192BC2]">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* DEVELOPERS */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">
            Meet the Developers
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                name: "Your Name",
                role: "Full-Stack Developer",
                desc: "Handles system architecture, backend logic, and database design.",
              },
              {
                name: "Developer Name",
                role: "Frontend Developer",
                desc: "Designs responsive UI and ensures smooth user experience.",
              },
              {
                name: "Developer Name",
                role: "System Analyst",
                desc: "Analyzes requirements and ensures optimal system performance.",
              },
            ].map((dev, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition duration-300 text-center"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#192BC2] to-[#354AFB] flex items-center justify-center text-white text-xl font-bold">
                  {dev.name.charAt(0)}
                </div>

                <h3 className="text-xl font-semibold">{dev.name}</h3>
                <p className="text-[#192BC2] font-medium mb-3">
                  {dev.role}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {dev.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AboutUs;