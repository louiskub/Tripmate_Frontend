import { Icon } from '@iconify/react';

export default function Navbar() {
    return (
        <div className="max-h-screen w-screen bg-gray-50">
            <header className="w-full bg-white border-b border-gray-200 px-7 h-14 flex items-center justify-between">
                <button className="flex items-center gap-2 text-2xl font-extrabold">
                <div className="text-sky-800">TripMate</div>
                </button>
                
                <nav className="flex gap-3 items-center">
                    <button className="h-10 px-3 rounded-2xl">Trip</button>
                    <button className="h-10 px-3 rounded-2xl">Group</button>
                </nav>

                <div className="flex items-center gap-5">
                <div className="w-7 h-7 bg-black/90 rounded" />
                <div className="w-2.5 h-2.5 bg-black/90 rounded-full" />
                <div className="w-7 h-7 bg-black/90 rounded" />
                </div>
            </header>
        </div>
    )
}