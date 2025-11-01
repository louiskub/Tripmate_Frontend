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
            className={`inline-flex justify-center items-center gap-[5px] hover:cursor-pointer rounded-[10px] select-none default-btn
                ${(text) ? 'px-5 h-9' : 'aspect-square rounded-full'} 
                ${className || 'hover:text-dark-blue !scale-100'}
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
            className={`inline-flex justify-center items-center gap-1 hover:cursor-pointer rounded-2xl py-2 select-none default-btn
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

type MenuButtonProps = {
    text?: string;
    href?: string;
    className?: string;
};

export const MenuButton: FC<MenuButtonProps> = ({text, href, className} : MenuButtonProps) => {
    return (
        <a 
            className={`flex justify-center items-center px-5 h-10 min-w-24 hover:cursor-pointer hover:text-dark-blue active:translate-y-0.5 rounded-2xl default-btn ${className || 'text-custom-black'}`}
            href={href}
        >
            {text && <Subtitle className={className}>{text}</Subtitle>}
        </a>
    );
};