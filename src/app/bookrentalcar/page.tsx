import React from "react";
import Navbar from '@/components/navbar/nav'
import SideNav from '@/components/navbar/sidenav'

type PolicyItem =
  | {
      type: "pickup";
      title: string;
      rows: { label: string; value: string }[];
    }
  | {
      type: "bullet";
      title: string;
      text: string;
    };

const sidebarTop = [
  {
    label: "Hotels",
    icon: (
      <div className="w-5 h-5 relative overflow-hidden">
        <div className="w-5 h-3 left-[0.83px] top-[4.17px] absolute bg-custom-black" />
      </div>
    ),
  },
  {
    label: "Restaurants",
    icon: (
      <div className="w-5 h-5 relative overflow-hidden">
        <div className="w-5 h-5 left-[0.63px] top-[1.04px] absolute bg-custom-black" />
      </div>
    ),
  },
  {
    label: "Rental Cars",
    icon: (
      <div className="w-5 h-5 relative overflow-hidden">
        <div className="w-4 h-3 left-[1.67px] top-[4.17px] absolute bg-custom-black" />
      </div>
    ),
  },
  {
    label: "Guides",
    icon: (
      <div className="w-5 h-5 relative overflow-hidden">
        <div className="w-4 h-4 left-[2.47px] top-[2.91px] absolute bg-custom-black" />
      </div>
    ),
  },
  {
    label: "Tourist Attractions",
    icon: (
      <div className="w-5 h-5 relative overflow-hidden">
        <div className="w-4 h-5 left-[2px] top-0 absolute bg-custom-black" />
      </div>
    ),
  },
];

const tabs = ["Overview", "Additional", "Reviews", "Location", "Policy"];
const searchBoxes = [0, 1, 2];
const smallGallery = [0, 1, 2, 3];
const nearbyLocations = Array.from({ length: 12 }).map((_, i) => `Nearby location ${i + 1}`);

const reviews = [
  {
    user: "Anonymous User",
    service: "service name",
    score: "10.0",
    text: "Delicious food",
    date: "12 Aug 2025",
    photos: true,
  },
  {
    user: "Anonymous User",
    service: "service name",
    score: "10.0",
    text: "Delicious food",
    date: "12 Aug 2025",
    photos: false,
  },
];

const policies: PolicyItem[] = [
  {
    type: "pickup",
    title: "Pick-up/Drop-off",
    rows: [
      { label: "Pick-up:", value: "From 9.00" },
      { label: "Drop-off:", value: "Until 20.00" },
    ],
  },
  { type: "bullet", title: "Fuel", text: "Customer needs to refuel on their own. " },
  { type: "bullet", title: "Pets", text: "not allowed" },
  {
    type: "bullet",
    title: "Please note",
    text: "if the car is returned damaged or not in a clean condition, extra charges may apply.",
  },
  { type: "bullet", title: "Contact", text: "0812345678" },
];

export default function Page() {
  return (
    <div className="w-full max-w-[1440px] h-full max-h-[2082px] relative bg-dark-white">
      {/* Top bar */}
      <Navbar />

      {/* Main */}
      <div className="w-full max-w-[1440px] left-0 top-[56px] absolute inline-flex justify-start items-start">
        {/* Sidebar */}
        <SideNav />
        
        {/* Content */}
        <main className="flex-1 px-24 py-2.5 flex flex-col gap-2">
          {/* Search row */}
          <div className="self-stretch h-14 p-2 rounded-[10px] flex items-center gap-1.5">
            {searchBoxes.map((i) => (
              <div
                key={i}
                className="flex-1 min-w-24 px-5 py-2.5 bg-custom-white rounded-[10px] shadow-[0_0_5px_rgba(0,0,0,0.2)] flex items-center gap-1"
                data-property-1="Default"
                data-show-blinking-cursor="true"
                data-show-icon="true"
                data-show-placeholder="false"
                data-show-text="true"
              >
                <div className="w-4 h-4" />
              </div>
            ))}

            <button
              className="h-10 px-3 bg-blue-500 rounded-2xl flex items-center gap-1"
              data-property-1="light-blue"
            >
              <div className="w-4 h-4 item-right" />
              <span className="text-white text-base font-bold">Search</span>
            </button>
          </div>

          {/* Tabs */}
          <div
            className="self-stretch px-2 py-1.5 bg-custom-white rounded-md shadow-[0_0_5px_rgba(0,0,0,0.2)] flex items-center gap-2.5"
            data-property-1="Variant2"
          >
            {tabs.map((t) => (
              <div key={t} className="px-4 py-0.5 rounded-md flex items-center gap-1.5">
                <button className="text-gray text-base font-medium">{t}</button>
              </div>
            ))}
          </div>

          {/* Breadcrumb */}
          <div className="self-stretch px-2.5 flex items-center justify-between">
            <div>
              <button className="text-custom-black text-base font-medium">
                Restaurants &gt; Pattaya &gt;{" "} 
              </button>
              <button className="text-dark-blue text-base font-medium">
                Pupen Seafood
              </button>
            </div>
            <button className="text-dark-blue text-base font-medium">
              See all restaurants in Pattaya
            </button>
          </div>

          {/* Gallery + Main card */}
          <section className="mt-1 self-stretch flex flex-col gap-2">
            {/* Gallery */}
            <div className="self-stretch h-96 relative flex flex-col gap-2">
              <div className="w-[505px] h-96 bg-gray-100 rounded-[10px]" />
              <div className="flex gap-2">
                {smallGallery.map((i) => (
                  <div
                    key={i}
                    className="w-64 h-44 bg-gradient-to-b from-zinc-800/0 to-black/30 rounded-[10px]"
                  />
                ))}
              </div>

              {/* Circle button on top-right */}
              <div className="absolute right-2 top-2 z-10 w-7 h-7 bg-custom-white rounded-full shadow-[0_0_5px_rgba(0,0,0,0.2)]" />
            </div>

              {/* Info card */}
              <div className="mt-2 self-stretch bg-custom-white rounded-[10px] shadow-[0_0_5px_rgba(0,0,0,0.2)] flex flex-col gap-2">
                {/* Header row (price + CTA) */}
                <div className="self-stretch px-4 py-3 border-b border-light-gray">
                  <div className="flex items-start justify-between gap-3">
                    {/* LEFT: owner + title + tag */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="inline-block w-4 h-4 bg-black rounded-sm" />
                        <span className="truncate">Mit ShaSheep</span>
                      </div>

                      <h3 className="mt-1 text-base font-semibold text-custom-black truncate">
                        Cheap Car for Rent
                      </h3>

                      <div className="mt-1">
                        <span className="inline-block px-2 py-0.5 bg-blue-200 rounded-full text-blue-700 text-[11px] font-medium">
                          Luxury Car
                        </span>
                      </div>
                    </div>

                    {/* RIGHT: price + CTA */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right leading-none">
                        <div className="text-sm font-semibold text-custom-black">
                          THB 9,999
                          <span className="ml-1 text-xs font-normal text-gray-500">/day</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="h-9 px-4 rounded-[10px] bg-blue-500 text-white font-semibold shadow-[0_0_5px_rgba(48,48,48,1)] hover:bg-blue-600 active:translate-y-px"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>

                {/* Score + mini map + description */}
                <div className="self-stretch p-2.5 flex flex-col gap-5">
                  <div className="self-stretch flex items-start gap-2.5">
                    {/* Score card */}
                    <div className="flex-1 p-2.5 rounded-[10px] outline outline-1 outline-light-gray flex flex-col gap-5">
                      <div className="flex items-center gap-2.5">
                        <div className="mt-1 ml-1 w-12 h-10 px-2.5 bg-blue-100 rounded-[10px] outline outline-4 outline-blue-300 flex items-center justify-center">
                          <div className="text-blue-600 text-xl font-bold">8.8</div>
                        </div>
                        <div className="flex flex-col">
                          <div className="font-bold text-blue-600">Excellent</div>
                          <div className="w-28 flex items-center">
                            <div className="flex-1 text-gray text-xs">
                              from <span className="underline">1,234 reviews</span>
                            </div>
                            <div className="w-2.5 h-2.5" />
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col gap-2">
                        <div className="w-24 h-4 relative">
                          <div className="absolute left-1 text-gray text-xs">What people say</div>
                        </div>
                        <div className="flex-1 p-2 rounded-[10px] outline outline-1 outline-light-blue">
                          <div className="text-custom-black text-xs">
                            Nice place to visit as a family.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mini map */}
                    <div className="w-80 rounded-[10px] outline outline-1 outline-light-gray flex flex-col">
                      <div className="relative h-40">
                        <img
                          className="w-80 h-40 absolute left-0 top-0 rounded-[10px]"
                          src="https://placehold.co/240x155"
                          alt="map"
                        />
                        <div className="w-10 h-12 absolute left-1/2 -translate-x-1/2 top-[36px] bg-gradient-to-b from-blue-500 to-cyan" />
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-2 z-10 bg-custom-white rounded-[20px] shadow px-2 py-1 inline-flex items-center">
                          <div className="text-custom-black text-sm font-semibold">View on map</div>
                        </div>
                      </div>

                      <div className="flex-1 px-2.5 py-1 columns-1 md:columns-2 gap-x-4">
                      {/* <div className="flex-1 px-2.5 py-1 columns-2 gap-x-4"> */}
                        {Array.from({ length: 4 }).map((_, idx) => (
                          <div key={idx} className="mb-2 break-inside-avoid flex items-center gap-2">
                            <span className="inline-block w-3 h-3 bg-black rounded-[2px]" />
                            <span className="text-custom-black text-xs">Nearby location</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="self-stretch -mt-2 p-2.5 rounded-[10px] outline outline-1 outline-light-gray flex flex-col gap-2.5">
                    <div className="text-custom-black font-bold">Description</div>
                    <div className="text-custom-black text-sm font-medium">description</div>
                  </div>
                </div>
              </div>
          </section>

          {/* Additional Services */}
          <section className="self-stretch p-2.5 bg-custom-white rounded-[10px] shadow-[0_0_5px_rgba(0,0,0,0.2)] flex flex-col gap-2">
            <div className="h-11 px-4 py-2 border-b border-light-gray flex items-center">
              <div className="text-custom-black text-xl font-bold">Additional Services</div>
            </div>

            <div className="w-[996px] py-5 flex items-start justify-center gap-10">
              {/* Deposit */}
              <div className="w-56 p-2.5 bg-custom-white rounded-md outline outline-1 outline-dark-blue flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="text-custom-black text-base font-bold">Deposit</div>
                  <div className="text-custom-black text-xs">description</div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-start gap-0.5">
                    <div className="text-gray text-sm">฿</div>
                    <div className="text-custom-black text-lg font-extrabold">1,000</div>
                  </div>
                  <div className="text-gray text-xs">/day</div>
                </div>
              </div>

              <div className="h-10 border-l border-light-gray mx-2" />

              {/* Delivery group */}
              <div className="flex flex-col gap-5">
                {[
                  { title: "Delivery", desc: "in local area", price: "500" },
                  { title: "Delivery", desc: "out of local area", price: "1,000" },
                ].map((s) => (
                  <div
                    key={s.title + s.desc}
                    className="w-56 p-2.5 bg-custom-white rounded-md outline outline-1 outline-dark-blue flex items-center justify-between"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="text-custom-black text-base font-bold">{s.title}</div>
                      <div className="text-custom-black text-xs">{s.desc}</div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-start gap-0.5">
                        <div className="text-gray text-sm">฿</div>
                        <div className="text-custom-black text-lg font-extrabold">{s.price}</div>
                      </div>
                      <div className="text-gray text-xs">/day</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-10 border-l border-light-gray mx-2" />

              {/* Insurance */}
              <div className="w-56 p-2.5 bg-custom-white rounded-md outline outline-1 outline-dark-blue flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="text-custom-black text-base font-bold">Insurance</div>
                  <div className="text-custom-black text-xs">description</div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-start gap-0.5">
                    <div className="text-gray text-sm">฿</div>
                    <div className="text-custom-black text-lg font-extrabold">500</div>
                  </div>
                  <div className="text-gray text-xs">/day</div>
                </div>
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section className="self-stretch p-2.5 bg-custom-white rounded-[10px] shadow-[0_0_5px_rgba(0,0,0,0.2)] flex flex-col gap-2">
            <div className="px-4 py-2 border-b border-light-gray flex flex-col gap-2.5">
              <div className="text-custom-black text-xl font-bold">Reviews</div>
              <div className="px-12 py-3 flex items-center gap-5">
                <div className="w-16 h-16 relative bg-pale-blue rounded-[10px] shadow-[0_0_10px_rgba(135,210,249,1)] outline outline-4 outline-light-blue">
                  <div className="absolute left-[10px] top-[13px] text-dark-blue text-3xl font-extrabold">
                    8.8
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="text-dark-blue text-xl font-bold">Excellent</div>
                  <div className="text-gray text-sm font-medium">from 1,234 reviews</div>
                </div>
              </div>
            </div>

            {reviews.map((rv, idx) => (
              <div
                key={idx}
                className="self-stretch pl-5 pr-4 py-4 rounded-[10px] outline outline-1 outline-light-gray flex items-start gap-1.5"
                data-property-1="Variant2"
              >
                <div className="w-48 h-12 flex flex-col gap-1">
                  <div className="flex items-center gap-0.5">
                    <div className="w-4 h-4 bg-custom-black" />
                    <div className="text-custom-black text-sm font-medium">{rv.user}</div>
                  </div>
                  <div className="text-gray text-xs">{rv.service}</div>
                </div>

                <div className="flex-1 flex flex-col gap-1">
                  <div className="px-2 py-0.5 bg-pale-blue rounded-[20px] inline-flex items-center w-fit">
                    <div className="text-dark-blue text-xs font-medium">{rv.score}</div>
                    <div className="text-gray text-[10px]">/10</div>
                  </div>
                  <div className="text-custom-black text-xs">{rv.text}</div>

                  {rv.photos && (
                    <div className="flex items-center gap-2.5">
                      <div className="w-20 h-20 bg-gradient-to-b from-zinc-800/0 to-black/30 rounded-[10px]" />
                    </div>
                  )}

                  <div className="text-right text-gray text-xs">{rv.date}</div>
                </div>

                <div className="w-4 h-4 rotate-180 relative">
                  <div className="w-3.5 h-[3.2px] absolute left-[0.8px] top-[6.4px] bg-gray" />
                </div>
              </div>
            ))}
          </section>

          {/* Location */}
          <section className="self-stretch p-2.5 bg-custom-white rounded-[10px] shadow-[0_0_5px_rgba(0,0,0,0.2)] flex flex-col gap-2">
            <div className="h-11 px-4 py-2 border-b border-light-gray flex items-center">
              <div className="text-custom-black text-xl font-bold">Location</div>
            </div>

            <div className="flex gap-5">
              <div className="flex-1 h-64 relative rounded-[10px] outline outline-1 outline-light-gray">
                <img
                  className="w-[488px] h-64 absolute left-0 top-0 rounded-[10px]"
                  src="https://placehold.co/488x252"
                  alt="map"
                />
                <div className="w-10 h-12 absolute left-1/2 -translate-x-1/2 top-[84px] bg-gradient-to-b from-dark-blue to-cyan" />
              </div>

              <div className="flex-1 flex flex-col gap-5">
                <div className="h-36 pt-1.5 flex flex-col gap-1">
                  {nearbyLocations.map((label, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <div className="w-3 h-3 relative">
                        <div className="w-2.5 h-3 absolute left-[1.2px] top-0 bg-custom-black" />
                      </div>
                      <div className="text-custom-black text-xs">{label}</div>
                    </div>
                  ))}
                </div>
                <div className="text-dark-blue text-sm font-medium cursor-pointer">View On Map</div>
              </div>
            </div>
          </section>

          {/* Policies */}
          <section className="self-stretch p-2.5 bg-custom-white rounded-[10px] shadow-[0_0_5px_rgba(0,0,0,0.2)] flex flex-col gap-2">
            <div className="h-11 px-4 py-2 border-b border-light-gray flex items-center">
              <div className="text-custom-black text-xl font-bold">Policies</div>
            </div>

            <div className="px-4 py-2 flex flex-col gap-2.5">
              {policies.map((p, idx) =>
                p.type === "pickup" ? (
                  <div key={idx} className="w-[964px] py-0.5 flex items-center gap-1">
                    <div className="py-0.5 flex flex-col">
                      <div className="w-4 h-4" />
                    </div>
                    <div className="w-[504px] flex flex-col gap-1">
                      <div className="w-72 h-5 relative">
                        <div className="absolute left-0 top-0 text-custom-black text-sm font-semibold">
                          {p.title}
                        </div>
                      </div>
                      <div className="w-[504px] h-5 flex items-center gap-2.5">
                        {p.rows.map((r) => (
                          <div key={r.label} className="flex items-center gap-1">
                            <div className="text-gray text-sm">{r.label}</div>
                            <div className="text-custom-black text-sm font-semibold">{r.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={idx} className="w-[964px] py-0.5 flex items-center gap-1">
                    <div className="py-0.5 flex flex-col">
                      <div className="w-4 h-4" />
                    </div>
                    <div className="w-[504px] flex items-start gap-1">
                      <div className="text-custom-black text-sm font-semibold">{p.title}</div>
                      <div className="text-gray text-sm">{p.text}</div>
                    </div>
                  </div>
                )
              )}
            </div> 
          </section>
        </main>
        {/* /Content */}
      </div>
    </div>
  );
}
