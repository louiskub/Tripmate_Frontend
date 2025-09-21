import React, { FC, ReactNode } from "react";

type TextProps = {
    children: ReactNode;
    className?: string;
};

// Variants as separate components
export const PageTitle: FC<TextProps> = ({ children, className }) => (
    <h1 className={`text-2xl font-extrabold tracking-wider ${className || ""}`}>{children}</h1>
);

export const Title: FC<TextProps> = ({ children, className }) => (
    <h2 className={`text-xl font-bold tracking-wide ${className || ""}`}>{children}</h2>
);

export const Subtitle: FC<TextProps> = ({ children, className }) => (
    <h3 className={`text-lg font-semibold ${className || ""}`}>{children}</h3>
);

export const Body: FC<TextProps> = ({ children, className }) => (
    <span className={`text-base font-medium ${className || ""}`}>{children}</span>
);

export const ButtonText: FC<TextProps> = ({ children, className }) => (
    <span className={`text-base font-bold h-content tracking-wide ${className || ""}`}>{children}</span>
);

export const SubBody: FC<TextProps> = ({ children, className }) => (
    <span className={`text-sm font-medium ${className || ""}`}>{children}</span>
);

export const SmallTag: FC<TextProps> = ({ children, className }) => (
    <span className={`text-xs font-semibold ${className || ""}`}>{children}</span>
);


export const Caption: FC<TextProps> = ({ children, className }) => (
    <span className={`text-xs font-regular ${className || ""}`}>{children}</span>
);

export const SubCaption: FC<TextProps> = ({ children, className }) => (
    <span className={`text-[10px] font-regular ${className || ""}`}>{children}</span>
);
