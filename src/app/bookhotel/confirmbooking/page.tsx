import Statenav from '@/components/navbar/statenav'

const formRows = [
  ["First name*", "Last name*"],
  ["Email*", "Phone number (optional)"],
]

const specialRequests = {
  roomType: ["Non-smoking", "Smoking"],
  bedSize: ["Large bed", "Twin beds"],
}

const priceDetailsMain = [{ label: "1 room (1 night)", amount: "4,412.00" }]
const priceDetailsBefore = [
  { label: "price before discount", amount: "5,786.74", discount: false },
  { label: "discount", amount: "1,374.74", discount: true },
]
const taxesAndFees = [
  { label: "VAT", amount: "4,412.00" },
  { label: "Service charge", amount: "4,412.00", strong: true },
]

export default function BookHotel() {
  return (
    <div>
      <Statenav />

      <main className="w-full h-full mx-auto bg-gray-50 px-4 sm:px-6 md:px-12 lg:px-24 pt-4 md:pt-7 pb-2.5">
        <div className="flex flex-col gap-0.5 mb-4 md:mb-5">
          <div className="text-gray-900 text-xl md:text-2xl font-extrabold">Hotel Booking</div>
          <div className="text-gray-500 text-base md:text-lg font-semibold">Make sure bla bla</div>
        </div>

        <div className="w-full max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_384px] gap-4 md:gap-2.5">
          <div className="flex flex-col gap-4 md:gap-5 pb-2.5">
            <section className="bg-white rounded-[10px] px-4 md:px-6 py-4 flex flex-col gap-4 md:gap-5">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-gray-900 text-lg md:text-xl font-bold">Main Guest</div>
                  <div className="flex items-center gap-1.5">
                    <input type="checkbox" className="w-4 h-4 bg-gray-300 rounded" />
                    <div className="text-gray-500 text-sm md:text-base font-medium">use my account info</div>
                  </div>
                </div>
                <p className="text-gray-500 text-sm md:text-base">
                  Please make sure that your name matched your id and the contacts are correct.
                </p>
              </div>

              <div className="flex flex-col gap-4 md:gap-5">
                {formRows.map((row, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-4 md:gap-5">
                    {row.map((label) => (
                      <input
                        key={label}
                        className="flex-1 min-w-24 p-2.5 bg-white rounded-[10px] border border-gray-200 flex items-center text-sm md:text-base"
                        placeholder={label}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-[10px] px-4 md:px-6 py-4 flex flex-col gap-4 md:gap-5">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                  <div className="text-gray-900 text-lg md:text-xl font-bold">Special Request</div>
                  <div className="text-gray-500 text-sm md:text-base font-medium">(optional)</div>
                </div>
                <p className="text-gray-500 text-sm md:text-base">
                  The hotel will do its best, but can not guarantee to fulfill all the requests.
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                <div className="flex-1 flex flex-col gap-3 md:gap-4">
                  <div className="text-gray-900 text-sm md:text-base font-bold">Room type</div>
                  <div className="flex flex-wrap gap-3">
                    {specialRequests.roomType.map((opt) => (
                      <label key={opt} className="flex items-center gap-2">
                        <input type="checkbox" className="w-3.5 h-3.5 bg-gray-300 rounded" />
                        <span className="text-gray-500 text-sm font-medium">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-3 md:gap-4">
                  <div className="text-gray-900 text-sm md:text-base font-bold">Bed size</div>
                  <div className="flex flex-wrap gap-3">
                    {specialRequests.bedSize.map((opt) => (
                      <label key={opt} className="flex items-center gap-2">
                        <input type="checkbox" className="w-3.5 h-3.5 bg-gray-300 rounded" />
                        <span className="text-gray-500 text-sm font-medium">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[10px] px-4 md:px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-gray-900 text-lg md:text-xl font-bold">Promo Code</div>
                <div className="w-7 h-4 rotate-90">
                  <div className="w-3.5 h-2 bg-gray-900" />
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[10px] px-4 md:px-6 py-4 flex flex-col gap-4 w-full">
              <div className="text-gray-900 text-lg md:text-xl font-bold">Select Payment Method</div>

              <div className="rounded border border-gray-200">
                <div className="py-3.5">
                  <div className="px-2.5 flex items-center gap-1.5">
                    <input type="checkbox" className="w-4 h-4 bg-sky-600 rounded" />
                    <div className="text-gray-900 text-sm md:text-base font-bold">Credit/Debit Card</div>
                  </div>
                </div>

                <div className="px-4 md:px-7 py-5 border-t border-gray-200 flex flex-col gap-4 md:gap-5">
                  {["Card holder name *", "Credit/debit card number *"].map((label) => (
                    <input
                      key={label}
                      className="h-10 md:h-12 min-w-24 p-2.5 bg-white rounded-md border border-gray-200 flex items-center text-sm md:text-base"
                      placeholder={label}
                    />
                  ))}

                  <div className="flex flex-col sm:flex-row gap-4 md:gap-5">
                    {["Expiration date *", "CVV/CVC *"].map((label) => (
                      <input
                        key={label}
                        className="flex-1 h-10 min-w-24 p-2.5 bg-white rounded-md border border-gray-200 flex items-center text-sm md:text-base"
                        placeholder={label}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded border border-gray-200 py-3.5 px-2.5">
                <div className="flex items-center gap-1.5">
                  <input type="checkbox" className="w-4 h-4 bg-gray-300 rounded" />
                  <div className="text-gray-900 text-sm md:text-base font-bold">QR PromptPay</div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[10px] -mt-2 px-4 md:px-6 py-4 flex flex-col gap-2.5">
              <div className="text-sky-700 text-xs md:text-sm font-medium">You won&apos;t be charged yet</div>
              <button className="h-9 md:h-10 w-full rounded-[10px] bg-sky-600 text-white text-sm md:text-base font-bold shadow transition-all duration-600 ease-in-out hover:scale-[1.02] hover:bg-sky-700">
                Continue to payment
              </button>
              <p className="text-gray-500 text-xs md:text-sm">
                By continuing to payment, I agree to TripMate&apos;s <span className="underline">Terms of Use</span> and{" "}
                <span className="underline">Privacy Policy</span>.
              </p>
            </section>
          </div>

          <div className="flex flex-col gap-2.5 w-full lg:w-[384px]">
            <div className="bg-white rounded-[10px]">
              <div className="min-h-48 p-2.5 rounded-[10px] flex flex-col sm:flex-row gap-2.5">
                <div className="w-full sm:w-44 h-44 rounded-[10px] bg-gradient-to-b from-gray-300 to-gray-400" />
                <div className="flex-1 flex">
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="text-gray-900 text-base md:text-lg font-semibold">
                      Centara Grand Mirage Beach Resort Pattaya
                    </div>
                    <div className="w-14 h-3 flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex-1 flex items-center px-[1px]">
                          <div className="h-2.5 w-full bg-sky-600" />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-medium">10.0</span>
                      <span className="text-sky-700 text-xs">Excellent</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-700">
                      <div className="w-2.5 h-3 bg-gray-900" />
                      <span>location</span>
                    </div>
                    <div className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-medium w-fit">
                      type
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-2.5 pb-2.5">
                <div className="min-h-36 px-2 pt-2 pb-1 bg-gray-50 rounded-[10px] relative">
                  <div className="h-full flex flex-col sm:flex-row gap-1.5">
                    <div className="w-full sm:w-28 h-28 sm:h-auto rounded-[10px] bg-gradient-to-b from-gray-300 to-gray-400" />
                    <div className="flex flex-col justify-center">
                      <div className="text-gray-900 text-sm font-medium">Mirage Premium Explorer King View,sea</div>
                      <div className="pt-1.5 flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-xs text-gray-700">
                          <div className="w-3 h-3 bg-gray-900" />
                          <span>42.0 m²</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-700">
                          <div className="w-3 h-3 bg-gray-900" />
                          <span>1 king bed</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-700">
                          <div className="w-3 h-3 bg-gray-900" />
                          <span>5</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-1 w-40 flex items-center gap-1 text-xs text-green-600">
                    <div className="w-4 h-3 bg-green-500" />
                    <span>Breakfast included</span>
                  </div>

                  <div className="absolute right-2 bottom-2 text-xs text-gray-700">x 1</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[10px] p-2.5 flex items-center">
              <div className="px-1 flex flex-col gap-2.5 flex-1">
                <div className="text-gray-500 text-xs">Check-in</div>
                <div className="text-gray-900 text-sm md:text-base font-medium">Sat, 25 Aug 2025</div>
                <div className="text-gray-500 text-xs md:text-sm font-medium">from 15.00</div>
              </div>
              <div className="flex flex-col items-center gap-2 px-2">
                <div className="text-gray-900 text-xs md:text-sm font-medium">1 night</div>
                <div className="w-4 h-3.5 bg-gray-900" />
              </div>
              <div className="px-1 flex flex-col gap-2.5 flex-1">
                <div className="text-gray-500 text-xs">Check-out</div>
                <div className="text-gray-900 text-sm md:text-base font-medium">Sun, 26 Aug 2025</div>
                <div className="text-gray-500 text-xs md:text-sm font-medium">before 12.00</div>
              </div>
            </div>

            <div className="bg-white rounded-[10px] px-4 md:px-5 py-2.5 flex flex-col gap-3.5">
              <div className="text-gray-900 text-lg md:text-xl font-bold">Price Details</div>

              <div className="flex flex-col gap-1.5">
                {priceDetailsMain.map((row) => (
                  <div key={row.label} className="flex items-start justify-between">
                    <div className="text-gray-900 text-sm font-medium">{row.label}</div>
                    <div className="flex items-start gap-0.5">
                      <span className="text-gray-500 text-sm font-normal">฿</span>
                      <span className="text-gray-900 text-sm font-medium">{row.amount}</span>
                    </div>
                  </div>
                ))}

                {priceDetailsBefore.map((row, i) => (
                  <div key={i} className="pl-4 md:pl-5 flex items-start justify-between">
                    <div className={`text-xs ${row.discount ? "text-red-500" : "text-gray-500"}`}>{row.label}</div>
                    <div className="flex items-start gap-0.5">
                      {row.discount && <span className="text-red-500 text-xs">-</span>}
                      <span className={`text-xs ${row.discount ? "text-red-500" : "text-gray-500"}`}>฿</span>
                      <span className={`text-xs ${row.discount ? "text-red-500" : "text-gray-500"}`}>{row.amount}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-start justify-between">
                  <div className="text-gray-900 text-sm font-medium">Taxes & fees</div>
                  <div className="flex items-start gap-0.5">
                    <span className="text-gray-500 text-sm">฿</span>
                    <span className="text-gray-900 text-sm font-medium">4,412.00</span>
                  </div>
                </div>

                {taxesAndFees.map((row) => (
                  <div key={row.label} className="pl-4 md:pl-5 flex items-start justify-between">
                    <div className="text-gray-500 text-xs">{row.label}</div>
                    <div className="flex items-start gap-0.5">
                      <span className="text-gray-500 text-xs">฿</span>
                      <span className={`text-xs ${row.strong ? "text-gray-900" : "text-gray-500"}`}>{row.amount}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-gray-200" />
              <div className="flex items-center justify-between">
                <div className="text-gray-900 text-sm md:text-base font-bold">Total</div>
                <div className="flex items-start gap-0.5">
                  <span className="text-gray-500 text-sm md:text-base">฿</span>
                  <span className="text-gray-900 text-sm md:text-base font-bold">5,192.92</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
