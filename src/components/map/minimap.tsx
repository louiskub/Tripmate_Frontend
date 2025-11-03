"use client"
import { useEffect, useRef } from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

import {
  MapPin
} from "lucide-react"

export default function MiniMap({name, lat=100.5018, long=13.7563, className =''}: {name: string, lat: number, long: number, className?:string}) {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<maplibregl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.stadiamaps.com/styles/osm_bright.json",
      center: [long, lat],
      zoom: 13,
      attributionControl: false,
    })

    // เพิ่ม zoom control (มี + และ -)
    map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right")

    // ปุ่ม Reset (custom)
    const resetButton = document.createElement("button")
    resetButton.innerText = "↺"
    resetButton.className =
      "bg-white border border-gray-300 rounded-md shadow-md w-8 h-8 m-1 text-lg font-bold cursor-pointer hover:bg-gray-100"
    resetButton.onclick = () => {
      map.current?.flyTo({
        center: [long, lat],
        zoom: 18,
        essential: true,
      })
    }
    // เพิ่ม pin
    new maplibregl.Marker({ color: "#ff6600" })
      .setLngLat([long, lat])
      .setPopup(new maplibregl.Popup().setText(name)) // คลิกแล้วโชว์ข้อความ
      .addTo(map.current)

    // ครอบไว้ใน container เดียวกับปุ่ม zoom
    const customControl = document.createElement("div")
    customControl.className = "maplibregl-ctrl maplibregl-ctrl-group"
    customControl.appendChild(resetButton)
    map.current.getContainer().querySelector(".maplibregl-ctrl-bottom-right")?.appendChild(customControl)

    return () => map.current?.remove()
  }, [])

  return <div className={`w-full h-full relative ${className}`}>
    <div ref={mapContainer} className="w-full h-full rounded-xl" />
    <button
        onClick={() => {window.location.href = `/map?name=${name}&lat=${lat}&long=${long}`}}
        className="
            absolute bottom-4 left-1/2 -translate-x-1/2 
            inline-flex items-center justify-center gap-2 
            whitespace-nowrap 
            px-4 py-2 
            bg-custom-white rounded-xl shadow-md 
            transition-all duration-200 ease-in-out
            hover:shadow-lg hover:scale-105 
            hover:bg-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75
        "
    >
        <span className="text-custom-black text-sm font-semibold font-[Manrope]">
            View on map
        </span>
        <MapPin className="w-4 h-4" />
    </button>
</div>
}
