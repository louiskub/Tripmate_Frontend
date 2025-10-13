"use client";
import { usePathname } from "next/navigation";

export default function Statenav() {
    const pathname = usePathname();

  const map: Array<[RegExp, number]> = [
    [/^\/bookhotel\/confirmbooking$/, 1],
    [/^\/bookhotel\/payment$/, 2],
    [/^\/bookhotel\/completebooking$/, 3],
    [/^\/bookrentalcar\/confirmbooking$/, 1],
    [/^\/bookrentalcar\/payment$/, 2],
    [/^\/bookrentalcar\/completebooking$/, 3],
  ];

  const currentStep = (map.find(([re]) => re.test(pathname))?.[1]) ?? 0;                                                1; // ที่เหลือถือว่าอยู่ Step 1

  const dotClass = (step: number) =>
    "w-4 h-4 rounded-full text-white text-[10px] leading-none flex items-center justify-center transition-transform duration-200 ease-out hover:scale-120 " +
    (currentStep >= step ? "bg-sky-600" : "bg-gray-400");

  const labelClass = (step: number) =>
    "text-[10px] sm:text-xs " + (currentStep >= step ? "text-sky-600" : "text-gray-400");

  return (
    <div className="max-h-screen bg-gray-50">
      <header className="w-full bg-white border-b border-gray-200 px-4 md:px-7 h-14 grid grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-0">
        <div className="flex items-center gap-2 text-xl md:text-2xl font-extrabold">
          <div>Logo</div>
          <div className="text-sky-600">TripMate</div>
        </div>

        <div className="hidden sm:flex flex-col items-center gap-1">
          <div className="w-40 sm:w-48 md:w-64 flex items-center gap-2">
            <button className={dotClass(1)}>1</button>
            <div className="flex-1 h-px bg-gray-300" />
            <button className={dotClass(2)}>2</button>
            <div className="flex-1 h-px bg-gray-300" />
            <button className={dotClass(3)}>3</button>
          </div>

          <div className="w-44 sm:w-56 md:w-72 flex justify-between">
            <span className={labelClass(1)}>Your data</span>
            <span className={labelClass(2)}>Payment</span>
            <span className={labelClass(3)}>Complete</span>
          </div>
        </div>

        <div className="flex justify-end items-center gap-3 md:gap-5">
          <div className="w-6 h-6 md:w-7 md:h-7 bg-black/90 rounded" />
          <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-black/90 rounded-full" />
          <div className="w-6 h-6 md:w-7 md:h-7 bg-black/90 rounded" />
        </div>
      </header>
    </div>
  );
}