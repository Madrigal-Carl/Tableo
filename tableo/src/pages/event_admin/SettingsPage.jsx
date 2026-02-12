import SideNavigation from "../../components/SideNavigation";
import profilePic from "../../assets/Crown pic.svg";
import { Upload } from "lucide-react";

function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideNavigation />

      <div className="flex-1 ml-72 px-12 py-10">
        {/* Page Title */}
        <h1 className="text-5xl font-semibold text-[#FA824C] mb-8">
          Your Profile
        </h1>

        {/* Main Container FULL WIDTH */}
        <div className="bg-white rounded-2xl border border-gray-200 w-full p-12">

          {/* Section Header */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Personal Details
            </h2>
            <p className="text-sm text-gray-500">
              Update your profile details
            </p>
          </div>

          <hr className="my-8" />

          {/* Profile Photo */}
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <img
                src={profilePic}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-700">
                  Update your profile details
                </p>
                <p className="text-sm text-gray-400">
                  PNG, JPEG
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex items-center gap-2 bg-[#FA824C] text-white px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition">
                <Upload size={16} />
                Upload Photo
              </button>

              <button className="px-6 py-2 border border-[#FA824C] text-[#FA824C] rounded-full text-sm font-medium hover:bg-[#FA824C] hover:text-white transition">
                Upload Photo
              </button>
            </div>
          </div>

          <hr className="my-10" />

          {/* Name + Email FULL WIDTH */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            <div>
              <label className="text-sm text-gray-500">
                Profile Name
              </label>

              <div className="flex gap-4 mt-3">
                <input
                  type="text"
                  defaultValue="Mister Dunkin Donato"
                  className="flex-1 px-5 py-3 border border-gray-300 rounded-full outline-none focus:ring-2 focus:ring-[#FA824C]"
                />
                <button className="bg-[#FA824C] text-white px-6 rounded-full text-sm font-medium hover:opacity-90 transition">
                  Change
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-500">
                Email
              </label>

              <div className="flex gap-4 mt-3">
                <input
                  type="email"
                  defaultValue="dunkindonato@email.com"
                  className="flex-1 px-5 py-3 border border-gray-300 rounded-full outline-none focus:ring-2 focus:ring-[#FA824C]"
                />
                <button className="bg-[#FA824C] text-white px-6 rounded-full text-sm font-medium hover:opacity-90 transition">
                  Change
                </button>
              </div>
            </div>
          </div>

          <hr className="my-12" />

          {/* Password FULL WIDTH */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 items-end">
            <div>
              <label className="text-sm text-gray-500">
                Current Password
              </label>
              <input
                type="password"
                className="w-full mt-3 px-5 py-3 border border-gray-300 rounded-full outline-none focus:ring-2 focus:ring-[#FA824C]"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">
                New Password
              </label>
              <input
                type="password"
                className="w-full mt-3 px-5 py-3 border border-gray-300 rounded-full outline-none focus:ring-2 focus:ring-[#FA824C]"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">
                Confirm New Password
              </label>
              <input
                type="password"
                className="w-full mt-3 px-5 py-3 border border-gray-300 rounded-full outline-none focus:ring-2 focus:ring-[#FA824C]"
              />
            </div>

            <button className="bg-[#FA824C] text-center font-bold text-white px-8 py-3 rounded-3xl hover:bg-[#FF9768]">
              Confirm
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
