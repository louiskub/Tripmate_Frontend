"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { MapPin, Navigation, X, Search, Route } from "lucide-react"
import { renderToString } from "react-dom/server"

import MyHotelIcon from "@/assets/icons/hotel.svg"
import MyRestaurantIcon from "@/assets/icons/restaurant-fill.svg"
import MyAttractionIcon from "@/assets/icons/attractions.svg"

type MarkerCategory = "hotel" | "restaurant" | "attraction"

type SystemMarker = {
  name: string
  category: MarkerCategory
  lat: number
  lng: number
}

type Suggestion = {
  display_name: string
  lat: string
  lon: string
}

type LngLat = { lat: number; lng: number }

type PopupInfo = {
  name: string
  address?: string
  lat: number
  lng: number
}

export default function FinalMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)

  // Markers & overlays
  const originMarkerRef = useRef<maplibregl.Marker | null>(null)
  const destMarkerRef = useRef<maplibregl.Marker | null>(null)
  const singleMarkerRef = useRef<maplibregl.Marker | null>(null)
  const myLocationRef = useRef<maplibregl.Marker | null>(null)
  const waypointMarkersRef = useRef<maplibregl.Marker[]>([])

  // System marker overlays to manage labels
  const systemMarkersRef = useRef<
    {
      markerEl: HTMLDivElement
      label: HTMLSpanElement
      lat: number
      lng: number
      name: string
      category: MarkerCategory
    }[]
  >([])

  // Routing state (keep refs so map handlers don't recreate map)
  const directionsOnRef = useRef(false)
  const activeTargetRef = useRef<"origin" | "destination" | "waypoint">("destination")

  const [activeTab, setActiveTab] = useState<"search" | "route">("search")
  const [directionsOn, setDirectionsOn] = useState(false)
  const [activeTarget, setActiveTarget] = useState<"origin" | "destination" | "waypoint">("destination")
  const [origin, setOrigin] = useState<LngLat | null>(null)
  const [destination, setDestination] = useState<LngLat | null>(null)
  const [waypoints, setWaypoints] = useState<LngLat[]>([])
  const [routeInfo, setRouteInfo] = useState<{ distanceText: string; durationText: string } | null>(null)
  const [routeSteps, setRouteSteps] = useState<string[]>([])

  // Search state
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isFocused, setIsFocused] = useState(false)

  // Bottom popup state (style from map.tsx)
  const [locationInfo, setLocationInfo] = useState<PopupInfo | null>(null)
  const [isClosing, setIsClosing] = useState(false)

  // Constants
  const ROUTE_SOURCE_ID = "route-source"
  const ROUTE_LAYER_ID = "route-line"
  const SYSTEM_PROXIMITY_PX = 24

  const categoryStyles: Record<MarkerCategory, { icon: string; color: string }> = {
    hotel: { icon: MyHotelIcon, color: "#3B82F6" },
    restaurant: { icon: MyRestaurantIcon, color: "#EF4444" },
    attraction: { icon: MyAttractionIcon, color: "#10B981" },
  }

  // 🧭 ดึงตำแหน่งผู้ใช้
  const fetchUserLocation = () => {
    if (!navigator.geolocation) {
      alert("เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง (Geolocation)")
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        const map = mapRef.current
        if (!map) return

        myLocationRef.current?.remove()

        const el = document.createElement("div")
        el.innerHTML = `<div style="
          width:20px;height:20px;border-radius:50%;
          background:#3883F8;border:3px solid white;
          box-shadow:0 0 10px rgba(56,131,248,0.8);
        "></div>`

        myLocationRef.current = new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map)

        map.flyTo({ center: [lng, lat], zoom: 15 })

        if (directionsOnRef.current) {
          setOrigin({ lat, lng })
          placeABMarker({ lat, lng }, "origin")
        }
      },
      (err) => {
        console.error("ไม่สามารถดึงตำแหน่งได้:", err)
        alert("ไม่สามารถเข้าถึงตำแหน่งของคุณได้ กรุณาอนุญาตการเข้าถึงตำแหน่ง")
      },
    )
  }

  const changeDirectionsOn = (value: boolean) => {
    setDirectionsOn(value)
    if (value == false) {
      destMarkerRef.current?.remove()
      destMarkerRef.current = null
      setDestination(null)
      originMarkerRef.current?.remove()
      originMarkerRef.current = null
      setOrigin(null)

      setWaypoints([])
      waypointMarkersRef.current.forEach((marker) => marker.remove())
      waypointMarkersRef.current = []

      clearRouteLayer()
    } else {
      fetchUserLocation()
    }
  }

  useEffect(() => {
    directionsOnRef.current = directionsOn
  }, [directionsOn])
  useEffect(() => {
    activeTargetRef.current = activeTarget
  }, [activeTarget])

  const reverseGeocode = async (lat: number, lon: number): Promise<PopupInfo> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16&accept-language=th`,
        { headers: { "User-Agent": "MapProject/1.0", "Accept-Language": "th" } },
      )
      const data = await res.json()
      return {
        name: data.display_name?.split(",")[0] || "ไม่ทราบชื่อสถานที่",
        address: data.display_name,
        lat,
        lng: lon,
      }
    } catch {
      return { name: "ไม่ทราบชื่อสถานที่", lat, lng: lon }
    }
  }

  useEffect(() => {
    if (!mapContainer.current) return

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.stadiamaps.com/styles/osm_bright.json",
      center: [100.5231, 13.7367],
      zoom: 13,
    })
    mapRef.current = map
    map.addControl(new maplibregl.NavigationControl(), "top-right")

    fetchUserLocation()

    const systemPoints: SystemMarker[] = [
      { name: "โรงแรม The River", category: "hotel", lat: 13.7367, lng: 100.5231 },
      { name: "ร้านอาหารครัวบางรัก", category: "restaurant", lat: 13.745, lng: 100.53 },
      { name: "สวนลุมพินี", category: "attraction", lat: 13.7302, lng: 100.5417 },
    ]

    const renderIconToString = (IconComp: any, color: string, size = 22) =>
      renderToString(<IconComp color={color} width={size} height={size} />)

    systemPoints.forEach((m) => {
      const { icon, color } = categoryStyles[m.category]
      const markerEl = document.createElement("div")
      markerEl.innerHTML = renderIconToString(icon, color, 40)

      markerEl.addEventListener("mouseenter", () => {
        const pin = markerEl.querySelector("div") as HTMLElement
        if (pin) pin.style.transform = "rotate(-45deg) scale(1.15)"
      })

      markerEl.addEventListener("mouseleave", () => {
        const pin = markerEl.querySelector("div") as HTMLElement
        if (pin) pin.style.transform = "rotate(-45deg) scale(1)"
      })

      const label = document.createElement("span")
      label.textContent = m.name
      Object.assign(label.style, {
        position: "absolute",
        background: "white",
        color: "#303030",
        fontSize: "13px",
        fontWeight: "500",
        padding: "6px 12px",
        borderRadius: "8px",
        border: "none",
        transformOrigin: "center top",
        transform: "translate(-50%, 24px)",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        transition: "transform 0.2s ease, opacity 0.25s ease",
        opacity: "0",
      } as CSSStyleDeclaration)

      new maplibregl.Marker({ element: markerEl }).setLngLat([m.lng, m.lat]).addTo(map)
      map.getContainer().appendChild(label)
      systemMarkersRef.current.push({ markerEl, label, lat: m.lat, lng: m.lng, name: m.name, category: m.category })

      markerEl.addEventListener("click", (e) => {
        e.stopPropagation()
        setLocationInfo({ name: m.name, address: `${m.name}, กรุงเทพมหานคร`, lat: m.lat, lng: m.lng })
        setIsClosing(false)

        if (directionsOnRef.current) {
          const pos = { lat: m.lat, lng: m.lng }
          setDestination(pos)
          placeABMarker(pos, "destination")
          if (origin) {
            const allPoints = [origin, ...waypoints, pos]
            routeBetween(allPoints)
          }
        } else {
          if (singleMarkerRef.current) singleMarkerRef.current.remove()
          singleMarkerRef.current = new maplibregl.Marker({ color: "#FF2121" }).setLngLat([m.lng, m.lat]).addTo(map)
        }
      })
    })

    const updateLabels = () => {
      const zoom = map.getZoom()
      const normalized = Math.max(0, Math.min(1, (zoom - 3) / 12))
      const eased = Math.pow(normalized, 1.25)
      const scale = Math.max(0.1, Math.min(1.2, eased))
      const offset = 30 * scale

      systemMarkersRef.current.forEach(({ lat, lng, label, markerEl }) => {
        const pos = map.project([lng, lat])
        label.style.left = `${pos.x}px`
        label.style.top = `${pos.y - offset}px`
        label.style.transform = `translate(-50%, -50%) scale(${scale})`
        label.style.opacity = zoom < 10 ? "0" : "1"
        ;(markerEl.style as any).display = zoom < 10 ? "none" : "block"
      })
    }
    map.on("move", updateLabels)
    map.on("zoom", updateLabels)
    map.on("idle", updateLabels)
    setTimeout(updateLabels, 300)

    map.on("click", async (e) => {
      const sys = findNearbySystemMarker(e.lngLat.lng, e.lngLat.lat)
      if (sys) {
        setLocationInfo({ name: sys.name, address: `${sys.name}, กรุงเทพมหานคร`, lat: sys.lat, lng: sys.lng })
        setIsClosing(false)

        if (directionsOnRef.current) {
          setDestination({ lat: sys.lat, lng: sys.lng })
          placeABMarker({ lat: sys.lat, lng: sys.lng }, "destination")
          if (origin) {
            const allPoints = [origin, ...waypoints, { lat: sys.lat, lng: sys.lng }]
            routeBetween(allPoints)
          }
        } else {
          if (singleMarkerRef.current) singleMarkerRef.current.remove()
          singleMarkerRef.current = new maplibregl.Marker({ color: "#FF2121" }).setLngLat([sys.lng, sys.lat]).addTo(map)
        }
        return
      }

      if (directionsOnRef.current) {
        const pos = { lat: e.lngLat.lat, lng: e.lngLat.lng }

        if (activeTargetRef.current === "origin") {
          setOrigin(pos)
          placeABMarker(e.lngLat, "origin")
        } else if (activeTargetRef.current === "destination") {
          setDestination(pos)
          placeABMarker(e.lngLat, "destination")
        } else {
          setWaypoints((prev) => [...prev, pos])
        }
      } else {
        if (singleMarkerRef.current) singleMarkerRef.current.remove()
        singleMarkerRef.current = new maplibregl.Marker({ color: "#FF2121" }).setLngLat(e.lngLat).addTo(map)
        const info = await reverseGeocode(e.lngLat.lat, e.lngLat.lng)
        setLocationInfo(info)
        setIsClosing(false)
      }
    })

    return () => map.remove()
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !directionsOn) return

    waypointMarkersRef.current.forEach((marker) => marker.remove())
    waypointMarkersRef.current = []

    const newMarkers = waypoints.map((wp, index) => {
      const markerEl = document.createElement("div")
      markerEl.innerHTML = `
        <div style="
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #F59E0B;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          color: white;
        ">${index + 1}</div>
      `
      const marker = new maplibregl.Marker({ element: markerEl }).setLngLat([wp.lng, wp.lat]).addTo(map)
      return marker
    })

    waypointMarkersRef.current = newMarkers
  }, [waypoints, directionsOn])

  const findNearbySystemMarker = (lng: number, lat: number) => {
    const map = mapRef.current
    if (!map) return null
    const clickPx = map.project([lng, lat])

    let best: { name: string; lat: number; lng: number; d: number } | null = null
    for (const m of systemMarkersRef.current) {
      const p = map.project([m.lng, m.lat])
      const dx = p.x - clickPx.x
      const dy = p.y - clickPx.y
      const d = Math.hypot(dx, dy)
      if (d <= SYSTEM_PROXIMITY_PX && (!best || d < best.d)) {
        best = { name: m.name, lat: m.lat, lng: m.lng, d }
      }
    }
    return best
  }

  const placeABMarker = (pos: LngLat | maplibregl.LngLat, type: "origin" | "destination") => {
    const map = mapRef.current
    if (!map) return
    const lat = (pos as any).lat ?? (pos as any).lat
    const lng = (pos as any).lng ?? (pos as any).lng

    const markerEl = document.createElement("div")
    markerEl.innerHTML = `
      <div style="
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: ${type === "origin" ? "#47DE36" : "#FF2121"};
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 14px;
        color: white;
      ">${type === "origin" ? "A" : "B"}</div>
    `

    const marker = new maplibregl.Marker({ element: markerEl }).setLngLat([lng, lat]).addTo(map)

    if (type === "origin") {
      originMarkerRef.current?.remove()
      originMarkerRef.current = marker
    } else {
      destMarkerRef.current?.remove()
      destMarkerRef.current = marker
    }
  }

  const closeBottomPopup = () => {
    setIsClosing(true)
    setTimeout(() => {
      setLocationInfo(null)
      singleMarkerRef.current?.remove()
      singleMarkerRef.current = null
      setIsClosing(false)
    }, 250)
  }

  const routeBetween = async (allPoints: LngLat[]) => {
    const map = mapRef.current
    if (!map || allPoints.length < 2) return

    const coordsString = allPoints.map((p) => `${p.lng},${p.lat}`).join(";")
    const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson&steps=true`

    try {
      const res = await fetch(url)
      const data = await res.json()
      const route = data?.routes?.[0]
      if (!route) return

      clearRouteLayer()

      const LEG_COLORS = ["#3883F8", "#F59E0B", "#FF2121", "#47DE36", "#9333EA"]

      const bounds = new maplibregl.LngLatBounds()

      route.legs.forEach((leg: any, index: number) => {
        const legCoords = leg.steps.flatMap((step: any) => step.geometry.coordinates)

        if (legCoords.length === 0) return

        const sourceId = `${ROUTE_SOURCE_ID}-${index}`
        const layerId = `${ROUTE_LAYER_ID}-${index}`

        const color = LEG_COLORS[index % LEG_COLORS.length]

        const geojson = {
          type: "Feature",
          geometry: { type: "LineString", coordinates: legCoords },
          properties: {},
        }

        map.addSource(sourceId, { type: "geojson", data: geojson as any })
        map.addLayer({
          id: layerId,
          type: "line",
          source: sourceId,
          paint: {
            "line-color": color,
            "line-width": 6,
            "line-opacity": 0.85,
          },
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
        })

        legCoords.forEach(([lng, lat]: [number, number]) => bounds.extend([lng, lat]))
      })

      map.fitBounds(bounds, { padding: 80 })

      setRouteInfo({
        distanceText:
          route.distance < 1000 ? `${Math.round(route.distance)} ม.` : `${(route.distance / 1000).toFixed(1)} กม.`,
        durationText: `${Math.round(route.duration / 60)} นาที`,
      })

      const steps: string[] = []
      for (const leg of route.legs) {
        for (const step of leg.steps) {
          steps.push(`${step.maneuver.type || ""} → ${step.name || "ถนน"} (${Math.round(step.distance)} ม.)`)
        }
      }
      setRouteSteps(steps)

      setActiveTab("route")
    } catch (e) {
      console.error("Route error:", e)
    }
  }

  const clearRouteLayer = () => {
    const map = mapRef.current
    if (!map) return

    const style = map.getStyle()
    if (!style || !style.layers) {
      setRouteInfo(null)
      setRouteSteps([])
      return
    }

    const layerIds = style.layers.map((layer) => layer.id).filter((id) => id.startsWith(ROUTE_LAYER_ID))

    layerIds.forEach((id) => {
      if (map.getLayer(id)) {
        map.removeLayer(id)
      }
    })

    const sourceIds = Object.keys(style.sources).filter((id) => id.startsWith(ROUTE_SOURCE_ID))

    sourceIds.forEach((id) => {
      if (map.getSource(id)) {
        map.removeSource(id)
      }
    })

    setRouteInfo(null)
    setRouteSteps([])
  }

  const calculateFullRoute = () => {
    if (!origin || !destination) return

    const allPoints = [origin, ...waypoints, destination]
    routeBetween(allPoints)
  }

  const removeWaypoint = (indexToRemove: number) => {
    setWaypoints((prev) => prev.filter((_, index) => index !== indexToRemove))
    clearRouteLayer()
  }

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([])
        return
      }
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=TH&accept-language=th&limit=5`,
          { headers: { "User-Agent": "MapProject/1.0", "Accept-Language": "th" } },
        )
        const data: Suggestion[] = await res.json()
        setSuggestions(data)
      } catch (err) {
        console.error("Suggestion error:", err)
      }
    }
    const delay = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(delay)
  }, [query])

  const handleSearchSelect = async (s: Suggestion) => {
    const lat = Number.parseFloat(s.lat)
    const lng = Number.parseFloat(s.lon)
    const map = mapRef.current
    if (!map) return

    if (directionsOn) {
      if (activeTarget === "origin") {
        setOrigin({ lat, lng })
        placeABMarker({ lat, lng }, "origin")
      } else if (activeTarget === "destination") {
        setDestination({ lat, lng })
        placeABMarker({ lat, lng }, "destination")
      } else {
        setWaypoints((prev) => [...prev, { lat, lng }])
      }
    } else {
      singleMarkerRef.current?.remove()
      singleMarkerRef.current = new maplibregl.Marker({ color: "#FF2121" }).setLngLat([lng, lat]).addTo(map)
      const info = await reverseGeocode(lat, lng)
      setLocationInfo(info)
      setIsClosing(false)
    }

    setQuery(s.display_name)
    setSuggestions([])
    map.flyTo({ center: [lng, lat], zoom: 15 })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (suggestions.length > 0) {
      const s = suggestions[0]
      handleSearchSelect(s)
    }
  }

  return (
    <div className="w-full h-screen relative font-sans bg-[#F7F7F9]">
      <div className="absolute top-5 left-5 z-30 w-[420px] bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.15)] overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-gray-100">
          <button
            type="button"
            onClick={() => setActiveTab("search")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-[14px] font-medium transition-all ${
              activeTab === "search"
                ? "text-[#3883F8] border-b-2 border-[#3883F8] bg-[#F0F7FF]"
                : "text-gray-500 hover:text-[#303030] hover:bg-[#F7F7F9]"
            }`}
          >
            <Search size={18} />
            ค้นหา
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("route")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-[14px] font-medium transition-all ${
              activeTab === "route"
                ? "text-[#3883F8] border-b-2 border-[#3883F8] bg-[#F0F7FF]"
                : "text-gray-500 hover:text-[#303030] hover:bg-[#F7F7F9]"
            }`}
          >
            <Route size={18} />
            เส้นทาง
            {routeSteps.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-[#3883F8] text-white text-[11px] font-bold rounded-full">
                {routeSteps.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto custom-scroll-bar">
          {/* Search Tab Content */}
          {activeTab === "search" && (
            <form onSubmit={handleSubmit}>
              {/* Search input section */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 150)}
                  placeholder={
                    !directionsOn
                      ? "ค้นหาสถานที่..."
                      : activeTarget === "origin"
                        ? "ค้นหาต้นทาง (A)..."
                        : activeTarget === "destination"
                          ? "ค้นหาปลายทาง (B)..."
                          : "ค้นหาจุดแวะ..."
                  }
                  className="w-full pl-12 pr-4 py-4 text-[15px] text-[#303030] placeholder:text-gray-400 border-none outline-none focus:outline-none"
                />
                {isFocused && suggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 top-full bg-white rounded-b-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] max-h-64 overflow-y-auto z-50 custom-scroll-bar">
                    {suggestions.map((s, i) => (
                      <li
                        key={i}
                        onClick={() => handleSearchSelect(s)}
                        className="px-4 py-3 text-[14px] text-[#303030] hover:bg-[#F7F7F9] cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <MapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="leading-relaxed">{s.display_name}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Directions toggle */}
              <div className="px-4 py-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => changeDirectionsOn(!directionsOn)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[14px] font-medium transition-all ${
                    directionsOn
                      ? "bg-[#3883F8] text-white shadow-sm hover:bg-[#216CE1]"
                      : "bg-[#F7F7F9] text-[#303030] hover:bg-[#E0E0E0]"
                  }`}
                >
                  <Route size={18} />
                  {directionsOn ? "ปิดโหมดเส้นทาง" : "เปิดโหมดเส้นทาง"}
                </button>
              </div>

              {/* Directions controls */}
              {directionsOn && (
                <div className="px-4 pb-4 space-y-3">
                  {/* Target selector */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTarget("origin")}
                      className={`flex-1 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                        activeTarget === "origin"
                          ? "bg-[#47DE36] text-white shadow-sm"
                          : "bg-[#F7F7F9] text-[#303030] hover:bg-[#E0E0E0]"
                      }`}
                    >
                      ตั้งต้นทาง (A)
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTarget("waypoint")}
                      className={`flex-1 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                        activeTarget === "waypoint"
                          ? "bg-yellow-500 text-white shadow-sm"
                          : "bg-[#F7F7F9] text-[#303030] hover:bg-[#E0E0E0]"
                      }`}
                    >
                      เพิ่มจุดแวะ
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTarget("destination")}
                      className={`flex-1 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                        activeTarget === "destination"
                          ? "bg-[#FF2121] text-white shadow-sm"
                          : "bg-[#F7F7F9] text-[#303030] hover:bg-[#E0E0E0]"
                      }`}
                    >
                      ตั้งปลายทาง (B)
                    </button>
                  </div>

                  {/* Origin/Destination display */}
                  <div className="space-y-2 text-[13px]">
                    <div className="flex items-center justify-between p-2.5 bg-[#F7F7F9] rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#47DE36] flex items-center justify-center text-white text-[11px] font-bold">
                          A
                        </div>
                        <span className="text-[#303030]">
                          {origin ? `${origin.lat.toFixed(4)}, ${origin.lng.toFixed(4)}` : "ยังไม่ได้เลือกต้นทาง"}
                        </span>
                      </div>
                      {origin && (
                        <button
                          type="button"
                          onClick={() => {
                            originMarkerRef.current?.remove()
                            originMarkerRef.current = null
                            setOrigin(null)
                            clearRouteLayer()
                          }}
                          className="text-[#FF2121] hover:text-[#950606] transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>

                    {waypoints.map((wp, index) => (
                      <div key={index} className="flex items-center justify-between p-2.5 bg-[#F7F7F9] rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center text-white text-[11px] font-bold">
                            {index + 1}
                          </div>
                          <span className="text-[#303030] text-[13px]">
                            {`จุดแวะ: ${wp.lat.toFixed(4)}, ${wp.lng.toFixed(4)}`}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeWaypoint(index)}
                          className="text-[#FF2121] hover:text-[#950606] transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}

                    <div className="flex items-center justify-between p-2.5 bg-[#F7F7F9] rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#FF2121] flex items-center justify-center text-white text-[11px] font-bold">
                          B
                        </div>
                        <span className="text-[#303030]">
                          {destination
                            ? `${destination.lat.toFixed(4)}, ${destination.lng.toFixed(4)}`
                            : "ยังไม่ได้เลือกปลายทาง"}
                        </span>
                      </div>
                      {destination && (
                        <button
                          type="button"
                          onClick={() => {
                            destMarkerRef.current?.remove()
                            destMarkerRef.current = null
                            setDestination(null)
                            clearRouteLayer()
                          }}
                          className="text-[#FF2121] hover:text-[#950606] transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Route actions */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={calculateFullRoute}
                      disabled={!origin || !destination}
                      className="flex-1 bg-[#3883F8] text-white rounded-lg py-2.5 text-[14px] font-medium hover:bg-[#216CE1] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      คำนวณเส้นทาง
                    </button>
                    <button
                      type="button"
                      onClick={clearRouteLayer}
                      className="px-4 py-2.5 bg-[#F7F7F9] text-[#303030] rounded-lg text-[14px] font-medium hover:bg-[#E0E0E0] transition-all"
                    >
                      ล้าง
                    </button>
                  </div>

                  {/* Route info */}
                  {routeInfo && (
                    <div className="p-3 bg-[#E0F0FF] rounded-lg text-[13px] text-[#303030] font-medium">
                      <div className="flex items-center gap-2">
                        <Navigation size={16} className="text-[#3883F8]" />
                        <span>
                          ระยะทาง: {routeInfo.distanceText} • เวลา: {routeInfo.durationText}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </form>
          )}

          {/* Route Tab Content */}
          {activeTab === "route" && (
            <div>
              {routeSteps.length > 0 ? (
                <>
                  {routeInfo && (
                    <div className="px-4 pt-4 pb-3">
                      <div className="p-3 bg-[#E0F0FF] rounded-lg text-[13px] text-[#303030] font-medium">
                        <div className="flex items-center gap-2">
                          <Navigation size={16} className="text-[#3883F8]" />
                          <span>
                            ระยะทาง: {routeInfo.distanceText} • เวลา: {routeInfo.durationText}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="px-4 pb-4">
                    <h3 className="font-semibold text-[15px] text-[#303030] mb-3">ขั้นตอนการเดินทาง</h3>
                    <ol className="space-y-2">
                      {routeSteps.map((step, i) => (
                        <li key={i} className="flex gap-3 text-[13px] text-[#303030]">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#E0F0FF] text-[#3883F8] flex items-center justify-center text-[11px] font-bold">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </>
              ) : (
                <div className="px-4 py-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F7F7F9] flex items-center justify-center">
                    <Route size={32} className="text-gray-400" />
                  </div>
                  <p className="text-[14px] text-gray-500 mb-2">ยังไม่มีข้อมูลเส้นทาง</p>
                  <p className="text-[13px] text-gray-400">กรุณาคำนวณเส้นทางในแท็บ "ค้นหา" ก่อน</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Bottom location info popup */}
      {locationInfo && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 bottom-8 w-[90%] max-w-md 
                      bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.2)]
                      transition-all duration-300 ease-out z-20
                      ${isClosing ? "opacity-0 translate-y-4 scale-95" : "opacity-100 translate-y-0 scale-100"}`}
        >
          <button
            onClick={closeBottomPopup}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center
                     text-gray-400 hover:text-[#303030] hover:bg-[#F7F7F9] rounded-full
                     transition-all duration-200"
            aria-label="ปิด"
          >
            <X size={18} />
          </button>

          <div className="p-6 pr-12">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#E0F0FF] flex items-center justify-center flex-shrink-0">
                <MapPin size={20} className="text-[#3883F8]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#303030] text-[17px] leading-snug mb-1">{locationInfo.name}</h3>
                {locationInfo.address && (
                  <p className="text-[14px] text-gray-500 leading-relaxed">{locationInfo.address}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
