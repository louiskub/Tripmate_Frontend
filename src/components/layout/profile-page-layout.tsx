import DefaultPage from './default-layout';
import ProfileSideNavBar from '@/components/navbar/side-nav-variants/profile-side-navbar'
import React, { Children, FC, ReactNode } from "react";

type DefaultPageProps = {
    children: ReactNode;
};

const ProfilePageLayout: FC<DefaultPageProps> = ({ children }) => {
    return (
        <DefaultPage>
            <div className='flex h-full bg-custom-white rounded-2xl overflow-hidden'>
                <ProfileSideNavBar></ProfileSideNavBar>
                {children}
            </div>
        </DefaultPage>
    );
};

export default ProfilePageLayout;

