import Statenav from "@/components/navbar/statenav"

export default function GuideBookingPage() {
  const customerInfoRows: string[][] = [["First name*", "Last name*"], ["Phone number *"]]
  const cardFieldsLine1 = ["Card holder name *", "Credit/debit card number *"]

  return (
    <div className="min-h-screen bg-gray-50">
      <Statenav />

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-24 pt-7 pb-2.5 flex flex-col justify-start items-start gap-5">
        {/* Header text */}
        <div className="flex flex-col justify-center items-start gap-0.5">
          <h1 className="text-center justify-start text-slate-900 text-xl sm:text-2xl font-extrabold font-['Manrope']">
            Guide Booking
          </h1>
          <p className="text-center justify-start text-gray-600 text-base sm:text-lg font-semibold font-['Manrope']">
            Make sure bla bla
          </p>
        </div>

        <form className="w-full max-w-[1240px] mx-auto flex flex-col xl:flex-row justify-center items-start gap-2.5">
          {/* Left column */}
          <div className="w-full xl:flex-1 pb-2.5 flex flex-col justify-start items-start gap-5">
            {/* Customer Info */}
            <section className="self-stretch px-4 sm:px-6 py-4 bg-white rounded-[10px] flex flex-col justify-start items-start gap-5 overflow-hidden">
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="text-center justify-start text-slate-900 text-lg sm:text-2xl font-extrabold font-['Manrope']">
                    Customer Info
                  </div>

                  {/* use my account info */}
                  <label className="py-px flex justify-start items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-700 focus:ring-blue-600"
                      name="useAccountInfo"
                    />
                    <span className="text-center justify-start text-gray-600 text-sm sm:text-base font-medium font-['Manrope']">
                      use my account info
                    </span>
                  </label>
                </div>

                <p className="self-stretch flex justify-start items-center gap-1">
                  <span className="text-center justify-start text-gray-600 text-sm sm:text-base font-medium font-['Manrope']">
                    Please make sure that your name matches your id and the contacts are correct.
                  </span>
                </p>
              </div>

              <div className="self-stretch flex flex-col justify-start items-start gap-5">
                {/* rows via map */}
                {customerInfoRows.map((row, idx) => (
                  <div
                    key={`cust-row-${idx}`}
                    className="self-stretch flex flex-col sm:flex-row justify-start items-start gap-3 sm:gap-5"
                  >
                    {row.map((label, j) => {
                      const id = `cust-${idx}-${j}`
                      const isPhone = /phone/i.test(label)
                      return (
                        <label
                          key={`cust-field-${idx}-${j}`}
                          htmlFor={id}
                          className="flex-1 w-full min-w-24 p-2.5 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-200 flex items-center gap-2.5"
                        >
                          <span className="sr-only">{label}</span>
                          <input
                            id={id}
                            name={id}
                            type={isPhone ? "tel" : "text"}
                            inputMode={isPhone ? "tel" : "text"}
                            placeholder={label}
                            className="w-full bg-transparent placeholder-gray-600 text-slate-900 text-sm sm:text-base font-medium font-['Manrope'] focus:outline-none"
                            autoComplete={isPhone ? "tel" : idx === 0 && j === 0 ? "given-name" : idx === 0 && j === 1 ? "family-name" : "off"}
                          />
                        </label>
                      )
                    })}
                  </div>
                ))}
              </div>
            </section>

            {/* Note */}
            <section className="self-stretch px-4 sm:px-6 py-4 bg-white rounded-[10px] flex flex-col justify-start items-start gap-5 overflow-hidden">
              <div className="self-stretch flex flex-col justify-center items-start gap-2">
                <div className="flex justify-start items-center gap-1">
                  <div className="text-center justify-start text-slate-900 text-lg sm:text-xl font-bold font-['Manrope']">
                    Note
                  </div>
                  <div className="text-center justify-start text-gray-600 text-sm sm:text-base font-medium font-['Manrope']">
                    (optional)
                  </div>
                </div>
              </div>

              <label
                htmlFor="note"
                className="self-stretch min-h-14 p-2.5 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-200"
              >
                <span className="sr-only">Note</span>
                <textarea
                  id="note"
                  name="note"
                  placeholder="Add a note for your guide…"
                  className="w-full h-24 resize-y bg-transparent placeholder-gray-400 text-slate-900 text-sm sm:text-base font-medium font-['Manrope'] focus:outline-none"
                />
              </label>
            </section>

            {/* Promo Code */}
            <section
              data-property-1="Variant2"
              className="self-stretch px-4 sm:px-6 py-4 bg-white rounded-[10px] flex flex-col justify-start items-start gap-3 overflow-hidden"
            >
              <div className="self-stretch flex justify-between items-center">
                <div className="text-center justify-start text-slate-900 text-lg sm:text-xl font-bold font-['Manrope']">
                  Promo Code
                </div>
                <div className="w-7 h-4 relative origin-top-left rotate-90">
                  <div className="w-3.5 h-2 left-[0.80px] top-[4.83px] absolute bg-slate-900" />
                </div>
              </div>

              {/* real promo input, hidden previously */}
              <label
                htmlFor="promo"
                className="w-full p-2.5 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-200 flex items-center gap-2.5"
              >
                <span className="sr-only">Promo Code</span>
                <input
                  id="promo"
                  name="promo"
                  type="text"
                  placeholder="Enter promo code"
                  className="flex-1 bg-transparent placeholder-gray-400 text-slate-900 text-sm sm:text-base font-medium font-['Manrope'] focus:outline-none"
                />
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs sm:text-sm font-semibold"
                >
                  Apply
                </button>
              </label>
            </section>

            {/* Payment */}
            <section
              data-property-1="Credit"
              className="w-full xl:max-w-[830px] px-4 sm:px-6 py-4 bg-white rounded-[10px] flex flex-col justify-start items-start gap-4"
            >
              <div className="self-stretch flex flex-col justify-center items-start gap-2">
                <div className="flex justify-start items-center gap-1">
                  <div className="text-center justify-start text-slate-900 text-lg sm:text-xl font-bold font-['Manrope']">
                    Select Payment Method
                  </div>
                </div>
              </div>

              {/* payment method radios */}
              <div className="self-stretch rounded outline outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col">
                <label className="self-stretch py-3.5 bg-blue-50 flex items-center gap-2.5 px-2.5 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="payMethod"
                    value="card"
                    defaultChecked
                    className="w-4 h-4 text-blue-700 focus:ring-blue-600"
                  />
                  <span className="text-blue-700 text-sm sm:text-base font-bold font-['Manrope']">
                    Credit/Debit Card
                  </span>
                </label>

                {/* Card fields */}
                <div className="self-stretch px-4 sm:px-7 py-5 border-t border-gray-200 flex flex-col justify-start items-start gap-5 overflow-hidden">
                  {cardFieldsLine1.map((label, i) => {
                    const id = `card-line1-${i}`
                    const isNumber = /number/i.test(label)
                    return (
                      <label
                        key={id}
                        htmlFor={id}
                        className="self-stretch h-12 min-w-24 p-2.5 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 flex items-center gap-2.5"
                      >
                        <span className="sr-only">{label}</span>
                        <input
                          id={id}
                          name={id}
                          type="text"
                          inputMode={isNumber ? "numeric" : "text"}
                          autoComplete={isNumber ? "cc-number" : "cc-name"}
                          placeholder={label}
                          className="w-full bg-transparent placeholder-gray-600 text-slate-900 text-sm sm:text-base font-medium font-['Manrope'] focus:outline-none"
                          pattern={isNumber ? "[0-9 ]*" : undefined}
                        />
                      </label>
                    )
                  })}

                  <div className="self-stretch h-12 flex flex-col sm:flex-row justify-start items-center gap-3 sm:gap-5">
                    <label
                      htmlFor="card-exp"
                      className="w-full sm:flex-1 h-10 min-w-24 p-2.5 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 flex items-center gap-2.5"
                    >
                      <span className="sr-only">Expiration date</span>
                      <input
                        id="card-exp"
                        name="card-exp"
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        placeholder="MM/YY"
                        className="w-full bg-transparent placeholder-gray-600 text-slate-900 text-sm sm:text-base font-medium font-['Manrope'] focus:outline-none"
                        pattern="(0[1-9]|1[0-2])\/\d{2}"
                      />
                    </label>

                    <label
                      htmlFor="card-cvv"
                      className="w-full sm:flex-1 h-10 min-w-24 p-2.5 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 flex items-center gap-2.5"
                    >
                      <span className="sr-only">CVV/CVC</span>
                      <input
                        id="card-cvv"
                        name="card-cvv"
                        type="password"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        placeholder="CVV/CVC *"
                        className="w-full bg-transparent placeholder-gray-600 text-slate-900 text-sm sm:text-base font-medium font-['Manrope'] focus:outline-none"
                        maxLength={4}
                        pattern="\d{3,4}"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* QR method row */}
              <label className="self-stretch py-3.5 rounded outline outline-1 outline-offset-[-1px] outline-gray-200 flex items-center gap-2.5 px-2.5 cursor-pointer select-none">
                <input type="radio" name="payMethod" value="promptpay" className="w-4 h-4 text-blue-700 focus:ring-blue-600" />
                <span className="text-slate-900 text-sm sm:text-base font-bold font-['Manrope']">QR PromptPay</span>
              </label>
            </section>

            {/* Footer actions */}
            <section className="self-stretch px-4 sm:px-6 py-4 bg-white rounded-[10px] flex flex-col justify-start items-start gap-2.5">
              <p className="self-stretch text-center justify-start text-blue-700 text-xs sm:text-sm font-medium font-['Manrope']">
                You won&apos;t be charged yet
              </p>

              <button
                type="submit"
                className="self-stretch h-9 min-w-24 px-2.5 py-3 bg-blue-700 rounded-[10px] shadow-[0px_0px_5px_0px_rgba(48,48,48,1.00)] flex justify-center items-center gap-2.5 overflow-hidden"
              >
                <span className="text-center justify-start text-gray-50 text-sm sm:text-base font-bold font-['Manrope']">
                  Continue to payment
                </span>
              </button>

              <p className="self-stretch text-center">
                <span className="text-gray-600 text-xs sm:text-sm font-medium font-['Manrope']">
                  By continuing to payment, I agree to TripMate&apos;s{" "}
                </span>
                <a href="#" className="text-gray-600 text-xs sm:text-sm font-medium font-['Manrope'] underline">
                  Terms of Use
                </a>
                <span className="text-gray-600 text-xs sm:text-sm font-medium font-['Manrope']"> and </span>
                <a href="#" className="text-gray-600 text-xs sm:text-sm font-medium font-['Manrope'] underline">
                  Privacy Policy
                </a>
                <span className="text-gray-600 text-xs sm:text-sm font-medium font-['Manrope']">.</span>
              </p>
            </section>
          </div>

          {/* Right column */}
          <aside className="w-full xl:w-96 flex flex-col justify-start items-start gap-2.5">
            {/* Guide card */}
            <section
              data-price="false"
              data-property-1="Guide"
              className="self-stretch min-h-[192px] p-2.5 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-300 flex flex-col sm:flex-row xl:flex-row justify-start items-start gap-2.5 overflow-hidden"
            >
              <div data-property-1="Default" className="w-full sm:w-44 h-44 relative flex-shrink-0">
                <div className="w-full h-full left-0 top-0 absolute bg-gradient-to-b from-zinc-800/0 to-black/30 rounded-[10px]" />
              </div>

              <div className="flex-1 flex justify-between items-start">
                <div className="flex-1 flex flex-col justify-start items-start gap-0.5">
                  <div className="flex justify-start items-center gap-[3px]">
                    <div className="w-3 h-3 flex flex-col justify-center items-center overflow-hidden">
                      <div className="self-stretch h-3 bg-gray-600" />
                    </div>
                    <div className="text-center justify-start text-gray-600 text-xs font-normal font-['Manrope']">
                      full name
                    </div>
                  </div>

                  <div className="self-stretch flex items-center gap-1 flex-wrap content-center">
                    <div className="justify-start text-slate-900 text-base sm:text-lg font-semibold font-['Manrope']">
                      name
                    </div>
                  </div>

                  <div className="flex justify-center items-center gap-[3px]">
                    <div className="px-2 py-0.5 bg-blue-50 rounded-[20px] flex justify-center items-center gap-1">
                      <div className="text-center justify-start text-blue-700 text-xs font-medium font-['Inter']">
                        10.0
                      </div>
                    </div>
                    <div className="text-center justify-start text-blue-700 text-xs font-normal font-['Manrope']">
                      Excellent
                    </div>
                  </div>

                  <div className="flex justify-start items-center gap-[3px]">
                    <div className="w-2.5 h-3 bg-slate-900" />
                    <div className="text-center justify-start text-slate-900 text-xs font-normal font-['Manrope']">
                      location
                    </div>
                  </div>

                  <div className="flex justify-start items-center gap-[3px]">
                    <div className="w-3 h-3 relative overflow-hidden">
                      <div className="w-3 h-3 left-0 top-0 absolute bg-slate-900" />
                    </div>
                    <div className="text-center justify-start text-slate-900 text-xs font-normal font-['Manrope']">
                      4 hours
                    </div>
                  </div>

                  <div className="flex justify-start items-center gap-0.5">
                    <div className="px-2 py-0.5 bg-blue-50 rounded-[20px] flex justify-center items-center gap-1">
                      <div className="text-center justify-start text-blue-700 text-xs font-medium font-['Inter']">
                        tag
                      </div>
                    </div>
                  </div>
                </div>

                <div className="self-stretch flex flex-col justify-end items-center" />
              </div>
            </section>

            {/* From / To section */}
            <section
              data-property-1="guide"
              className="self-stretch p-2.5 bg-white rounded-[10px] flex flex-col justify-center items-center gap-3"
            >
              <div className="self-stretch flex flex-col sm:flex-row justify-start items-center gap-1.5">
                <div className="w-full sm:flex-1 flex flex-col justify-start items-start gap-2.5 overflow-hidden">
                  <label className="justify-start text-gray-600 text-xs font-normal font-['Manrope']" htmlFor="from-date">
                    From
                  </label>

                  <div className="self-stretch h-7 min-w-24 px-2.5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-between items-center overflow-hidden">
                    <input
                      id="from-date"
                      name="from-date"
                      type="date"
                      className="w-full bg-transparent text-slate-900 text-xs sm:text-sm font-medium font-['Manrope'] focus:outline-none"
                    />
                    <div className="w-4 h-4 bg-slate-900" />
                  </div>

                  <div className="self-stretch h-7 min-w-24 px-2.5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-between items-center overflow-hidden">
                    <input
                      id="from-time"
                      name="from-time"
                      type="time"
                      className="w-full bg-transparent text-gray-600 text-xs sm:text-sm font-medium font-['Manrope'] focus:outline-none"
                    />
                    <div className="w-4 h-4 bg-slate-900" />
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center gap-2 overflow-hidden">
                  <div className="flex justify-center items-start overflow-hidden">
                    <div className="text-center justify-start text-slate-900 text-xs sm:text-sm font-medium font-['Manrope']">
                      4
                      <br />
                      hours
                    </div>
                  </div>
                  <div className="w-4 h-4 p-px flex justify-center items-center overflow-hidden">
                    <div className="w-4 h-3.5 bg-slate-900" />
                  </div>
                </div>

                <div className="w-full sm:flex-1 flex flex-col justify-start items-start gap-2.5 overflow-hidden">
                  <label className="justify-start text-gray-600 text-xs font-normal font-['Manrope']" htmlFor="to-date">
                    To
                  </label>

                  <div className="self-stretch h-7 min-w-24 px-2.5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-between items-center overflow-hidden">
                    <input
                      id="to-date"
                      name="to-date"
                      type="date"
                      className="w-full bg-transparent text-slate-900 text-xs sm:text-sm font-medium font-['Manrope'] focus:outline-none"
                    />
                    <div className="w-4 h-4 bg-slate-900" />
                  </div>

                  <div className="self-stretch h-7 min-w-24 px-2.5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-between items-center overflow-hidden">
                    <input
                      id="to-time"
                      name="to-time"
                      type="time"
                      className="w-full bg-transparent text-gray-600 text-xs sm:text-sm font-medium font-['Manrope'] focus:outline-none"
                    />
                    <div className="w-4 h-4 bg-slate-900" />
                  </div>
                </div>
              </div>

              <div className="self-stretch flex justify-start items-center gap-2.5">
                <label className="text-center justify-start text-slate-900 text-xs sm:text-sm font-medium font-['Manrope']" htmlFor="guests">
                  Guest *
                </label>

                <div className="flex-1 h-7 px-2.5 py-1 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-between items-center overflow-hidden">
                  <div className="flex-1 flex justify-start items-center gap-2.5">
                    <div className="w-4 h-4 bg-slate-900" />
                    <input
                      id="guests"
                      name="guests"
                      type="number"
                      min={1}
                      defaultValue={2}
                      className="w-12 bg-transparent text-slate-900 text-xs sm:text-sm font-semibold font-['Manrope'] focus:outline-none"
                    />
                  </div>

                  <div className="w-0 h-3 relative origin-top-left rotate-90">
                    <div className="w-2.5 h-1.5 left-[0.60px] top-[3.88px] absolute bg-slate-900" />
                  </div>
                </div>
              </div>
            </section>

            {/* Price Details */}
            <section className="w-full px-4 sm:px-5 py-2.5 bg-white rounded-[10px] flex flex-col justify-start items-center gap-3.5">
              <div className="self-stretch flex justify-between items-start">
                <div className="w-full self-stretch flex flex-col justify-start items-start gap-0.5">
                  <div className="self-stretch justify-start text-slate-900 text-lg sm:text-xl font-bold font-['Manrope']">
                    Price Details
                  </div>
                </div>
              </div>

              <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                <div className="self-stretch flex justify-between items-start">
                  <div className="justify-start text-slate-900 text-xs sm:text-sm font-medium font-['Manrope']">
                    Guide ( 4 hours)
                  </div>
                  <div className="flex justify-start items-start gap-0.5">
                    <div className="w-2.5 self-stretch text-center justify-center text-gray-600 text-xs sm:text-sm font-normal font-['IBM_Plex_Sans']">
                      ฿
                    </div>
                    <div className="justify-start text-slate-900 text-xs sm:text-sm font-medium font-['Manrope']">
                      4,000.00
                    </div>
                  </div>
                </div>

                <div className="self-stretch pl-3 sm:pl-5 flex justify-between items-start">
                  <div className="justify-start text-gray-600 text-[10px] sm:text-xs font-normal font-['Manrope']">
                    price before discount
                  </div>
                  <div className="flex justify-start items-start gap-px">
                    <div className="w-1.5 self-stretch text-center justify-center text-gray-600 text-[10px] sm:text-xs font-normal font-['IBM_Plex_Sans']">
                      ฿
                    </div>
                    <div className="justify-start text-gray-600 text-[10px] sm:text-xs font-normal font-['Manrope']">
                      5,000.00
                    </div>
                  </div>
                </div>

                <div className="self-stretch pl-3 sm:pl-5 flex justify-between items-start">
                  <div className="justify-start text-gray-600 text-[10px] sm:text-xs font-normal font-['Manrope']">
                    discount
                  </div>
                  <div className="flex justify-start items-start gap-px">
                    <div className="w-[5px] self-stretch text-center justify-center text-red-500 text-[10px] sm:text-xs font-normal font-['Manrope']">
                      -
                    </div>
                    <div className="w-1.5 self-stretch text-center justify-center text-red-500 text-[10px] sm:text-xs font-normal font-['IBM_Plex_Sans']">
                      ฿
                    </div>
                    <div className="justify-start text-red-500 text-[10px] sm:text-xs font-normal font-['Manrope']">
                      1,000.00
                    </div>
                  </div>
                </div>
              </div>

              <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-gray-200" />

              <div className="self-stretch flex justify-between items-center">
                <div className="justify-start text-slate-900 text-sm sm:text-base font-bold font-['Manrope']">
                  Total
                </div>
                <div className="flex justify-start items-start gap-0.5">
                  <div className="w-2.5 self-stretch text-center justify-center text-gray-600 text-sm sm:text-base font-normal font-['IBM_Plex_Sans']">
                    ฿
                  </div>
                  <div className="justify-center text-slate-900 text-sm sm:text-base font-bold font-['Manrope']">
                    4,000.00
                  </div>
                </div>
              </div>
            </section>
          </aside>
          {/* end right col */}
        </form>
      </div>
    </div>
  )
}
