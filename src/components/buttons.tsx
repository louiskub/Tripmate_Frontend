import {ButtonText, Subtitle} from '@/components/textStyles';
import React, { FC, ReactNode } from "react";

type ButtonProps = {
    as?: "button" | "a";
    href?: string;
    text?: string;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    children?: React.ReactNode;
};

export const Button: FC<ButtonProps> = ({as = "button", children, text, onClick, disabled = false, className, href} : ButtonProps) => {
    const Comp = as;
    return (
        <Comp 
            className={`inline-flex justify-center items-center gap-1 hover:cursor-pointer rounded-2xl h-9 select-none
                ${(text) ? 'px-5' : 'aspect-square'} 
                ${className || 'hover:text-dark-blue'}
                ${disabled && 'pointer-events-none opacity-50'}`}
            href={as === "a" ? href : undefined}
            onClick={as === "button" ? onClick : undefined}
        >
            {children}

            {text && <ButtonText>{text}</ButtonText>}
        </Comp>
    );
};

export const TextButton: FC<ButtonProps> = ({as = "button", children, text, onClick, disabled = false, className, href} : ButtonProps) => {
    const Comp = as;
    return (
        <Comp 
            className={`inline-flex justify-center items-center gap-1 hover:cursor-pointer rounded-2xl py-2 select-none
                ${className}
                ${disabled && 'pointer-events-none opacity-50'}`}
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
            {text && <Subtitle className={className}>{text}</Subtitle>}
        </a>
    );
};