import DefaultPage from '@/components/layout/default-layout';

import React from "react";

const TripMateMain: React.FC = () => {
  return (
    <DefaultPage>
        <main className="w-full min-h-screen bg-gray-50 flex flex-col items-center overflow-hidden">
        {/* Hero Section */}
        <section className="w-full max-w-7xl flex flex-col items-center px-6 md:px-12 lg:px-16 py-10">
          <div className="relative w-full h-[60vh] rounded-[2rem] bg-gradient-to-br from-blue-500 to-indigo-600 overflow-hidden flex flex-col justify-center text-left px-10 md:px-20">
            <h1 className="text-custom-white text-4xl md:text-6xl font-extrabold font-['Manrope'] drop-shadow-md">
              Plan your trip
            </h1>
            <p className="mt-3 text-custom-white text-lg md:text-2xl font-bold font-['Manrope'] drop-shadow-sm">
              Plan your dream trip and find all the best services
            </p>

            {/* CTA Buttons */}
            <div className="mt-6 flex gap-4">
              <button className="px-6 py-2 bg-custom-white rounded-full shadow-md flex items-center gap-2 hover:scale-105 hover:shadow-lg transition-all duration-300">
                <span className="text-custom-black text-lg font-semibold">
                  Show Trips
                </span>
                <div className="w-4 h-3 bg-custom-black rounded-sm" />
              </button>

              <button className="w-10 h-10 bg-custom-white rounded-full shadow-md flex justify-center items-center hover:rotate-90 transition-transform duration-300">
                <div className="w-4 h-4 bg-custom-black rounded-sm" />
              </button>
            </div>

            {/* Search Box */}
            <div className="absolute bottom-[-3rem] left-1/2 -translate-x-1/2 w-[90%] max-w-5xl bg-zinc-100/60 rounded-2xl shadow-lg backdrop-blur-lg p-6">
              {/* Category Selector */}
              <div className="flex justify-center gap-5 mb-5 flex-wrap">
                {[
                  { label: "Hotel", active: true },
                  { label: "Restaurant" },
                  { label: "Rental Car" },
                  { label: "Guide" },
                  { label: "Attraction" },
                ].map(({ label, active }) => (
                  <button
                    key={label}
                    className={`px-4 py-1.5 rounded-xl font-semibold font-['Manrope'] text-lg transition-colors duration-300 ${
                      active
                        ? "bg-pale-blue text-dark-blue"
                        : "text-gray hover:text-dark-blue hover:bg-pale-blue/50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Search Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {[1, 2, 3].map((i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Input ${i}`}
                    className="w-full px-4 py-3 rounded-xl bg-custom-white shadow-md text-gray-700 font-['Manrope'] focus:outline-none focus:ring-2 focus:ring-dark-blue transition-all"
                  />
                ))}
                <button className="w-full md:w-auto px-6 py-3 bg-dark-blue text-custom-white font-bold rounded-2xl hover:bg-blue-900 transition-colors duration-300 shadow-md">
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="w-full max-w-7xl mt-24 px-6 md:px-12 lg:px-16 flex flex-col gap-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-2xl md:text-3xl font-extrabold text-custom-black font-['Manrope']">
              Popular Destinations
            </h2>
            <div className="flex gap-2">
              <button className="w-8 h-8 flex justify-center items-center rounded-full border border-gray hover:bg-gray-100 transition">
                <div className="w-2 h-3 bg-gray rotate-180" />
              </button>
              <button className="w-8 h-8 flex justify-center items-center rounded-full border border-gray hover:bg-gray-100 transition">
                <div className="w-2 h-3 bg-gray" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="group cursor-pointer transition-all hover:scale-105"
              >
                <img
                  src="https://placehold.co/300x200"
                  alt={`Destination ${i}`}
                  className="w-full h-40 md:h-48 object-cover rounded-xl shadow-md"
                />
                <div className="mt-2 text-center text-custom-black text-base md:text-lg font-bold font-['Manrope'] group-hover:text-dark-blue transition-colors">
                  Location
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </DefaultPage>
  );
};

export default TripMateMain;
