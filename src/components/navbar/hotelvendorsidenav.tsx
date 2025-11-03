import { AiFillStar } from "react-icons/ai";
import { FaMapMarkerAlt, FaMapMarkedAlt  } from "react-icons/fa";
import { BsCursorFill } from "react-icons/bs";
import { FaBed } from "react-icons/fa";

import Link from "next/link"

export default function VendorSideNav() {
    return (
        <aside className="min-w-max h-auto bg-white border-r border-gray-200 flex flex-col gap-4 p-3 gap-y-2">
            <Link href="../hotelmanagement/dashboard" className="flex items-center gap-3 h-10 px-4 rounded-md text-gray-800 hover:bg-blue-50">
                <span className="w-5 h-5 mt-1"><AiFillStar /></span>
                <span className="text-base font-medium">Dashboard</span>
            </Link>

            <Link href="../hotelmanagement/myhotel" className="flex items-center gap-3 h-10 px-4 rounded-md text-gray-800 hover:bg-blue-50">
                <span className="w-5 h-5 mt-1"><FaMapMarkerAlt /></span>
                <span className="text-base font-medium">Hotel</span>
            </Link>

            {/* <Link href="../hotelmanagement/bookinghistory" className="flex items-center gap-3 h-10 px-4 rounded-md text-gray-800 hover:bg-blue-50">
                <span className="w-5 h-5 mt-1"><BsCursorFill /></span>
                <span className="text-base font-medium">Booking History</span>
            </Link> */}

            <Link href="../hotelmanagement/myroom" className="flex items-center gap-3 h-10 px-4 rounded-md text-gray-800 hover:bg-blue-50">
                <span className="w-5 h-5 mt-1"><FaBed /></span>
                <span className="text-base font-medium">Rooms</span>
            </Link>

            {/* <Link href="../hotelmanagement/map" className="flex items-center gap-3 h-10 px-4 rounded-md text-gray-800 hover:bg-blue-50">
                <span className="w-5 h-5 mt-1"><FaMapMarkedAlt /></span>
                <span className="text-base font-medium">Map</span>
            </Link> */}
        </aside>
    )
}

const logos = [
            { name: "Dashboard", icon: <AiFillStar /> },
            { name: "Hotel", icon: <FaMapMarkerAlt /> },
            { name: "Booking History", icon: <BsCursorFill /> },
            { name: "Rooms", icon: <FaBed /> }
            // { name: "Map", icon: <FaMapMarkedAlt /> },
            ];