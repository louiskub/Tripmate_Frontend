import Navbar from '@/components/navbar/nav';
import VendorSideNav from '@/components/navbar/vendorsidenav';

export default function MapPage() {
    return (
        <div className="w-full min-h-screen relative bg-gray-50">
            <Navbar />
            <div className="flex min-h-[calc(100vh-56px)]">
                <VendorSideNav />
                <main className="flex-1 p-4 md:p-7 flex flex-col gap-5 overflow-auto">
                    <div className="bg-white rounded-lg p-4 md:p-5 flex flex-col gap-5">
                        <h2 className="text-xl font-bold text-black">Map Page</h2>
                        <div className="flex flex-col md:flex-row gap-5">
                            <div className="flex-1 bg-white rounded-lg p-2.5 flex flex-col gap-2.5">
                                <div className="h-130 bg-gradient-to-b from-gray-800/0 to-black/30 rounded-lg h-96 flex items-center justify-center">
                                    {/* <span className="text-gray-500">Map Component Placeholder</span> */}
                                    {/* <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden"> */}
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.8473603784664!2d100.76151676708427!3d13.72768953364767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d678937f6f659%3A0xfa87ee9b35a92858!2z4LiE4Lij4Lix4Lin4Lib4Liy4LiB4LiZ4LmJ4Liz!5e0!3m2!1sen!2sth!4v1761917910632!5m2!1sen!2sth"
                                        className="relative inset-0 h-130 w-full border-0"
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                    {/* </div> */}
                                </div>
                            </div>  
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}