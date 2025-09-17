import { RiHotelBedFill } from "react-icons/ri";
import { IoRestaurant } from "react-icons/io5";
import { FaCarSide, FaMapMarkerAlt, FaMapMarkedAlt } from "react-icons/fa";
import { BsSendFill } from "react-icons/bs";

export default function SideNav() {
    return (
        <aside className="w-56 h-screen bg-white border-r border-gray-200 flex flex-col gap-4 p-3 gap-y-2">
            {logos.map((item) => (
                <button key={item.name} className="flex items-center gap-3 h-10 px-4 rounded-md text-gray-800 hover:bg-blue-50">
                <span className="w-5 h-5 mt-1">{item.icon}</span>
                <span className="text-base font-medium">{item.name}</span>
                </button>
            ))}
        </aside>
    )
}

const logos = [
            { name: "Hotels", icon: <RiHotelBedFill /> },
            { name: "Restaurants", icon: <IoRestaurant /> },
            { name: "Rental Cars", icon: <FaCarSide /> },
            { name: "Guides", icon: <BsSendFill /> },
            { name: "Tourist Attractions", icon: <FaMapMarkerAlt /> },
            { name: "Map", icon: <FaMapMarkedAlt /> },
            ];