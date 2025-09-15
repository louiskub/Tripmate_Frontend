import Navbar from "@/components/navbar/navbar";
import SideNavBar from '@/components/navbar/side-navbar'
import React, { FC, ReactNode } from "react";

type DefaultPageProps = {
    children: ReactNode;
};

const DefaultLayout: FC<DefaultPageProps> = ({ children }) => {
    return (
        <div className="flex flex-col h-[100vh]">
            <Navbar />
            <div className="h-full flex bg-dark-white">
                <SideNavBar />
                <div className="flex-1 p-7.5">{children}</div>
            </div>
        </div>
    );
};

export default DefaultLayout;

