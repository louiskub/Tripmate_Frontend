import { Icon } from '@iconify/react';

export default function Navbar() {
    return (
        <div className="flex justify-between p-3">
            {/* left */}
            <div className="flex items-center">
                Trip Mate
                {/* <h1 className="text-lg font-bold">Trip Mate</h1> */}
            </div>

            {/* center */}
            <div className="flex gap-5">
                <button className="btn px-4 mx-4">Trip</button>
                <button className="btn px-4 mx-4">Group</button>
            </div>

            {/* right */}
            <div className="flex items-center">
                {/* <Icon icon="material-symbols:search" width="24" height="24" /> */}
                <Icon icon="mingcute:notification-line" width="24" height="24" />
                <Icon icon="mdi:account" width={24} height={24} />
            </div>
        </div>
    )
}