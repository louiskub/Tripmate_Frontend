import ProfilePageLayout from '@/components/layout/profile-page-layout';

export default function ManageAccount() {
  return (
    <ProfilePageLayout>
      <div className="self-stretch self-stretch px-5 py-2.5 inline-flex flex-col justify-start items-start gap-2.5">
    <div className="text-center justify-start text-stone-900 text-2xl font-extrabold font-['Manrope']">Manage Account</div>
    <div className="w-[886px] px-7 py-5 bg-custom-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-light-gray flex flex-col justify-center items-start gap-7">
        <div className="self-stretch flex flex-col justify-start items-start gap-1">
            <div className="self-stretch flex flex-col justify-start items-start">
                <div className="text-center justify-start text-stone-900 text-base font-bold font-['Manrope']">Password</div>
            </div>
            <div className="self-stretch px-2.5 inline-flex justify-between items-center">
                <div className="text-center justify-start text-black/20 text-sm font-medium font-['Manrope']">Bla bla bla Bla bla bla Bla bla bla Bla bla bla Bla bla bla Bla bla bla Bla bla bla Bla bla bla Bla bla bla </div>
                <div data-property-1="pale-blue" data-show-icon-before="false" data-show-icons-after="false" className="h-8 p-3 bg-pale-blue rounded-2xl flex justify-center items-center gap-1 overflow-hidden">
                    <div className="text-center justify-start text-dark-blue text-base font-bold font-['Manrope']">Change Password</div>
                </div>
            </div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-start gap-1">
            <div className="self-stretch flex flex-col justify-start items-start">
                <div className="text-center justify-start text-stone-900 text-base font-bold font-['Manrope']">Delete Account</div>
            </div>
            <div className="self-stretch px-2.5 inline-flex justify-between items-center">
                <div className="text-center justify-start text-black/20 text-sm font-medium font-['Manrope']">Bla bla bla Bla bla bla Bla bla bla Bla bla bla Bla bla bla Bla bla bla Bla bla bla Bla bla bla Bla bla bla </div>
                <div data-property-1="light-red" data-show-icon-before="false" data-show-icons-after="false" className="h-8 p-3 bg-light-red rounded-2xl flex justify-center items-center gap-1 overflow-hidden">
                    <div className="text-center justify-start text-dark-red text-base font-bold font-['Manrope']">Delete Account</div>
                </div>
            </div>
        </div>
    </div>
</div>
    </ProfilePageLayout>
  );
}
