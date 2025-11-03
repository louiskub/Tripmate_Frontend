"use client";

import { Calendar, Clock, Copy, MapPin, Eye, Plus, Users, Star, Utensils, Bed } from "lucide-react";
import React from "react";

/**
 * Trip Editor – converted from Figma to TSX + Tailwind
 * - Keeps your custom tokens (custom-black, dark-blue, pale-blue, light-blue, custom-white)
 * - Replaces absolute-positioned decorative boxes with icons where sensible
 * - Uses semantic structure, responsive flex, and gap utilities
 */

export default function TripEditor() {
  return (
    <section className="w-full p-2.5 bg-custom-white rounded-[10px] inline-flex flex-col gap-2.5">
      {/* Header */}
      <header className="w-full pt-1 pb-3 border-b border-neutral-200 inline-flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-custom-black text-2xl font-extrabold font-[Manrope] truncate">Trip to Pattaya</h1>
          <span className="text-gray text-lg font-semibold font-[Manrope] shrink-0">#123456</span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* privacy pill */}
          <div className="h-8 px-2.5 rounded-[10px] outline outline-1 outline-light-blue flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-4 h-4 text-custom-black" />
              <span className="text-custom-black text-sm font-semibold font-[Manrope]">private</span>
            </span>
          </div>

          <button className="h-8 px-2.5 rounded-[10px] outline outline-1 outline-custom-black inline-flex items-center gap-1">
            <Copy className="w-4 h-4 text-custom-black" />
            <span className="text-custom-black text-sm font-semibold font-[Manrope]">Copy from trips</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button className="h-8 px-2.5 rounded-[10px] outline outline-1 outline-dark-blue inline-flex items-center gap-1">
              <Eye className="w-4 h-4 text-dark-blue" />
              <span className="text-dark-blue text-sm font-semibold font-[Manrope]">Discard</span>
            </button>
            <button className="h-8 px-2.5 bg-dark-blue rounded-[10px] inline-flex items-center gap-1">
              <Eye className="w-4 h-4 text-gray-50" />
              <span className="text-gray-50 text-sm font-semibold font-[Manrope]">Save</span>
            </button>
          </div>
        </div>
      </header>

      {/* Body 3-column layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-[14rem_1fr_14rem] gap-2.5">
        {/* Left rail */}
        <aside className="w-full px-2 py-2.5 border-r lg:border-r border-neutral-200 flex flex-col items-center gap-2.5">
          <img className="w-48 h-52 rounded-lg object-cover" src="https://placehold.co/200x204" alt="cover" />

          {/* Dates card */}
          <div className="w-full px-2.5 pt-2.5 bg-custom-white rounded-[10px] outline outline-1 outline-neutral-200 flex flex-col gap-2">
            {/* From */}
            <div className="w-full px-1 pb-1.5 flex flex-col gap-1">
              <div className="text-custom-black text-sm font-medium font-[Manrope]">From :</div>
              <div className="h-7 min-w-24 px-2.5 bg-custom-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center justify-between">
                <span className="text-gray text-sm font-medium font-[Manrope]">Sat, 25 Aug 2025</span>
                <Calendar className="w-4 h-4 text-custom-black" />
              </div>
              <div className="h-7 min-w-24 px-2.5 bg-custom-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center justify-between">
                <span className="text-gray text-sm font-medium font-[Manrope]">10.00</span>
                <Clock className="w-4 h-4 text-custom-black" />
              </div>
            </div>

            {/* Divider */}
            <div className="w-full flex items-center justify-center">
              <div className="h-4 w-px bg-neutral-300" />
            </div>

            {/* To */}
            <div className="w-full px-1 pb-1.5 flex flex-col gap-1">
              <div className="text-custom-black text-sm font-medium font-[Manrope]">To :</div>
              <div className="h-7 min-w-24 px-2.5 bg-custom-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center justify-between">
                <span className="text-gray text-sm font-medium font-[Manrope]">Sun, 26 Aug 2025</span>
                <Calendar className="w-4 h-4 text-custom-black" />
              </div>
              <div className="h-7 min-w-24 px-2.5 bg-custom-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center justify-between">
                <span className="text-gray text-sm font-medium font-[Manrope]">18.00</span>
                <Clock className="w-4 h-4 text-custom-black" />
              </div>
            </div>

            {/* People counters */}
            <div className="w-full py-2.5 border-t border-neutral-200 grid grid-cols-2 gap-1">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-custom-black" />
                <div className="flex-1 h-6 px-2.5 py-2 bg-custom-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center">
                  <span className="text-gray text-sm font-medium font-[Manrope]">2</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4 text-custom-black" />
                <div className="flex-1 h-6 px-2.5 py-2 bg-custom-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center">
                  <span className="text-gray text-sm font-medium font-[Manrope]">1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Location preview */}
          <div className="w-full h-44 p-1.5 rounded-[10px] outline outline-1 outline-neutral-200 flex flex-col gap-1.5">
            <div className="w-full inline-flex items-center gap-1">
              <MapPin className="w-5 h-5 text-custom-black" />
              <div className="flex-1 h-6 min-w-24 px-2.5 py-2 bg-custom-white rounded-lg outline outline-1 outline-neutral-200 inline-flex items-center">
                <span className="text-gray text-sm font-medium font-[Manrope]">Pattaya</span>
              </div>
            </div>

            <div className="relative h-32 w-full rounded-[10px] shadow-sm overflow-hidden">
              <img className="w-full h-full object-cover" src="https://placehold.co/196x131" alt="map preview" />
              <button className="absolute bottom-2 left-1/2 -translate-x-1/2 h-6 min-w-24 px-2 py-1 bg-custom-white rounded-[20px] shadow inline-flex items-center gap-1">
                <span className="text-custom-black text-sm font-semibold font-[Manrope]">View on map</span>
                <MapPin className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Middle column – Days & Events */}
        <main className="w-full p-2.5 flex flex-col gap-2.5">
          <button className="w-full h-8 px-2.5 rounded-[10px] outline outline-1 outline-custom-black inline-flex items-center gap-1 justify-center">
            <Copy className="w-4 h-4 text-custom-black" />
            <span className="text-custom-black text-sm font-semibold font-[Manrope]">Copy from other trips</span>
          </button>

          {/* Day 1 card */}
          <DayCard dayLabel="Day 1" dateLabel="Sat, 25 Aug 2025" />

          {/* Connector line */}
          <div className="w-full flex items-center justify-start px-7">
            <div className="h-12 w-px bg-light-blue/60" />
          </div>

          {/* Day 2 card */}
          <DayCard dayLabel="Day 2" dateLabel="Sat, 25 Aug 2025" />

          <div className="w-full inline-flex justify-end">
            <button className="flex-1 h-9 px-5 bg-pale-blue rounded-[10px] inline-flex items-center gap-2 justify-center">
              <Plus className="w-4 h-4" />
              <span className="text-custom-black text-base font-bold font-[Manrope]">Add Day</span>
            </button>
          </div>
        </main>

        {/* Right rail – People */}
        <aside className="w-full p-2.5 border-l lg:border-l border-neutral-200 flex flex-col gap-3">
          <div className="w-full flex flex-col gap-2">
            <div className="w-full pb-1.5 border-b border-neutral-200 inline-flex items-center gap-2.5">
              <h3 className="flex-1 text-custom-black text-base font-bold font-[Manrope]">People in trip (2)</h3>
              <Users className="w-5 h-5 text-custom-black" />
            </div>

            <PersonRow name="full name" role="head" you />
            <PersonRow name="full name" role="member" />
          </div>
        </aside>
      </div>
    </section>
  );
}

/* ---------- Subcomponents ---------- */

function DayCard({ dayLabel, dateLabel }: { dayLabel: string; dateLabel: string }) {
  return (
    <section className="w-full rounded-[10px] shadow-sm outline outline-1 outline-light-blue overflow-hidden">
      {/* Day header */}
      <div className="w-full h-11 px-2 py-1 bg-pale-blue relative inline-flex items-center justify-between">
        <div className="w-16 h-7 px-1.5 py-2.5 rounded-[10px] outline outline-1 outline-light-blue inline-flex items-center">
          <span className="text-custom-black text-lg font-semibold font-[Manrope]">{dayLabel}</span>
        </div>
        <div className="h-8 px-3 bg-custom-white rounded-[20px] shadow inline-flex items-center gap-1.5">
          <span className="text-custom-black text-sm font-medium font-[Manrope]">Event</span>
          <Plus className="w-4 h-4" />
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1">
          <span className="text-custom-black text-sm font-medium font-[Manrope]">{dateLabel}</span>
          <Calendar className="w-4 h-4" />
        </div>
      </div>

      {/* Events list (sample) */}
      <EventRow time="10.00" title="Meet at Station" desc="description" chip={{ icon: MapPin, label: "PraJomKlao station" }} />
      <EventRow time="10.30" title="Start traveling" />
      <EventRow time="13.00" title="Arrive at restaurant" desc="description" chip={{ icon: Utensils, label: "Restaurant" }} />
      <EventRow time="15.30" title="Check-in at hotel" desc="description" chip={{ icon: Bed, label: "Centara Grand Mirag..." }} />
      <EventRow time="17.00" title="Go to Pattaya Beach" desc="description" chip={{ icon: MapPin, label: "Pattaya Beach" }} />
      {/* Booking card example */}
      <EventRow
        time="19.30"
        title="Have Dinner at"
        desc="description"
        booking
      />

      {/* Service summary */}
      <div className="w-full pl-5 pr-2.5 border-t border-neutral-200 flex flex-col gap-1.5">
        <div className="w-full py-2 border-b border-neutral-200 inline-flex items-center justify-between">
          <span className="text-custom-black text-base font-bold font-[Manrope]">Service</span>
          <button className="w-5 h-5 rounded-full bg-custom-white shadow inline-grid place-items-center">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Accommodation example card */}
        <div className="w-full bg-custom-white rounded-[10px] flex flex-col">
          <div className="w-full px-2.5 inline-flex items-center justify-between">
            <span className="text-custom-black text-sm font-medium font-[Manrope]">Accommodation</span>
            <span className="px-1 bg-pale-blue rounded-lg inline-flex items-center gap-1">
              <span className="text-sky-200 text-xs font-normal font-[IBM_Plex_Sans]">฿</span>
              <span className="text-dark-blue text-xs font-normal font-[Manrope]">5,192.92</span>
            </span>
          </div>

          <div className="w-full p-2.5 bg-custom-white rounded-[10px] inline-flex items-start gap-2.5">
            <div className="w-28 h-28 rounded-[10px] bg-gradient-to-b from-zinc-800/0 to-black/30" />
            <div className="flex-1 flex">
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="min-h-5 inline-flex items-center gap-1 flex-wrap">
                  <span className="text-custom-black text-sm font-medium font-[Manrope]">
                    Centara Grand Mirage Beach Resort Pattaya
                  </span>
                </div>
                <div className="h-9 inline-flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-pale-blue rounded-[20px] inline-flex items-center">
                    <span className="text-dark-blue text-xs font-medium font-[Inter]">tag</span>
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="w-3 h-3 rounded bg-dark-blue" />
                    ))}
                  </div>
                </div>
                <div className="inline-flex items-center gap-1">
                  <span className="px-2 py-0.5 bg-pale-blue rounded-[20px] inline-flex items-center">
                    <span className="text-dark-blue text-xs font-medium font-[Inter]">10.0</span>
                  </span>
                  <span className="text-dark-blue text-xs font-normal font-[Manrope]">Excellent</span>
                </div>
                <div className="inline-flex items-center gap-1">
                  <Star className="w-3 h-3 text-custom-black" />
                  <span className="text-custom-black text-xs font-normal font-[Manrope]">location</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking snippet */}
          <div className="w-full px-2.5 pb-2.5">
            <div className="w-full h-24 p-2 bg-gray-50 rounded-[10px] flex flex-col gap-1 overflow-hidden">
              <div className="w-full flex gap-1.5">
                <div className="w-16 h-20 rounded-[10px] bg-gradient-to-b from-zinc-800/0 to-black/30" />
                <div className="flex-1 flex flex-col justify-center">
                  <span className="text-custom-black text-xs font-normal font-[Manrope]">
                    Mirage Premium Explorer King View, sea
                  </span>
                  <div className="pt-1 flex flex-col gap-1">
                    <div className="inline-flex items-center gap-1">
                      <div className="w-3 h-3" />
                      <span className="text-custom-black text-[10px] font-normal font-[Manrope]">
                        42.0 m²
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1">
                      <div className="w-3 h-3" />
                      <span className="text-custom-black text-[10px] font-normal font-[Manrope]">
                        1 king bed
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      <span className="text-custom-black text-[10px] font-normal font-[Manrope]">5</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="inline-flex items-center gap-1">
                <span className="inline-flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-green" />
                  <span className="text-green text-[10px] font-normal font-[Manrope]">Breakfast included</span>
                </span>
                <span className="ml-auto text-custom-black text-xs">x 1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EventRow({
  time,
  title,
  desc,
  chip,
  booking,
}: {
  time: string;
  title: string;
  desc?: string;
  chip?: { icon: React.ComponentType<{ className?: string }>; label: string };
  booking?: boolean;
}) {
  return (
    <div className="w-full pl-4 pr-2.5 py-2 bg-custom-white border-b border-neutral-200 inline-flex items-start gap-1.5">
      <div className="w-14 text-custom-black text-base font-medium font-[Manrope]">{time}</div>
      <div className="flex-1 flex flex-col gap-0.5">
        <div className="text-custom-black text-base font-medium font-[Manrope]">{title}</div>
        {desc && <div className="text-gray text-sm font-medium font-[Manrope]">{desc}</div>}
      </div>
      <div className="flex items-center gap-1.5">
        {chip && (
          <span className="px-1.5 rounded-lg outline outline-1 outline-light-blue inline-flex items-center gap-1">
            <chip.icon className="w-3.5 h-3.5" />
            <span className="text-custom-black text-sm font-medium font-[Manrope]">{chip.label}</span>
          </span>
        )}
      </div>

      {booking && (
        <div className="ml-auto px-2.5 py-1.5 rounded-lg shadow outline outline-1 outline-light-blue inline-flex flex-col gap-1 min-w-[12rem]">
          <div className="w-full pb-1 border-b border-neutral-200 inline-flex items-center gap-2.5">
            <span className="text-custom-black text-xs font-medium font-[Inter]">Restaurant booking</span>
          </div>
          <div className="w-full inline-flex items-center gap-2.5">
            <div className="w-14 h-14 rounded-[10px] bg-gradient-to-b from-zinc-800/0 to-black/30" />
            <div className="flex-1 flex flex-col gap-0.5 min-w-0">
              <div className="inline-flex items-center gap-1 flex-wrap">
                <span className="text-custom-black text-xs font-medium font-[Inter] truncate">name</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="inline-flex items-center gap-1">
                  <Star className="w-3.5 h-3.5" />
                  <span className="w-2 text-center text-gray text-[10px] font-normal font-[Manrope]">4</span>
                </div>
                <div className="inline-flex items-center gap-1">
                  <Calendar className="w-2.5 h-2.5" />
                  <span className="text-gray text-[10px] font-normal font-[Manrope]">Sat, 25 Aug 2025</span>
                </div>
                <div className="inline-flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  <span className="text-gray text-[10px] font-normal font-[Manrope]">19.30</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PersonRow({ name, role, you = false }: { name: string; role: string; you?: boolean }) {
  return (
    <div className="w-full inline-flex items-center gap-2">
      <img className="w-7 h-7 rounded-full object-cover" src="https://placehold.co/28x28" alt={name} />
      <div className="flex-1 flex flex-col">
        <div className="w-full inline-flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-custom-black text-sm font-medium font-[Manrope] truncate">{name}</span>
          </div>
          <span className="text-gray text-xs font-normal font-[Manrope] shrink-0">{you ? "(You)" : ""}</span>
        </div>
        <span className="text-gray text-xs font-normal font-[Manrope]">{role}</span>
      </div>
    </div>
  );
}
