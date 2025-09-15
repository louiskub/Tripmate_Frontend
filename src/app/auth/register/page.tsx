import Navbar from '@/components/navbar/navbar'

export default function RegisterPage() {
  return (
    <div className="flex bg-[url('/images/wave2.jpg')] shadow-[var(--boxshadow-lifted)] h-[100vh] bg-cover bg-center">
      <Navbar />
      <div className="-translate-1/2 left-1/2 top-1/2 w-[600px] h-[586px] relative bg-gradient-to-br from-translucent-white/50 to-transparent-white/20 rounded-[20px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)] shadow-[inset_0px_0px_20px_0px_rgba(255,255,255,0.20)] outline outline-2 outline-offset-[-2px] outline-translucent-white/50 backdrop-blur-lg">
        <div className="w-96 h-[480px] pb-16 left-[80px] top-[106px] absolute inline-flex flex-col justify-between items-center">
          <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
              <div className="self-stretch flex flex-col justify-start items-start">
                  <div className="text-center justify-start text-black/20 text-base font-bold font-['Manrope']">Username</div>
                  <div data-property-1="Default" data-show-blinking-cursor="true" data-show-icon="false" data-show-placeholder="false" data-show-text="true" className="w-96 h-9 min-w-24 p-2.5 bg-dark-white rounded-[10px] shadow-[0px_0px_5px_0px_rgba(0,0,0,0.20)] inline-flex justify-start items-center gap-1" />
              </div>
              <div className="self-stretch flex flex-col justify-start items-start">
                  <div className="text-center justify-start text-black/20 text-base font-bold font-['Manrope']">Email</div>
                  <div data-property-1="Default" data-show-blinking-cursor="true" data-show-icon="false" data-show-placeholder="false" data-show-text="true" className="w-96 h-9 min-w-24 p-2.5 bg-dark-white rounded-[10px] shadow-[0px_0px_5px_0px_rgba(0,0,0,0.20)] inline-flex justify-start items-center gap-1" />
              </div>
              <div className="self-stretch flex flex-col justify-start items-start">
                  <div className="text-center justify-start text-black/20 text-base font-bold font-['Manrope']">Password</div>
                  <div data-property-1="Variant3" data-show-blinking-cursor="true" data-show-icon="false" data-show-placeholder="true" data-show-text="true" className="self-stretch h-9 min-w-24 px-2.5 bg-dark-white rounded-[10px] shadow-[0px_0px_5px_0px_rgba(0,0,0,0.20)] inline-flex justify-between items-center overflow-hidden">
                      <div className="text-center justify-start text-black/20 text-[10px] font-normal font-['Manrope']">⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤</div>
                      <div data-property-1="hide button" className="w-4 h-4 relative overflow-hidden">
                          <div className="w-4 h-4 left-[0.56px] top-[1.12px] absolute bg-stone-900" />
                      </div>
                  </div>
                  <div className="self-stretch px-2.5 pt-[5px] flex flex-col justify-start items-start">
                      <div className="inline-flex justify-start items-center">
                          <div className="w-5 h-5 relative overflow-hidden">
                              <div className="w-3.5 h-3.5 left-[2.50px] top-[2.50px] absolute bg-dark-blue" />
                          </div>
                          <div className="text-center justify-start text-dark-blue text-sm font-medium font-['Manrope']">Minimum 8 characters</div>
                      </div>
                      <div className="inline-flex justify-start items-center">
                          <div className="w-5 h-5 relative overflow-hidden">
                              <div className="w-3.5 h-3.5 left-[2.50px] top-[2.50px] absolute bg-black/20" />
                          </div>
                          <div className="text-center justify-start text-black/20 text-sm font-medium font-['Manrope']">Number</div>
                      </div>
                      <div className="inline-flex justify-start items-center">
                          <div className="w-5 h-5 relative overflow-hidden">
                              <div className="w-3.5 h-3.5 left-[2.50px] top-[2.50px] absolute bg-dark-blue" />
                          </div>
                          <div className="text-center justify-start text-dark-blue text-sm font-medium font-['Manrope']">Lowercase</div>
                      </div>
                      <div className="inline-flex justify-start items-center">
                          <div className="w-5 h-5 relative overflow-hidden">
                              <div className="w-3.5 h-3.5 left-[2.50px] top-[2.50px] absolute bg-dark-blue" />
                          </div>
                          <div className="text-center justify-start text-dark-blue text-sm font-medium font-['Manrope']">Uppercase</div>
                      </div>
                  </div>
              </div>
          </div>
          <div className="self-stretch flex flex-col justify-start items-center gap-2.5">
              <div data-property-1="Default" className="w-96 h-9 min-w-24 px-5 py-3 rounded-[10px] outline outline-2 outline-offset-[-2px] outline-stone-900 inline-flex justify-center items-center gap-2.5 overflow-hidden">
                  <div className="text-center justify-start text-stone-900 text-base font-bold font-['Manrope']">Register</div>
              </div>
              <div className="inline-flex justify-center items-center gap-[5px]">
                  <div className="text-center justify-start text-stone-900 text-base font-medium font-['Manrope']">Already have an account?</div>
                  <div className="text-center justify-start text-dark-blue text-base font-bold font-['Manrope'] underline">Login</div>
              </div>
          </div>
      </div>
      <div className="left-[250px] top-[23px] absolute text-center justify-start text-stone-900 text-2xl font-extrabold font-['Manrope']">Register</div>
  </div>
  </div>
  )

}
