import React, { FC, ReactNode, ChangeEvent, useState, Children } from "react";
import { ButtonText, Body } from '@/components/text-styles/textStyles'
import DropdownIcon from '@/assets/icons/pagination-arrow.svg'
import EyeOpenIcon from '@/assets/icons/eye-open.svg'
import EyeClosedIcon from '@/assets/icons/eye-closed.svg'

type FieldInputProps = {
    children?: ReactNode;
    className?: string;
    type?: string;
    value: string;                              // controlled value
    placeholder?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void; // notify parent
};

export const FieldInput: FC<FieldInputProps> = ({
    type = "text",
    children,
    className,
    value,
    placeholder,
    onChange,
    }) => (
    <div className={`flex items-center gap-2 px-2 text-custom-black bg-custom-white rounded-[10px] h-9 shadow-[var(--boxshadow-lifted)] ${className}`}>
        {children}
        <input className="h-full w-full focus:outline-0 appearance-none bg-transparent" type={type} value={value} placeholder={placeholder} onChange={onChange} />
    </div>
);

export type DropdownOptionProps = {
    label: string;
    value?: string;
    icon?: ReactNode;
    onSelect?: () => void;
}

const DropdownOption: FC<DropdownOptionProps> = ({label, value, icon, onSelect}: DropdownOptionProps) => {
    return (
        <div className="text-custom-gray flex items-center gap-2 px-2.5 bg-custom-white h-9 cursor-pointer hover:bg-dark-white select-none"
            onClick={onSelect}
        >
            { icon &&
                <span className="w-4 h-4 flex items-center">
                    {icon}
                </span>
            }
            {label}
        </div>
    )
}

type DropdownProps = {
    options: DropdownOptionProps[];
    value: string;
    onSelect: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export const Dropdown: FC<DropdownProps> = ({
    options,
    value,
    onSelect,
    placeholder = "Select...",
    className,
    }) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedLabel = options.find(o => o.value === value)?.label;

    return (
        <div className={`relative shadow-[var(--boxshadow-lifted)] bg-custom-white rounded-[10px] ${className}`}>
        <div
            className="cursor-pointer flex justify-between items-center h-9 gap-2 px-2.5 text-custom-black"
            onClick={() => setIsOpen(!isOpen)}
        >
            <Body className={`${!selectedLabel && 'text-custom-gray'}`}>{selectedLabel || placeholder}</Body>
            <DropdownIcon className={`rotate-90 ${isOpen && 'scale-x-[-1]'}`} width='14'/>
        </div>

        {isOpen && (
            <div className="absolute z-10 w-full bg-white shadow-lg max-h-60 overflow-auto rounded-[10px] mt-1">
            {options.map((option) => (
                <DropdownOption
                    key={option.value ?? option.label}
                    label={option.label} 
                    value={option.value ?? option.label} 
                    onSelect={() => {
                        onSelect(option.value ?? option.label);
                        setIsOpen(false);
                }}/>
            ))}
            </div>
        )}
        </div>
    );
};

export const PasswordInput: FC<FieldInputProps> = ({
    children,
    className,
    value,
    placeholder,
    onChange,
    }) => 
{
    const [show, setShow] = useState(false)
    return (
    <div className={`flex items-center gap-2 px-2 text-custom-black bg-custom-white rounded-[10px] h-9 shadow-(--boxshadow-lifted) ${className}`}>
        {children}
        <input className="h-full w-full focus:outline-0 appearance-none bg-transparent" type={show ? 'text': 'password'} value={value} placeholder={placeholder} onChange={onChange} />
        
        <div
            className="w-5 h-5 text-dark-gray"
            onClick={() => setShow(!show)}>
            {
                show ? <EyeClosedIcon /> : <EyeOpenIcon />
            }
        </div>
    </div>
)}