"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// Your project SVG icons (ensure these paths are correct in your app)
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

type LngLat = { lat: number; lng: number };

type PopupInfo = {
  name: string;
  address?: string;
  lat: number;
  lng: number;
};

export default function FinalMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  // Markers & overlays
  const originMarkerRef = useRef<maplibregl.Marker | null>(null);
  const destMarkerRef = useRef<maplibregl.Marker | null>(null);
  const singleMarkerRef = useRef<maplibregl.Marker | null>(null);

  // System marker overlays to manage labels
  const systemMarkersRef = useRef<
    { markerEl: HTMLDivElement; label: HTMLSpanElement; lat: number; lng: number; name: string; category: MarkerCategory }[]
  >([]);

  // Routing state (keep refs so map handlers don't recreate map)
  const directionsOnRef = useRef(false);
  const activeTargetRef = useRef<"origin" | "destination">("destination");

  const [directionsOn, setDirectionsOn] = useState(false);
  const [activeTarget, setActiveTarget] = useState<"origin" | "destination">("destination");
  const [origin, setOrigin] = useState<LngLat | null>(null);
  const [destination, setDestination] = useState<LngLat | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distanceText: string; durationText: string } | null>(null);
  const [routeSteps, setRouteSteps] = useState<string[]>([]);

  // Search state
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  // Bottom popup state (style from map.tsx)
  const [locationInfo, setLocationInfo] = useState<PopupInfo | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Constants
  const ROUTE_SOURCE_ID = "route-source";
  const ROUTE_LAYER_ID = "route-line";
  const SYSTEM_PROXIMITY_PX = 24;
  const iconSrc = (iconObj: any) => (iconObj?.src ? iconObj.src : iconObj);

  const categoryStyles: Record<MarkerCategory, { icon: string; color: string }> = {
    hotel: { icon: MyHotelIcon, color: "#3B82F6" },
    restaurant: { icon: MyRestaurantIcon, color: "#EF4444" },
    attraction: { icon: MyAttractionIcon, color: "#10B981" },
  };

  // สร้าง SVG จาก React icon (lucide) เป็น string เพื่อยัดลง DOM ของ marker
  const renderIconToString = (IconComp: ComponentType<any>, color: string, size = 22) =>
    renderToString(<IconComp color={color} width={size} height={size} />);
  
  const changeDirectionsOn = (value: boolean) => {
    setDirectionsOn(value);
    if (value == false) {
        destMarkerRef.current?.remove();
        destMarkerRef.current = null;
        setDestination(null);
        originMarkerRef.current?.remove();
        originMarkerRef.current = null;
        setOrigin(null);
        clearRouteLayer();
    }
  }

  // Sync React state -> refs
  useEffect(() => {
    directionsOnRef.current = directionsOn;
  }, [directionsOn]);
  useEffect(() => {
    activeTargetRef.current = activeTarget;
  }, [activeTarget]);

  // Reverse geocoding for clicked points
  const reverseGeocode = async (lat: number, lon: number): Promise<PopupInfo> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16&accept-language=th`,
        { headers: { "User-Agent": "MapProject/1.0", "Accept-Language": "th" } }
      );
      const data = await res.json();
      return {
        name: data.display_name?.split(",")[0] || "ไม่ทราบชื่อสถานที่",
        address: data.display_name,
        lat,
        lng: lon,
      };
    } catch {
      return { name: "ไม่ทราบชื่อสถานที่", lat, lng: lon };
    }
  };

  // Initialize map once
  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.stadiamaps.com/styles/osm_bright.json",
      center: [100.5231, 13.7367],
      zoom: 13,
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    // System markers (kept from map.tsx)
    const systemPoints: SystemMarker[] = [
      { name: "โรงแรม The River", category: "hotel", lat: 13.7367, lng: 100.5231 },
      { name: "ร้านอาหารครัวบางรัก", category: "restaurant", lat: 13.745, lng: 100.53 },
      { name: "สวนลุมพินี", category: "attraction", lat: 13.7302, lng: 100.5417 },
    ];

    systemPoints.forEach((m) => {
      const { icon, color } = categoryStyles[m.category];
      const markerEl = document.createElement("div");
      markerEl.innerHTML = renderIconToString(icon, color, 40); // ใช้ไอคอนเดียวกัน
    //   markerEl.innerHTML = `<img src="${iconSrc(icon)}" width="28" height="28" style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.4));" />`;
      Object.assign(markerEl.style, { cursor: "pointer" });

      const label = document.createElement("span");
      label.textContent = m.name;
      Object.assign(label.style, {
        position: "absolute",
        background: "rgba(255,255,255,0.9)",
        color: "#111",
        fontSize: "12px",
        padding: "2px 6px",
        borderRadius: "6px",
        border: "1px solid rgba(0,0,0,0.1)",
        transformOrigin: "center top",
        transform: "translate(-50%, 24px)",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
        transition: "transform 0.2s ease, opacity 0.25s ease",
        opacity: "0",
      } as CSSStyleDeclaration);

      new maplibregl.Marker({ element: markerEl }).setLngLat([m.lng, m.lat]).addTo(map);
      map.getContainer().appendChild(label);
      systemMarkersRef.current.push({ markerEl, label, lat: m.lat, lng: m.lng, name: m.name, category: m.category });

      // Click system marker → show bottom popup; integrate with routing if active
      markerEl.addEventListener("click", (e) => {
        e.stopPropagation();
        setLocationInfo({ name: m.name, address: `${m.name}, กรุงเทพมหานคร`, lat: m.lat, lng: m.lng });
        setIsClosing(false);

        if (directionsOnRef.current) {
          setDestination({ lat: m.lat, lng: m.lng });
          placeABMarker({ lat: m.lat, lng: m.lng }, "destination");
          if (origin) routeBetween(origin, { lat: m.lat, lng: m.lng });
        } else {
          // normal mode → also drop a single marker at that position
          if (singleMarkerRef.current) singleMarkerRef.current.remove();
          singleMarkerRef.current = new maplibregl.Marker({ color: "#ff4d4f" })
            .setLngLat([m.lng, m.lat])
            .addTo(map);
        }
      });
    });

    // Label updater (scale + visibility like map.tsx)
    const updateLabels = () => {
      const zoom = map.getZoom();
      const normalized = Math.max(0, Math.min(1, (zoom - 3) / 12));
      const eased = Math.pow(normalized, 1.25);
      const scale = Math.max(0.1, Math.min(1.2, eased));
      const offset = 30 * scale;

      systemMarkersRef.current.forEach(({ lat, lng, label, markerEl }) => {
        const pos = map.project([lng, lat]);
        label.style.left = `${pos.x}px`;
        label.style.top = `${pos.y - offset}px`;
        label.style.transform = `translate(-50%, 0) scale(${scale})`;
        label.style.opacity = zoom < 10 ? "0" : "1";
        (markerEl.style as any).display = zoom < 10 ? "none" : "block";
      });
    };
    map.on("move", updateLabels);
    map.on("zoom", updateLabels);
    map.on("idle", updateLabels);
    setTimeout(updateLabels, 300);

    // Map click handler
    map.on("click", async (e) => {
      // If click near system marker → treat as system marker
      const sys = findNearbySystemMarker(e.lngLat.lng, e.lngLat.lat);
      if (sys) {
        setLocationInfo({ name: sys.name, address: `${sys.name}, กรุงเทพมหานคร`, lat: sys.lat, lng: sys.lng });
        setIsClosing(false);

        if (directionsOnRef.current) {
          setDestination({ lat: sys.lat, lng: sys.lng });
          placeABMarker({ lat: sys.lat, lng: sys.lng }, "destination");
          if (origin) routeBetween(origin, { lat: sys.lat, lng: sys.lng });
        } else {
          if (singleMarkerRef.current) singleMarkerRef.current.remove();
          singleMarkerRef.current = new maplibregl.Marker({ color: "#ff4d4f" })
            .setLngLat([sys.lng, sys.lat])
            .addTo(map);
        }
        return;
      }

      // Otherwise: normal click behavior
      if (directionsOnRef.current) {
        if (activeTargetRef.current === "origin") {
          setOrigin({ lat: e.lngLat.lat, lng: e.lngLat.lng });
          placeABMarker(e.lngLat, "origin");
        } else {
          setDestination({ lat: e.lngLat.lat, lng: e.lngLat.lng });
          placeABMarker(e.lngLat, "destination");
        }
      } else {
        // Normal mode → place single marker and show bottom popup from reverse geocode
        if (singleMarkerRef.current) singleMarkerRef.current.remove();
        singleMarkerRef.current = new maplibregl.Marker({ color: "#ff4d4f" })
          .setLngLat(e.lngLat)
          .addTo(map);
        const info = await reverseGeocode(e.lngLat.lat, e.lngLat.lng);
        setLocationInfo(info);
        setIsClosing(false);
      }
    });

    return () => map.remove();
  }, []);

  // Find system marker close to click (pixel space)
  const findNearbySystemMarker = (lng: number, lat: number) => {
    const map = mapRef.current;
    if (!map) return null;
    const clickPx = map.project([lng, lat]);

    let best: { name: string; lat: number; lng: number; d: number } | null = null;
    for (const m of systemMarkersRef.current) {
      const p = map.project([m.lng, m.lat]);
      const dx = p.x - clickPx.x;
      const dy = p.y - clickPx.y;
      const d = Math.hypot(dx, dy);
      if (d <= SYSTEM_PROXIMITY_PX && (!best || d < best.d)) {
        best = { name: m.name, lat: m.lat, lng: m.lng, d };
      }
    }
    return best;
  };

  // Place A/B markers for routing
  const placeABMarker = (pos: LngLat | maplibregl.LngLat, type: "origin" | "destination") => {
    const map = mapRef.current;
    if (!map) return;
    const lat = (pos as any).lat ?? (pos as any).lat;
    const lng = (pos as any).lng ?? (pos as any).lng;

    const markerEl = document.createElement("div");
    markerEl.innerHTML = `<div style="width:24px;height:24px;border-radius:50%;
      background:${type === "origin" ? "#22c55e" : "#ef4444"};
      border:2px solid white;box-shadow:0 0 2px rgba(0,0,0,0.4)"></div>`;

    const marker = new maplibregl.Marker({ element: markerEl })
      .setLngLat([lng, lat])
      .addTo(map);

    if (type === "origin") {
      originMarkerRef.current?.remove();
      originMarkerRef.current = marker;
    } else {
      destMarkerRef.current?.remove();
      destMarkerRef.current = marker;
    }
  };

  // Bottom popup (styled like map.tsx)
  const closeBottomPopup = () => {
    setIsClosing(true);
    setTimeout(() => {
      setLocationInfo(null);
      // Remove only the single (normal) marker; keep routing markers
      singleMarkerRef.current?.remove();
      singleMarkerRef.current = null;
      setIsClosing(false);
    }, 250);
  };

  // Routing via OSRM
  const routeBetween = async (a: LngLat, b: LngLat) => {
    const map = mapRef.current;
    if (!map) return;
    const url = `https://router.project-osrm.org/route/v1/driving/${a.lng},${a.lat};${b.lng},${b.lat}?overview=full&geometries=geojson&steps=true`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      const route = data?.routes?.[0];
      if (!route) return;

      const coords = route.geometry.coordinates;
      const geojson = {
        type: "Feature",
        geometry: { type: "LineString", coordinates: coords },
        properties: {},
      };

      clearRouteLayer();
      map.addSource(ROUTE_SOURCE_ID, { type: "geojson", data: geojson });
      map.addLayer({
        id: ROUTE_LAYER_ID,
        type: "line",
        source: ROUTE_SOURCE_ID,
        paint: { "line-color": "#2563eb", "line-width": 5 },
      });

      const bounds = new maplibregl.LngLatBounds();
      coords.forEach(([lng, lat]: [number, number]) => bounds.extend([lng, lat]));
      map.fitBounds(bounds, { padding: 60 });

      setRouteInfo({
        distanceText: route.distance < 1000 ? `${Math.round(route.distance)} ม.` : `${(route.distance / 1000).toFixed(1)} กม.`,
        durationText: `${Math.round(route.duration / 60)} นาที`,
      });

      const steps: string[] = [];
      for (const leg of route.legs) {
        for (const step of leg.steps) {
          steps.push(`${step.maneuver.type || ""} → ${step.name || "ถนน"} (${Math.round(step.distance)} ม.)`);
        }
      }
      setRouteSteps(steps);
    } catch (e) {
      console.error("Route error:", e);
    }
  };

  const clearRouteLayer = () => {
    const map = mapRef.current;
    if (!map) return;
    if (map.getLayer(ROUTE_LAYER_ID)) map.removeLayer(ROUTE_LAYER_ID);
    if (map.getSource(ROUTE_SOURCE_ID)) map.removeSource(ROUTE_SOURCE_ID);
    setRouteInfo(null);
    setRouteSteps([]);
  };

  // Search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=TH&accept-language=th&limit=5`,
          { headers: { "User-Agent": "MapProject/1.0", "Accept-Language": "th" } }
        );
        const data: Suggestion[] = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Suggestion error:", err);
      }
    };
    const delay = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delay);
  }, [query]);

  const handleSearchSelect = async (s: Suggestion) => {
    const lat = parseFloat(s.lat);
    const lng = parseFloat(s.lon);
    const map = mapRef.current;
    if (!map) return;

    if (directionsOn) {
      if (activeTarget === "origin") {
        setOrigin({ lat, lng });
        placeABMarker({ lat, lng }, "origin");
      } else {
        setDestination({ lat, lng });
        placeABMarker({ lat, lng }, "destination");
      }
      if (origin && destination) routeBetween(origin, destination);
    } else {
      // Normal mode: single marker + bottom popup (reverse geocode)
      singleMarkerRef.current?.remove();
      singleMarkerRef.current = new maplibregl.Marker({ color: "#ff4d4f" }).setLngLat([lng, lat]).addTo(map);
      const info = await reverseGeocode(lat, lng);
      setLocationInfo(info);
      setIsClosing(false);
    }

    setQuery(s.display_name);
    setSuggestions([]);
    map.flyTo({ center: [lng, lat], zoom: 15 });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      const s = suggestions[0];
      handleSearchSelect(s);
    }
  };

  return (
    <div className="w-full h-screen relative font-sans">
      {/* Search & Controls */}
      <form onSubmit={handleSubmit} className="absolute top-6 left-6 z-30 w-96 bg-white/90 p-4 rounded-xl border shadow">
        <div className="flex justify-between mb-2">
          <button
            type="button"
            onClick={() => changeDirectionsOn(!directionsOn)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${directionsOn ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            {directionsOn ? "ปิดโหมดเส้นทาง" : "เปิดโหมดเส้นทาง"}
          </button>
          {directionsOn && (
            <div className="text-xs text-gray-600">
              กำลังตั้ง:{" "}
              <span className="font-medium text-blue-600">{activeTarget === "origin" ? "ต้นทาง (A)" : "ปลายทาง (B)"}</span>
            </div>
          )}
        </div>

        {directionsOn && (
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setActiveTarget("origin")}
              className={`px-3 py-2 rounded-md text-sm border ${activeTarget === "origin" ? "bg-green-600 text-white" : "bg-white border-gray-200"}`}
            >
              ตั้งต้นทาง (A)
            </button>
            <button
              type="button"
              onClick={() => setActiveTarget("destination")}
              className={`px-3 py-2 rounded-md text-sm border ${activeTarget === "destination" ? "bg-red-600 text-white" : "bg-white border-gray-200"}`}
            >
              ตั้งปลายทาง (B)
            </button>
          </div>
        )}

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            placeholder={!directionsOn ? "ค้นหาสถานที่..." : activeTarget === "origin" ? "ค้นหาต้นทาง (A)..." : "ค้นหาปลายทาง (B)..."}
            className="w-full px-4 py-2 text-sm border rounded-lg"
          />
          {isFocused && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 bg-white rounded-lg shadow mt-2 border border-gray-100 max-h-56 overflow-y-auto z-50">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  onClick={() => handleSearchSelect(s)}
                  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer border-b last:border-0"
                >
                  {s.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {directionsOn && (
          <div className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <div>ต้นทาง: {origin ? `${origin.lat.toFixed(4)}, ${origin.lng.toFixed(4)}` : "-"}</div>
              <button
                type="button"
                onClick={() => {
                  originMarkerRef.current?.remove();
                  originMarkerRef.current = null;
                  setOrigin(null);
                  clearRouteLayer();
                }}
                className="text-xs text-red-500 hover:underline"
              >
                เคลียร์
              </button>
            </div>
            <div className="flex justify-between">
              <div>ปลายทาง: {destination ? `${destination.lat.toFixed(4)}, ${destination.lng.toFixed(4)}` : "-"}</div>
              <button
                type="button"
                onClick={() => {
                  destMarkerRef.current?.remove();
                  destMarkerRef.current = null;
                  setDestination(null);
                  clearRouteLayer();
                }}
                className="text-xs text-red-500 hover:underline"
              >
                เคลียร์
              </button>
            </div>

            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => origin && destination && routeBetween(origin, destination)}
                className="flex-1 bg-blue-600 text-white rounded-md py-2 text-sm hover:bg-blue-700 transition"
              >
                คำนวณเส้นทาง
              </button>
              <button
                type="button"
                onClick={clearRouteLayer}
                className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-sm hover:bg-gray-200 transition"
              >
                ล้างเส้นทาง
              </button>
            </div>

            {routeInfo && <div className="pt-2 border-t text-gray-700">ระยะทาง: {routeInfo.distanceText} • เวลา: {routeInfo.durationText}</div>}
          </div>
        )}
      </form>

      {/* Map */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Steps panel */}
      {directionsOn && routeSteps.length > 0 && (
        <div className="absolute bottom-6 left-6 w-80 max-h-60 overflow-y-auto bg-white/90 rounded-xl border border-gray-200 p-3 text-sm shadow">
          <div className="font-medium mb-2">เส้นทาง</div>
          <ol className="list-decimal list-inside space-y-1">
            {routeSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Bottom popup (from map.tsx style) */}
      {locationInfo && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 bottom-20 w-[90%] max-w-sm 
                      bg-white rounded-2xl shadow-lg border border-gray-100 p-5
                      transition-all duration-300 ease-out z-20
                      ${isClosing ? "opacity-0 translate-y-4 scale-95" : "opacity-100 translate-y-0 scale-100"}`}
        >
          <button
            onClick={closeBottomPopup}
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
