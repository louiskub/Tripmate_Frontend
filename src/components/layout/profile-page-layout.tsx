import DefaultPage from './default-layout';
import ProfileSideNavBar from '@/components/navbar/side-nav-variants/profile-side-navbar'
import React, { Children, FC, ReactNode } from "react";

type DefaultPageProps = {
    children: ReactNode;
    current_tab: string
};

const ProfilePageLayout: FC<DefaultPageProps> = ({ children, current_tab }) => {
    return (
        <DefaultPage>
            <div className='flex w-full min-h-full p-2.5 bg-custom-white rounded-2xl overflow-hidden'>
                <ProfileSideNavBar current={current_tab}></ProfileSideNavBar>
                {children}
            </div>
        </DefaultPage>
    );
};

export default ProfilePageLayout;

