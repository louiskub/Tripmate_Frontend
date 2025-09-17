import ProfilePageLayout from '@/components/layout/profile-page-layout';

export default function Profile() {
  return (
    <ProfilePageLayout>
      <div className="px-5 py-2.5 inline-flex flex-col justify-start items-start gap-2.5">
    <div className="w-28 text-center justify-start text-stone-900 text-2xl font-extrabold font-['Manrope']">Profile</div>
    <div className="w-[886px] h-48 px-7 py-5 bg-custom-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-light-gray inline-flex justify-start items-center gap-10">
        <div className="inline-flex flex-col justify-start items-center gap-[5px]">
            <div className="w-28 h-28 relative">
                <img className="w-28 h-28 left-0 top-0 absolute rounded-[100px] border border-stone-900" src="https://placehold.co/120x120" />
            </div>
            <div className="flex flex-col justify-start items-start gap-1.5">
                <div className="text-center justify-start"><span className="text-black/20 text-lg font-semibold font-['Manrope']">@</span><span className="text-stone-900 text-lg font-semibold font-['Manrope']">jueeeeeen</span></div>
            </div>
        </div>
        <div className="w-[560px] inline-flex flex-col justify-start items-start gap-2.5">
            <div className="self-stretch inline-flex justify-start items-start gap-1.5">
                <div className="flex-1 inline-flex flex-col justify-start items-start">
                    <div className="text-center justify-start text-stone-900 text-base font-bold font-['Manrope']">First name</div>
                    <div data-property-1="Default" data-show-blinking-cursor="true" data-show-icon="false" data-show-placeholder="true" data-show-text="true" className="self-stretch h-9 min-w-24 p-2.5 bg-custom-white rounded-[10px] inline-flex justify-start items-center gap-1 overflow-hidden">
                        <div className="text-center justify-start text-stone-900 text-lg font-semibold font-['Manrope']">Emily</div>
                    </div>
                </div>
                <div className="flex-1 inline-flex flex-col justify-start items-start">
                    <div className="text-center justify-start text-stone-900 text-base font-bold font-['Manrope']">Last name</div>
                    <div data-property-1="Default" data-show-blinking-cursor="true" data-show-icon="false" data-show-placeholder="true" data-show-text="true" className="self-stretch h-9 min-w-24 p-2.5 bg-custom-white rounded-[10px] inline-flex justify-start items-center gap-1 overflow-hidden">
                        <div className="text-center justify-start text-stone-900 text-lg font-semibold font-['Manrope']">Chow</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div className="w-[886px] px-7 py-5 bg-custom-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-light-gray flex flex-col justify-center items-start gap-2.5">
        <div className="self-stretch flex flex-col justify-start items-start">
            <div className="text-center justify-start text-stone-900 text-base font-bold font-['Manrope']">Email</div>
            <div data-property-1="Default" data-show-blinking-cursor="true" data-show-icon="false" data-show-placeholder="true" data-show-text="true" className="self-stretch h-9 min-w-24 p-2.5 bg-custom-white rounded-[10px] inline-flex justify-start items-center gap-1 overflow-hidden">
                <div className="text-center justify-start text-stone-900 text-base font-medium font-['Manrope']">example@gmail.com</div>
            </div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-start">
            <div className="text-center justify-start text-stone-900 text-base font-bold font-['Manrope']">Telephone Number</div>
            <div data-property-1="Default" data-show-blinking-cursor="true" data-show-icon="false" data-show-placeholder="true" data-show-text="true" className="self-stretch h-9 min-w-24 p-2.5 bg-custom-white rounded-[10px] inline-flex justify-start items-center gap-1 overflow-hidden">
                <div className="text-center justify-start text-stone-900 text-base font-medium font-['Manrope']">0812345678</div>
            </div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-start">
            <div className="text-center justify-start text-stone-900 text-base font-bold font-['Manrope']">Birth date</div>
            <div data-property-1="Default" data-show-blinking-cursor="true" data-show-icon="false" data-show-placeholder="true" data-show-text="true" className="self-stretch h-9 min-w-24 p-2.5 bg-custom-white rounded-[10px] inline-flex justify-start items-center gap-1 overflow-hidden">
                <div className="text-center justify-start text-stone-900 text-base font-medium font-['Manrope']">01/01/1111</div>
            </div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-start">
            <div className="text-center justify-start text-stone-900 text-base font-bold font-['Manrope']">Gender</div>
            <div className="self-stretch inline-flex justify-start items-start gap-1.5">
                <div data-property-1="checked" className="w-24 h-9 min-w-24 px-3 py-1.5 bg-pink-100 rounded-[10px] flex justify-center items-center gap-[5px]">
                    <div className="text-center justify-start text-pink-400 text-base font-medium font-['Manrope']">Female</div>
                    <div className="w-4 h-4 relative overflow-hidden">
                        <div className="w-3 h-4 left-[2.46px] top-0 absolute bg-pink-400" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
    </ProfilePageLayout>
  );
}
