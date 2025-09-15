import {ButtonText, SubBody, Subtitle, Body} from '@/components/TextStyles'
import React, { FC, ReactNode } from "react";

type ButtonProps = {
    as?: "button" | "a";
    href?: string;
    text?: string;
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode;
};

export const Button: FC<ButtonProps> = ({as = "button", children, text, onClick, className, href} : ButtonProps) => {
    const Comp = as;
    return (
        <Comp 
            className={`flex justify-center items-center gap-1 ${text ? 'min-w-24 px-5' : 'aspect-square'} hover:cursor-pointer rounded-2xl  h-9 ${className || 'hover:text-dark-blue'}`}
            href={as === "a" ? href : undefined}
            onClick={as === "button" ? onClick : undefined}
        >
            {children}

            {text && <ButtonText>{text}</ButtonText>}
        </Comp>
    );
};

<div data-show-icon="true" data-show-text="true" className="self-stretch h-9 px-4 inline-flex justify-start items-center gap-2.5">
<div className="w-3.5 h-3.5 relative overflow-hidden">
<div className="w-3.5 h-2.5 left-0 top-[1.63px] absolute bg-stone-900" />
</div>
<div className="text-center justify-start text-stone-900 text-sm font-medium font-['Manrope']">My Groups</div>
</div>

type MenuButtonProps = {
    text?: string;
    href?: string;
    className?: string;
};

export const MenuButton: FC<MenuButtonProps> = ({text, href, className} : MenuButtonProps) => {
    return (
        <a 
            className={`flex justify-center items-center px-5 h-10 min-w-24 hover:cursor-pointer hover:text-dark-blue active:translate-y-0.5 rounded-2xl ${className || 'text-custom-black'}`}
            href={href}
        >
            {text && <Subtitle>{text}</Subtitle>}
        </a>
    );
};