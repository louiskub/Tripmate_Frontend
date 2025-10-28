"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentType, FormEvent } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
// import * as LucideIcons from "lucide-react";
import MyHotelIcon from "@/assets/icons/hotel.svg";
import MyRestaurantIcon from "@/assets/icons/restaurant-fill.svg";
import MyAttractionIcon from "@/assets/icons/attractions.svg";
import { renderToString } from "react-dom/server";

type MarkerCategory = "hotel" | "restaurant" | "attraction";

type SystemMarker = {
  name: string;
  category: MarkerCategory;
  lat: number;
  lng: number;
};

type Suggestion = {
  display_name: string;
  lat: string;
  lon: string;
};

type LocationInfo = {
  name: string;
  address?: string;
};

export default function MapSection() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  // สำหรับหมุดระบบ (element+label) เพื่ออัปเดตตำแหน่ง label ตามซูม/เลื่อน
  const systemMarkersRef = useRef<
    { markerEl: HTMLDivElement; label: HTMLSpanElement; lat: number; lng: number }[]
  >([]);

  // หมุดผู้ใช้ “ตัวเดียว” ใช้ร่วมกันทั้ง search และคลิก
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);

  // UI states
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  // กำหนดไอคอนและสีของ “หมวดหมู่หมุดระบบ”
  const categoryStyles: Record<MarkerCategory, { icon: any, color: string }> = {
    hotel: { icon: MyHotelIcon, color: "#3B82F6" },        // ฟ้า
    restaurant: { icon: MyRestaurantIcon, color: "#EF4444" }, // แดง
    attraction: { icon: MyAttractionIcon, color: "#10B981" },  // เขียว
  };

  // สร้าง SVG จาก React icon (lucide) เป็น string เพื่อยัดลง DOM ของ marker
  const renderIconToString = (IconComp: ComponentType<any>, color: string, size = 22) =>
    renderToString(<IconComp color={color} width={size} height={size} />);

  // โหลดแผนที่ + หมุดระบบ + คลิกเพื่อปักหมุดผู้ใช้
  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.stadiamaps.com/styles/osm_bright.json",
      center: [100.5231, 13.7367], // Bangkok center-ish
      zoom: 13,
    });
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    // ตัวอย่าง “หมุดระบบ” 3 ประเภท
    const systemPoints: SystemMarker[] = [
      { name: "โรงแรม The River", category: "hotel", lat: 13.7367, lng: 100.5231 },
      { name: "ร้านอาหารครัวบางรัก", category: "restaurant", lat: 13.745, lng: 100.53 },
      { name: "สวนลุมพินี", category: "attraction", lat: 13.7302, lng: 100.5417 },
    ];

    // วางหมุดระบบพร้อม label ที่นิ่งและย่อ/ขยายได้
    systemPoints.forEach((m) => {
      const { icon, color } = categoryStyles[m.category];

      // ตัว marker (DOM) ใส่ SVG icon ลงไป
      const markerEl = document.createElement("div");
      markerEl.innerHTML = renderIconToString(icon, color, 30);
      Object.assign(markerEl.style, {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: "translateY(-8px)",
        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.25))",
      } as CSSStyleDeclaration);

      new maplibregl.Marker({ element: markerEl }).setLngLat([m.lng, m.lat]).addTo(map);

      // สร้าง label (overlay absolute บน map container)
      const label = document.createElement("span");
      label.textContent = m.name;
      Object.assign(label.style, {
        position: "absolute",
        background: "rgba(255,255,255,0.9)",
        color: "#111827",
        fontSize: "12px",
        fontWeight: "500",
        padding: "2px 6px",
        borderRadius: "6px",
        border: "1px solid rgba(0,0,0,0.1)",
        backdropFilter: "blur(2px)",
        whiteSpace: "nowrap",
        transformOrigin: "center top",
        pointerEvents: "none",
        transform: "translate(-50%, 24px)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
        transition: "transform 0.2s ease, opacity 0.25s ease",
        opacity: "0",
      } as CSSStyleDeclaration);

      map.getContainer().appendChild(label);
      systemMarkersRef.current.push({ markerEl, label, lat: m.lat, lng: m.lng });
    });

    // อัปเดตตำแหน่งและขนาดของ label เมื่อซูมหรือแพน
    const updateLabels = () => {
      const zoom = map.getZoom();
      const normalized = Math.max(0, Math.min(1, (zoom - 3) / 13));
      const eased = Math.pow(normalized, 1.25);
      const scale = Math.max(0.1, Math.min(1, eased));
      const offset = 30 * scale;

      systemMarkersRef.current.forEach(({ lat, lng, label, markerEl }) => {
        const pos = map.project([lng, lat]);
        label.style.left = `${pos.x}px`;
        label.style.top = `${pos.y - offset}px`;
        label.style.transform = `translate(-50%, -35%) scale(${scale})`;
        label.style.opacity = zoom < 10 ? "0" : "1";
        markerEl.style.display = zoom < 10 ? "none" : "flex";
      });
    };

    map.on("move", updateLabels);
    map.on("zoom", updateLabels);
    map.on("idle", updateLabels); // ให้แน่ใจว่า render เสร็จรอบแรก
    setTimeout(updateLabels, 300); // fallback กันวาบไปซ้ายบน

    // คลิกซ้ายเพื่อปักหมุดผู้ใช้ (แทนที่หมุดเดิมถ้ามี) + เปิด popup
    map.on("click", async (e) => {
      if (userMarkerRef.current) userMarkerRef.current.remove();
      const marker = new maplibregl.Marker({ color: "#ff4d4f" })
        .setLngLat(e.lngLat)
        .addTo(map);
      userMarkerRef.current = marker;

      const info = await reverseGeocode(e.lngLat.lat, e.lngLat.lng);
      setLocationInfo(info);
      setIsClosing(false);
    });

    return () => map.remove();
  }, []);

  // =========================
  // Search & Suggestion (TH)
  // =========================
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&countrycodes=TH&accept-language=th&limit=5`,
          {
            headers: {
              "Accept-Language": "th",
              "User-Agent": "KMITL-MapProject/1.0 (student use)",
            },
          }
        );
        const data: Suggestion[] = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Suggestion error:", err);
      }
    };

    const delay = setTimeout(fetchSuggestions, 300); // debounce
    return () => clearTimeout(delay);
  }, [query]);

  // Reverse geocode: lat/lon -> ข้อมูลภาษาไทย
  const reverseGeocode = async (lat: number, lon: number): Promise<LocationInfo> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16&accept-language=th`,
        {
          headers: {
            "Accept-Language": "th",
            "User-Agent": "KMITL-MapProject/1.0 (student use)",
          },
        }
      );
      const data = await res.json();
      return {
        name: data.display_name?.split(",")[0] || "ไม่ทราบชื่อสถานที่",
        address: data.display_name,
      };
    } catch (err) {
      console.error("Reverse geocode error:", err);
      return { name: "ไม่ทราบชื่อสถานที่" };
    }
  };

  // เลือกสถานที่จาก suggestion หรือ submit
  const goToPlace = async (name: string, lat: number, lon: number) => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // ใช้หมุดผู้ใช้ “ตัวเดียว”
    if (userMarkerRef.current) userMarkerRef.current.remove();
    const marker = new maplibregl.Marker({ color: "#ff3333" }).setLngLat([lon, lat]).addTo(map);
    userMarkerRef.current = marker;

    map.flyTo({ center: [lon, lat], zoom: 15 });

    const info = await reverseGeocode(lat, lon);
    setLocationInfo(info);
    setIsClosing(false);

    setSuggestions([]);
    setQuery(name);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      const s = suggestions[0];
      goToPlace(s.display_name, parseFloat(s.lat), parseFloat(s.lon));
    }
  };

  // ปิด popup และลบหมุดผู้ใช้
  const closePopup = () => {
    setIsClosing(true);
    setTimeout(() => {
      setLocationInfo(null);
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
      setIsClosing(false);
    }, 250); // ให้ตรงกับ transition
  };

  return (
    <div className="w-full h-screen relative overflow-hidden font-sans">
      {/* 🔎 Search Bar + Suggestion */}
      <form onSubmit={handleSubmit} className="absolute top-6 left-6 z-20 w-80">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            placeholder="ค้นหาสถานที่ในประเทศไทย..."
            className="w-full px-4 py-3 bg-white/90 rounded-xl border border-gray-200 
                       focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200
                       text-sm text-gray-900 placeholder:text-gray-400
                       shadow-sm transition-all duration-200 backdrop-blur-md"
          />

          {/* ไอคอนแว่นขยาย */}
          <svg
            className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {isFocused && suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-64 overflow-y-auto z-30">
            {suggestions.map((s, idx) => (
              <li
                key={idx}
                onClick={() => goToPlace(s.display_name, parseFloat(s.lat), parseFloat(s.lon))}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700
                           transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl
                           border-b border-gray-50 last:border-b-0"
              >
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="leading-relaxed">{s.display_name}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </form>

      {/* 🗺️ แผนที่ */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* 🧾 Popup ด้านล่าง กลางจอ */}
      {locationInfo && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 bottom-20 w-[90%] max-w-sm 
                      bg-white rounded-2xl shadow-lg border border-gray-100 p-5
                      transition-all duration-300 ease-out z-20
                      ${isClosing ? "opacity-0 translate-y-4 scale-95" : "opacity-100 translate-y-0 scale-100"}`}
        >
          <button
            onClick={closePopup}
            className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center
                       text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full
                       transition-all duration-200"
            aria-label="ปิด"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="pr-6">
            <div className="flex items-start gap-2 mb-2">
              <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="font-medium text-gray-900 text-base leading-snug">{locationInfo.name}</h3>
            </div>

            {locationInfo.address && (
              <p className="text-sm text-gray-500 leading-relaxed ml-7">{locationInfo.address}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
