import {ButtonText, SubBody, Subtitle, Body} from '@/components/textStyles'
import React, { FC, ReactNode } from "react";

type PageOptionProps = {
    href: string;
    text: string;
    className?: string;
    children: React.ReactNode;
    active?: boolean
};

export const PageOptionDropdown: FC<PageOptionProps> = ({children, text, className, href, active = false} : PageOptionProps) => {
    return (
        <a 
            className={`w-full px-5 flex items-center gap-2.5 hover:cursor-pointer h-8 
                ${className} ${active ? 'text-dark-blue' : 'hover:text-dark-blue'}`}
            href={href}
        >   
            <span className='flex items-center justify-center w-3.5 h-3.5'>
                {children}
            </span>
            
            <SubBody>{text}</SubBody>
        </a>
    );
};

export const PageOptionSide: FC<PageOptionProps> = ({children, text, className, href, active = false} : PageOptionProps) => {
    return (
        <a 
            className={`w-full px-5 flex items-center gap-2.5 hover:cursor-pointer h-10 ${className } ${active ? 'text-dark-blue' : 'hover:text-dark-blue'}`}
            href={href}
        >   
            <span className='flex items-center justify-center w-5 h-5'>
                {children}
            </span>
            
            <Body>{text}</Body>
        </a>
    );
};