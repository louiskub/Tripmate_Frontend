import Navbar from "@/components/navbar/navbar";
import SideNavBar from '@/components/navbar/side-navbar'
import React, { FC, ReactNode } from "react";

type DefaultPageProps = {
    children: ReactNode;
    current_tab?: string
};

const DefaultLayout: FC<DefaultPageProps> = ({ children, current_tab }) => {
    return (
        <div className="flex flex-col min-h-screen w-full max-w-screen ">
            <Navbar />
            <div className="min-h-screen w-full flex bg-dark-white">
                <SideNavBar current={current_tab} />
                <div className="w-full px-24 py-2.5">{children}</div>
            </div>
        </div>
    );
};

export default DefaultLayout;

