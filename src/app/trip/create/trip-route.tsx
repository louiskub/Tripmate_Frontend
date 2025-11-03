"use client"

// 1. [เพิ่ม] import useState และ icons
import React from "react"
import { useEffect, useRef, useState } from "react" 
import maplibregl, { LngLatLike, Map } from "maplibre-gl"
// 👈 [เพิ่ม] ChevronDown สำหรับ Dropdown
import { X, Calendar, Clock, Navigation, ChevronDown } from "lucide-react" 

// Prop types (เหมือนเดิม)
interface TripEventPoint {
  lat: number;
  lng: number;
  title: string;
  time: string;
  date: string;
}

interface TripRouteDisplayProps {
  events: TripEventPoint[];
  onClose: () => void;
}

// ----------------------------------------------------
// 2. [เพิ่ม] Constants จากโค้ดตัวอย่างของคุณ
// ----------------------------------------------------
const ROUTE_SOURCE_ID = "trip-route-source";
const ROUTE_LAYER_ID = "trip-route-line";
// 👈 [REQ 1] สีสำหรับแต่ละจุดและเส้นทาง
const LEG_COLORS = ["#3883F8", "#F59E0B", "#E11D48", "#16A34A", "#9333EA", "#0891B2"];


// ----------------------------------------------------
// 3. [แก้ไข] อัปเกรด drawRoute ให้ตรงตามโจทย์
// ----------------------------------------------------
function translateInstruction(text: string): string {
  let t = text.trim();

  // คำสั่งเริ่มออกทาง
  t = t
    .replace(/\bleft depart\b/gi, "เริ่มออกทางซ้าย")
    .replace(/\bright depart\b/gi, "เริ่มออกทางขวา");

  // ทางแยก (fork)
  t = t
    .replace(/\bslight left fork\b/gi, "แยกซ้ายเล็กน้อย")
    .replace(/\bslight right fork\b/gi, "แยกขวาเล็กน้อย")
    .replace(/\bleft fork\b/gi, "แยกซ้าย")
    .replace(/\bright fork\b/gi, "แยกขวา");

  // สิ้นสุดถนน
  t = t
    .replace(/\bleft end of road\b/gi, "สิ้นสุดถนนแล้วเลี้ยวซ้าย")
    .replace(/\bright end of road\b/gi, "สิ้นสุดถนนแล้วเลี้ยวขวา");

  // เลี้ยวปกติ
  t = t
    .replace(/\bslight left turn\b/gi, "เลี้ยวซ้ายเล็กน้อย")
    .replace(/\bslight right turn\b/gi, "เลี้ยวขวาเล็กน้อย")
    .replace(/\bleft turn\b/gi, "เลี้ยวซ้าย")
    .replace(/\bright turn\b/gi, "เลี้ยวขวา");

  // ทางตรงหรือชื่อถนนใหม่
  t = t
    .replace(/\bstraight new name\b/gi, "ตรงไป (เปลี่ยนชื่อถนนใหม่)")
    .replace(/\bstraight turn\b/gi, "ตรงไป");

  // ถึงจุดหมาย
  t = t
    .replace(/\bleft arrive\b/gi, "ถึงจุดหมายทางซ้าย")
    .replace(/\bright arrive\b/gi, "ถึงจุดหมายทางขวา")
    .replace(/\barrive\b/gi, "ถึงจุดหมาย");

  // คำเชื่อม
  t = t.replace(/\bon\b/gi, "บน");
  t = t.replace(/\b(m)\b/gi, "เมตร");

  return t;
}

// const translateType = (instruction) => {
//   return instruction
//     .replace(/\bdepart\b/gi, "เริ่มออกทาง")
//     .replace(/\bleft turn\b/gi, "เลี้ยวซ้าย")
//     .replace(/\ left turn\b/gi, "เลี้ยวซ้ายเล็กน้อย")
//     .replace(/\ arrive\b/gi, "ถึงจุดหมายทางซ้าย");

// }

const drawRoute = async (map: Map, points: TripEventPoint[]): Promise<any[]> => {
  if (points.length < 2) return [];
  
  const coordsString = points.map(p => `${p.lng},${p.lat}`).join(';');
  // 👈 [REQ 2] เพิ่ม 'steps=true' เพื่อดึงข้อมูล turn-by-turn
  const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson&annotations=duration,distance&steps=true`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    const route = data?.routes?.[0];
    if (!route) return [];

    // --- ลบเส้นทางเก่า (สำคัญมาก) ---
    const style = map.getStyle();
    if (style && style.layers) {
        style.layers.map(layer => layer.id)
            .filter(id => id.startsWith(ROUTE_LAYER_ID))
            .forEach(id => { if (map.getLayer(id)) map.removeLayer(id) });
    }
    if (style && style.sources) {
        Object.keys(style.sources)
            .filter(id => id.startsWith(ROUTE_SOURCE_ID))
            .forEach(id => { if (map.getSource(id)) map.removeSource(id) });
    }
    // --- สิ้นสุดการลบ ---

    // 👈 [REQ 1] วนลูปสร้าง Layer แยกสี
    route.legs.forEach((leg: any, index: number) => {
      const legCoords = leg.steps.flatMap((step: any) => step.geometry.coordinates);
      if (legCoords.length === 0) return;
      
      const sourceId = `${ROUTE_SOURCE_ID}-${index}`;
      const layerId = `${ROUTE_LAYER_ID}-${index}`;
      const color = LEG_COLORS[index % LEG_COLORS.length]; // 👈 เลือกสี
      
      const geojson = {
        type: "Feature" as const,
        geometry: { type: "LineString" as const, coordinates: legCoords },
        properties: {},
      };
      
      map.addSource(sourceId, { type: "geojson", data: geojson });
      map.addLayer({
        id: layerId,
        type: "line",
        source: sourceId,
        paint: {
          "line-color": color, // 👈 ใช้สีที่เลือก
          "line-width": 6,
          "line-opacity": 0.85,
        },
        layout: { "line-join": "round", "line-cap": "round" }
      });
    });

    // 👇 [เรียกแปลคำสั่งที่นี่ก่อน return]
    route.legs.forEach((leg: any) => {
      // console.log("route", leg.steps)
      leg.steps.forEach((step: any) => {
        // console.log(step.maneuver)
        // step.maneuver.modifier = ""
        // step.maneuver.type = ""
        // if (step.maneuver && step.maneuver.instruction) {
        //   step.maneuver.instruction = translateInstruction(step.maneuver.instruction);
        // }
      });
    });

    return route.legs || []; // 👈 [REQ 2] return 'legs' ที่มี 'steps'

  } catch (e) { 
    console.error("Route draw error:", e); 
    return [];
  }
}

// ----------------------------------------------------
// 4. [แก้ไข] เพิ่ม State และอัปเกรด Component
// ----------------------------------------------------
export default function TripRouteDisplay({ events, onClose }: TripRouteDisplayProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<Map | null>(null)
  const markersRef = useRef<maplibregl.Marker[]>([]); 
  
  const [routeLegs, setRouteLegs] = useState<any[]>([]);
  // 👈 [REQ 3] State สำหรับเก็บว่า Dropdown ไหนกำลังเปิดอยู่
  const [openLegIndex, setOpenLegIndex] = useState<number | null>(null);

  
  // Effect "สร้างแผนที่" (เหมือนเดิม)
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return; 

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.stadiamaps.com/styles/osm_bright.json",
      center: [100.5231, 13.7367],
      zoom: 9,
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.on('error', (e) => console.error("MapLibre Error:", e));

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); 

  
  // Effect "อัปเดตข้อมูล" (async)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !events) return; 

    const updateMapData = async () => { 
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      if (events.length === 0) {
        setRouteLegs([]); 
        return; 
      }

      const newMarkers: maplibregl.Marker[] = [];
      events.forEach((event, index) => {
        
        // 👈 [REQ 1] เลือกสีสำหรับ Marker
        const color = LEG_COLORS[index % LEG_COLORS.length];
        
        const popupContent = `...`; // (โค้ด Popup เหมือนเดิม)
        const markerEl = document.createElement("div");

        // 👈 [REQ 1] ใส่สีลงใน HTML ของ Marker
        markerEl.innerHTML = `
          <div style="
            width: 30px; height: 30px; border-radius: 50%;
            background: ${color}; 
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            display: flex; align-items: center; justify-content: center;
            font-weight: 700; font-size: 14px;
            color: white; cursor: pointer;
          ">
            ${index + 1}
          </div>
        `;
        
        // (ส่วนที่สร้าง Marker และ Popup - คัดลอกมาจากโค้ดเดิมของคุณได้เลย)
        // ... (โค้ดนี้เหมือนเดิม)
        const popup = new maplibregl.Popup({ offset: 35, closeButton: false })
          .setHTML(`
            <div style="font-family: sans-serif; padding: 5px; max-width: 200px;">
              <strong style="font-size: 14px; color: #333;">${event.title}</strong>
              <p style="font-size: 12px; margin: 4px 0; color: #555;">
                ${event.date} (${event.time})
              </p>
            </div>
          `);
        // ...
        
        const marker = new maplibregl.Marker({ element: markerEl })
          .setLngLat([event.lng, event.lat])
          .setPopup(popup)
          .addTo(map);
        
        newMarkers.push(marker);
      });
      markersRef.current = newMarkers; 

      let legs: any[] = [];
      if (events.length > 1) {
        legs = await drawRoute(map, events); 
      }
      setRouteLegs(legs); // 👈 [REQ 2] เก็บข้อมูล legs (ที่มี steps)

      const bounds = new maplibregl.LngLatBounds();
      events.forEach(p => bounds.extend([p.lng, p.lat]));
      if (events.length > 0) {
        map.fitBounds(bounds, { padding: 60 });
      }
    };

    if (map.isStyleLoaded()) {
      updateMapData();
    } else {
      map.once('load', updateMapData);
    }

  }, [events]); 

  
  // ----------------------------------------------------
  // 5. [แก้ไข] JSX ทั้งหมด (เพิ่ม Dropdown)
  // ----------------------------------------------------
  return (
    <div className="w-full h-full relative flex">
      
      {/* Sidebar (แผงข้อมูลด้านซ้าย) */}
      <aside className="w-full max-w-sm md:w-[360px] h-full bg-white shadow-xl z-10 flex flex-col">
        {/* Header (เหมือนเดิม) */}
        <header className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800">แผนการเดินทาง</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-800 transition-all"
            aria-label="Close map"
          >
            <X size={22} />
          </button>
        </header>
        
        {/* รายการกิจกรรม (List) */}
        <div className="flex-1 overflow-y-auto">
          <ol> 
            {events.map((event, index) => {
              const leg = routeLegs[index]; 
              const distanceKm = (leg?.distance / 1000).toFixed(1);
              const durationMin = Math.round(leg?.duration / 60);
              
              // 👈 [REQ 1] เลือกสีสำหรับจุดนี้
              const color = LEG_COLORS[index % LEG_COLORS.length];
              const isDropdownOpen = openLegIndex === index;

              return (
                <React.Fragment key={index}> 
                  
                  {/* === 1. ตัวกิจกรรม (Event Item) === */}
                  <li className="p-4 flex gap-4 hover:bg-gray-50">
                    {/* [REQ 1] หมายเลข (ใส่สี) */}
                    <div 
                      className="flex-shrink-0 w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm shadow"
                      style={{ backgroundColor: color }} // 👈 ใส่สีที่นี่
                    >
                      {index + 1}
                    </div>
                    {/* รายละเอียด (เหมือนเดิม) */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate" title={event.title}>
                        {event.title}
                      </p>
                      <div className="text-sm text-gray-600 flex items-center gap-1.5 mt-1">
                        <Calendar size={14} className="flex-shrink-0" />
                        <span>{event.date}</span>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-1.5 mt-1">
                        <Clock size={14} className="flex-shrink-0" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                  </li>

                  {/* === 2. ข้อมูลการเดินทาง (Travel Leg Item) [แก้ไข] === */}
                  {leg && ( 
                    <React.Fragment>
                      {/* [REQ 3] ปุ่มสำหรับเปิด/ปิด Dropdown */}
                      <li 
                        className="p-4 pl-16 flex items-center justify-between border-t border-gray-100 bg-blue-50/50 cursor-pointer hover:bg-blue-100/50"
                        onClick={() => setOpenLegIndex(isDropdownOpen ? null : index)} // 👈 ควบคุม state
                      >
                        <div className="flex gap-4">
                          {/* เส้นประ */}
                          <div className="w-8 flex justify-center -translate-x-4">
                            <div className="border-l-2 border-dashed border-gray-300 h-full"></div>
                          </div>
                          {/* รายละเอียดการเดินทาง */}
                          <div className="flex-1 min-w-0 -ml-4">
                            {/* [REQ 1] ใส่สีที่ตัวหนังสือ */}
                            <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: color }}>
                              <Navigation size={14} className="flex-shrink-0" />
                              <span>
                                {distanceKm} กม.
                                <span className="text-gray-500 font-normal px-1.5">•</span>
                                {durationMin} นาที
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              (เดินทางไปยังจุด {index + 2})
                            </p>
                          </div>
                        </div>
                        {/* [REQ 3] ไอคอนลูกศร Dropdown */}
                        <ChevronDown 
                          size={20} 
                          className="text-gray-500 transition-transform flex-shrink-0"
                          style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        />
                      </li>
                      
                      {/* [REQ 2 & 3] ส่วนของ Dropdown ที่ซ่อนอยู่ */}
                      {isDropdownOpen && (
                        <li className="pl-20 pr-4 pb-4 bg-blue-50/50 border-t border-gray-100">
                          <h4 className="font-semibold text-sm text-gray-800 mb-2">รายละเอียดการเดินทาง:</h4>
                          {/* 👈 [REQ 2] แสดง Steps */}
                          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                            {leg.steps.map((step: any, stepIndex: number) => (
                              <li key={stepIndex}>
                                {/* {step.maneuver.modifier ? `${step.maneuver.modifier} ` : ''} */}
                                {/* {step.maneuver.type} */}
                                {/* {console.log(`Hello: ${step.maneuver.modifier ? `${step.maneuver.modifier} ` : ''}${step.maneuver.type}`)} */}
                                {translateInstruction(`${step.maneuver.modifier ? `${step.maneuver.modifier} ` : ''}${step.maneuver.type}`)}
                                {/* {`${step.maneuver.modifier ? `${step.maneuver.modifier} ` : ''}${step.maneuver.type}`} */}
                                {step.name ? ` บน ${step.name}` : ''}
                                <span className="text-gray-500"> ({Math.round(step.distance)} ม.)</span>
                              </li>
                            ))}
                          </ol>
                        </li>
                      )}
                    </React.Fragment>
                  )}
                </React.Fragment>
              )
            })}
            
            {events.length === 0 && (
                <li className="p-4 text-center text-gray-500">ไม่มีกิจกรรมที่มีพิกัด</li>
            )}
          </ol>
        </div>
      </aside>

      {/* Map Container (เหมือนเดิม) */}
      <div className="flex-1 h-full relative">
        <div ref={mapContainer} className="w-full h-full" />
      </div>
    </div>
  )
}