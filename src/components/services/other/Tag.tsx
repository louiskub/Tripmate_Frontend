import {ButtonText, Subtitle, SmallTag} from '@/components/text-styles/textStyles';
import React, { FC, ReactNode } from "react";

type TagProps = {
    text?: string;
    className?: string;
    children?: React.ReactNode;
    icon_after?: boolean
};

export const Tag: FC<TagProps> = ({ children, text, className, icon_after=false} : TagProps) => {
    return (
        <span 
            className={`inline-flex justify-center items-center gap-0.5 rounded-2xl px-2 h-5 self-start
                ${className || 'bg-pale-blue text-dark-blue'}`}
        >
            {!icon_after && children}

            {text && <SmallTag>{text}</SmallTag>}

            {icon_after && children}
        </span>
    );
};