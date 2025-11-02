import {Body, ButtonText, Subtitle} from '@/components/text-styles/textStyles';
import React, { FC, ReactNode } from "react";
import FemaleIcon from '@/assets/icons/female.svg';
import MaleIcon from '@/assets/icons/male.svg';
import OtherIcon from '@/assets/icons/question.svg';

type GenderInputProps = {
    onChange: (value: string) => void;
    selected?: string;
};

export const GenderInput: FC<GenderInputProps> = ({onChange, selected = 'other'} : GenderInputProps) => {
    return (
        <div className='flex gap-2'>
            <FemaleGender active={selected == 'female'} onClick={() => {onChange('female')}}/>
            <MaleGender active={selected == 'male'} onClick={() => {onChange('male')}}/>
            <OtherGender active={selected == 'Other'} onClick={() => {onChange('Other')}}/>
        </div>
    );
};

type GenderProps = {
    onClick?: () => void;
    active?: boolean;
};

export const FemaleGender: FC<GenderProps> = ({onClick, active}) => {
    return (
        <span 
            className={` inline-flex justify-center min-w-24 w-auto items-center gap-1 rounded-[10px] h-9 select-none
            ${active ? 'bg-pink-100 text-pink-400': 'hover:cursor-pointer text-dark-gray shadow-[var(--boxshadow-lifted)]'} `}
            onClick={onClick}>
            <Body>Female</Body>
            <FemaleIcon width='16'/>
        </span>
    );
};

export const MaleGender: FC<GenderProps> = ({onClick, active}) => {
    return (
        <span 
            className={` inline-flex justify-center min-w-24 w-auto items-center gap-1 rounded-[10px] h-9 select-none
            ${active ? 'bg-pale-blue text-dark-blue': 'hover:cursor-pointer text-dark-gray shadow-[var(--boxshadow-lifted)]'} `}
            onClick={onClick}>
            <Body>Male</Body>
            <MaleIcon width='16'/>
        </span>
    );
};

export const OtherGender: FC<GenderProps> = ({onClick, active}) => {
    return (
        <span 
            className={` inline-flex justify-center min-w-24 w-auto items-center gap-1 rounded-[10px] h-9 select-none
            ${active ? 'bg-light-gray text-custom-black': 'hover:cursor-pointer text-dark-gray shadow-[var(--boxshadow-lifted)]'} `}
            onClick={onClick}>
            <Body>Other</Body>
            <OtherIcon width='16'/>
        </span>
    );
};
