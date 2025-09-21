import AdminNavbar from "@/components/navbar/default-nav-variants/admin-navbar";
import VendorSideNavbar, {AccountNav}  from '@/components/navbar/side-nav-variants/vendor-side-navbar'
import React, { FC, ReactNode } from "react";

type DefaultPageProps = {
    children: ReactNode;
};

const VendorPageLayout: FC<DefaultPageProps> = ({ children }) => {
    return (
        <div className="flex flex-col">
            <AdminNavbar />

            <div className="bg-dark-white flex flex-1">
                <VendorSideNavbar vendorType="hotel" />
                <div className="flex flex-1 py-5 pl-5">
                    <AccountNav/>
                    <div className="flex-1 px-6 pt-2">{children}</div>  
                </div>
            </div>
        </div>
    );
};

export default VendorPageLayout;