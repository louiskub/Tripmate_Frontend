import {ButtonText, Subtitle} from '@/components/text-styles/textStyles';
import React, { FC, ReactNode } from "react";

type ButtonProps = {
    as?: "button" | "a";
    href?: string;
    text?: string;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    disabled?: boolean;
    className?: string;
    children?: React.ReactNode;
    icon_after?: boolean
};

export const Button: FC<ButtonProps> = ({as = "button", children, text, onClick, disabled = false, className, href, icon_after=false} : ButtonProps) => {
    const Comp = as;

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation(); // ✅ prevent bubbling to parent
        if (onClick) onClick(e);
    };

    return (
        <Comp 
            className={`inline-flex justify-center items-center gap-[5px] hover:cursor-pointer rounded-[10px] select-none
                ${(text) ? 'px-5 h-9' : 'aspect-square rounded-full'} 
                ${className || 'hover:text-dark-blue'}
                ${disabled && 'pointer-events-none opacity-50'}`}
            href={as === "a" ? href : undefined}
            onClick={as === "button" ? handleClick : undefined}
        >
            {!icon_after && children}

            {text && <ButtonText>{text}</ButtonText>}

            {icon_after && children}
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