"use client"
import { useMemo, useState } from "react"
import Statenav from "@/components/navbar/statenav"

type AddonKey = "deposit" | "deliveryLocal" | "deliveryOuter" | "insurance"
type PayMethod = "card" | "promptpay"

export default function RentalCarBookingPage() {
  // --- Demo state ---
  const [useAccountInfo, setUseAccountInfo] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")

  const [addons, setAddons] = useState<Record<AddonKey, boolean>>({
    deposit: false,
    deliveryLocal: false,
    deliveryOuter: true,
    insurance: true,
  })

  const [promoOpen, setPromoOpen] = useState(false)
  const [promoCode, setPromoCode] = useState("")

  const [payMethod, setPayMethod] = useState<PayMethod>("card")
  const [cardName, setCardName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExp, setCardExp] = useState("")
  const [cardCvv, setCardCvv] = useState("")
  const [note, setNote] = useState("")

  // --- Calc demo prices ---
  const baseDays = 2
  const basePrice = 18000 // after discount
  const baseBeforeDiscount = 20000
  const baseDiscount = baseBeforeDiscount - basePrice

  const addonPricesPerDay: Record<AddonKey, number> = {
    deposit: 1000,
    deliveryLocal: 500,
    deliveryOuter: 1000,
    insurance: 500,
  }

  const addonsTotal = useMemo(() => {
    let sum = 0
    ;(Object.keys(addons) as AddonKey[]).forEach((k) => {
      if (addons[k]) sum += addonPricesPerDay[k]
    })
    return sum
  }, [addons])

  const grandTotal = basePrice + addonsTotal

  const toggleAddon = (k: AddonKey) => setAddons((prev) => ({ ...prev, [k]: !prev[k] }))

  const handleContinue = () => {
    // ใส่ logic ชำระเงิน/submit ที่นี่
    alert("Proceeding to payment...")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <Statenav />

      {/* MAIN */}
      <main className="w-full h-full mx-auto bg-gray-50 px-4 sm:px-6 md:px-12 xl:px-24 pt-4 md:pt-7 pb-2.5">
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-10 lg:px-24 py-7">
          {/* Title */}
          <div className="flex flex-col gap-0.5 mb-5">
            <h1 className="text-2xl font-extrabold text-slate-900">Rental Car Booking</h1>
            <p className="text-lg font-semibold text-gray-500">Make sure bla bla</p>
          </div>

          {/* 2 Columns */}
          <div className="flex flex-col xl:flex-row gap-3">
            {/* LEFT */}
            <div className="flex-1 flex flex-col gap-5">
              {/* Customer Info */}
              <section className="w-full rounded-[10px] bg-white p-6 space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Customer Info</h2>
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                        checked={useAccountInfo}
                        onChange={(e) => setUseAccountInfo(e.target.checked)}
                      />
                      <span className="text-base font-medium text-gray-500">use my account info</span>
                    </label>
                  </div>
                  <p className="text-base text-gray-500">
                    Please make sure that your name matches your ID and the contacts are correct.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-gray-600">First name*</label>
                      <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="h-11 rounded-[10px] border border-neutral-200 px-3 text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="John"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-gray-600">Last name*</label>
                      <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="h-11 rounded-[10px] border border-neutral-200 px-3 text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-gray-600">Phone number*</label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-11 rounded-[10px] border border-neutral-200 px-3 text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="+66 8x xxx xxxx"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Additional Services */}
              <section className="w-full rounded-[10px] bg-white p-6 space-y-5">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-xl font-bold text-slate-900">Additional Services</h2>
                    <span className="text-base text-gray-500">(optional)</span>
                  </div>
                  <p className="text-base text-gray-500">description</p>
                </div>

                <div className="w-full flex flex-col xl:flex-row items-start gap-5">
                  {/* Group 1 */}
                  <div className="flex flex-col gap-5">
                    {/* Deposit */}
                    <button
                      type="button"
                      onClick={() => toggleAddon("deposit")}
                      className={`w-56 p-3 rounded-md border flex items-center justify-between gap-3 transition ${
                        addons.deposit ? "bg-blue-50 border-blue-700" : "bg-white border-neutral-200"
                      }`}
                    >
                      <div className="flex flex-col items-start">
                        <div className="text-base font-bold text-slate-900">Deposit</div>
                        <div className="text-xs text-slate-700">description</div>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm text-gray-500">฿</span>
                        <span className="text-lg font-extrabold text-slate-900">1,000</span>
                        <span className="text-xs text-gray-500">/day</span>
                      </div>
                    </button>
                  </div>

                  {/* (Vertical divider for large screens) */}
                  <div className="hidden xl:block w-px h-36 bg-neutral-200" />

                  {/* Group 2 (Delivery) */}
                  <div className="flex flex-col gap-5">
                    <button
                      type="button"
                      onClick={() => toggleAddon("deliveryLocal")}
                      className={`w-56 p-3 rounded-md border flex items-center justify-between gap-3 transition ${
                        addons.deliveryLocal ? "bg-blue-50 border-blue-700" : "bg-white border-neutral-200"
                      }`}
                    >
                      <div className="flex flex-col items-start">
                        <div className="text-base font-bold text-slate-900">Delivery</div>
                        <div className="text-xs text-slate-700">in local area</div>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm text-gray-500">฿</span>
                        <span className="text-lg font-extrabold text-slate-900">500</span>
                        <span className="text-xs text-gray-500">/day</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleAddon("deliveryOuter")}
                      className={`w-56 p-3 rounded-md border flex items-center justify-between gap-3 transition ${
                        addons.deliveryOuter ? "bg-blue-50 border-blue-700" : "bg-white border-neutral-200"
                      }`}
                    >
                      <div className="flex flex-col items-start">
                        <div className="text-base font-bold text-slate-900">Delivery</div>
                        <div className="text-xs text-slate-700">out of local area</div>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm text-gray-500">฿</span>
                        <span className="text-lg font-extrabold text-slate-900">1,000</span>
                        <span className="text-xs text-gray-500">/day</span>
                      </div>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="hidden xl:block w-px h-36 bg-neutral-200" />

                  {/* Group 3 */}
                  <div className="flex flex-col gap-5">
                    <button
                      type="button"
                      onClick={() => toggleAddon("insurance")}
                      className={`w-56 p-3 rounded-md border flex items-center justify-between gap-3 transition ${
                        addons.insurance ? "bg-blue-50 border-blue-700" : "bg-white border-neutral-200"
                      }`}
                    >
                      <div className="flex flex-col items-start">
                        <div className="text-base font-bold text-slate-900">Insurance</div>
                        <div className="text-xs text-slate-700">description</div>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm text-gray-500">฿</span>
                        <span className="text-lg font-extrabold text-slate-900">500</span>
                        <span className="text-xs text-gray-500">/day</span>
                      </div>
                    </button>
                  </div>
                </div>
              </section>

              {/* Note */}
              <section className="w-full rounded-[10px] bg-white p-6 space-y-4">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-xl font-bold text-slate-900">Note</h2>
                  <span className="text-base text-gray-500">(optional)</span>
                </div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full h-28 rounded-[10px] border border-neutral-200 p-3 text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a note for the provider..."
                />
              </section>

              {/* Promo Code */}
              <section className="w-full rounded-[10px] bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Promo Code</h2>
                  <button
                    type="button"
                    className="w-7 h-4 rotate-90 bg-slate-900/90"
                    onClick={() => setPromoOpen((v) => !v)}
                    aria-label="Toggle promo code"
                  />
                </div>
                {promoOpen && (
                  <div className="mt-4 flex gap-3">
                    <input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="h-11 flex-1 rounded-md border border-neutral-200 px-3 text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your code"
                    />
                    <button type="button" className="h-11 rounded-md bg-slate-900 text-white px-4 font-semibold">
                      Apply
                    </button>
                  </div>
                )}
              </section>

              {/* Payment Method */}
              <section className="w-full rounded-[10px] bg-white p-6 space-y-4">
                <h2 className="text-xl font-bold text-slate-900">Select Payment Method</h2>

                {/* Radios */}
                <div className="rounded border border-neutral-200">
                  <div className="w-full bg-blue-50 py-3.5">
                    <label className="flex items-center gap-2 px-3 cursor-pointer">
                      <input
                        type="radio"
                        name="payMethod"
                        value="card"
                        checked={payMethod === "card"}
                        onChange={() => setPayMethod("card")}
                        className="h-4 w-4 text-blue-700 focus:ring-blue-700"
                      />
                      <span className="text-base font-bold text-blue-700">Credit/Debit Card</span>
                    </label>
                  </div>

                  {payMethod === "card" && (
                    <div className="px-7 py-5 border-t border-neutral-200 space-y-5">
                      <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">Card holder name *</label>
                        <input
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="h-12 rounded-md border border-neutral-200 px-3 text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="John Doe"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">Credit/debit card number *</label>
                        <input
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="h-12 rounded-md border border-neutral-200 px-3 text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="1234 5678 9012 3456"
                          inputMode="numeric"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-gray-600">Expiration date *</label>
                          <input
                            value={cardExp}
                            onChange={(e) => setCardExp(e.target.value)}
                            className="h-10 rounded-md border border-neutral-200 px-3 text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-gray-600">CVV/CVC *</label>
                          <input
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="h-10 rounded-md border border-neutral-200 px-3 text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="123"
                            inputMode="numeric"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payMethod"
                    value="promptpay"
                    checked={payMethod === "promptpay"}
                    onChange={() => setPayMethod("promptpay")}
                    className="h-4 w-4 text-blue-700 focus:ring-blue-700"
                  />
                  <span className="text-base font-bold text-slate-900">QR PromptPay</span>
                </label>

                {/* CTA */}
                <div className="rounded-[10px] bg-white space-y-2.5">
                  <div className="text-sm font-medium text-blue-700">You won’t be charged yet</div>
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="w-full h-11 rounded-[10px] bg-slate-900 text-gray-50 font-bold shadow"
                  >
                    Continue to payment
                  </button>
                  <div className="text-sm text-gray-500">
                    By continuing to payment, I agree to TripMate’s{" "}
                    <a className="underline" href="#">
                      Terms of Use
                    </a>{" "}
                    and{" "}
                    <a className="underline" href="#">
                      Privacy Policy
                    </a>
                    .
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT */}
            <aside className="w-full xl:max-w-[384px] flex flex-col gap-2.5">
              {/* Hotel / Car Card */}
              <div className="rounded-[10px] bg-white border border-neutral-200 p-2.5 flex gap-2.5">
                <div className="w-44 h-44 rounded-[10px] bg-gradient-to-b from-zinc-800/0 to-black/30" />
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="text-lg font-semibold text-slate-900">name</div>

                    <div className="flex gap-1 w-14">
                      <div className="flex-1 h-2.5 bg-blue-700" />
                      <div className="flex-1 h-2.5 bg-blue-700" />
                      <div className="flex-1 h-2.5 bg-blue-700" />
                      <div className="flex-1 h-2.5 bg-blue-700" />
                      <div className="flex-1 h-2.5 bg-blue-700" />
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 bg-blue-50 rounded-2xl text-blue-700 text-xs font-medium">10.0</span>
                      <span className="text-blue-700 text-xs">Excellent</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-3 bg-slate-900" />
                      <span className="text-xs text-slate-900">location</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 bg-blue-50 rounded-2xl text-blue-700 text-xs font-medium">tag</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pick-up / Drop-off */}
              <div className="rounded-[10px] bg-white p-2.5 space-y-3">
                <div className="flex items-center">
                  <div className="px-1 flex-1">
                    <div className="text-xs text-gray-500">Pick-up</div>
                    <div className="text-base font-medium text-slate-900">Sat, 25 Aug 2025</div>
                    <div className="text-sm text-gray-600">from 09.00</div>
                  </div>

                  <div className="w-16 flex flex-col items-center">
                    <div className="text-sm font-medium text-slate-900">{baseDays} days</div>
                    <div className="w-4 h-4 bg-slate-900 mt-1" />
                  </div>

                  <div className="px-1 flex-1">
                    <div className="text-xs text-gray-500">Drop-off</div>
                    <div className="text-base font-medium text-slate-900">Mon, 27 Aug 2025</div>
                    <div className="text-sm text-gray-600">before 20.00</div>
                  </div>
                </div>
              </div>

              {/* Price Details */}
              <div className="rounded-[10px] bg-white px-5 py-2.5 space-y-3.5">
                <div>
                  <div className="text-xl font-bold text-slate-900">Price Details</div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-start justify-between">
                    <div className="text-sm font-medium text-slate-900">Rental Car ({baseDays} days)</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-gray-500">฿</span>
                      <span className="text-sm font-medium text-slate-900">
                        {basePrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="pl-5 flex items-start justify-between">
                    <div className="text-xs text-gray-500">price before discount</div>
                    <div className="flex items-baseline gap-0.5 text-gray-500">
                      <span className="text-xs">฿</span>
                      <span className="text-xs">
                        {baseBeforeDiscount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="pl-5 flex items-start justify-between">
                    <div className="text-xs text-gray-500">discount</div>
                    <div className="flex items-baseline gap-0.5 text-red-600">
                      <span className="text-xs">-</span>
                      <span className="text-xs">฿</span>
                      <span className="text-xs">
                        {baseDiscount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-start justify-between">
                    <div className="text-sm font-medium text-slate-900">Additional Services ({baseDays} days)</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-gray-500">฿</span>
                      <span className="text-sm font-medium text-slate-900">
                        {addonsTotal.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>

                  {addons.deliveryOuter && (
                    <div className="pl-5 flex items-start justify-between">
                      <div className="text-xs text-gray-500">Delivery (out of local area)</div>
                      <div className="flex items-baseline gap-0.5 text-gray-600">
                        <span className="text-xs">฿</span>
                        <span className="text-xs">
                          {addonPricesPerDay.deliveryOuter.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  )}

                  {addons.insurance && (
                    <div className="pl-5 flex items-start justify-between">
                      <div className="text-xs text-gray-500">Insurance</div>
                      <div className="flex items-baseline gap-0.5 text-slate-900">
                        <span className="text-xs">฿</span>
                        <span className="text-xs">
                          {addonPricesPerDay.insurance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-px bg-neutral-200" />

                <div className="flex items-center justify-between">
                  <div className="text-base font-bold text-slate-900">Total</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base text-gray-500">฿</span>
                    <span className="text-base font-bold text-slate-900">
                      {grandTotal.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
