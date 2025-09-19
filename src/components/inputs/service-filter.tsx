import {PageTitle, SubBody, Subtitle, Body, ButtonText} from '@/components/text-styles/textStyles'
import { FieldInput, PasswordInput } from '@/components/inputs/inputs'
import { FemaleGender, GenderInput, MaleGender, OtherGender } from '@/components/inputs/gender-input'
import { Button, TextButton } from '@/components/buttons/buttons'
import { useState } from 'react';
import { paths } from '@/config/paths.config'
import ProfilePageLayout from '@/components/layout/profile-page-layout';
import EditIcon from '@/assets/icons/edit.svg'
import PasswordValidate from '@/components/other/password-validate';
import { useBoolean } from '@/hooks/use-boolean'

const ServiceFilter = () => {
    return (
        <div className="self-stretch py-1.5 bg-custom-white rounded-[10px] shadow-[0px_0px_5px_0px_rgba(0,0,0,0.20)] inline-flex flex-col justify-start items-start gap-1 overflow-hidden">
            <div data-property-1="Default" className="h-7 px-2.5 py-[2.50px] inline-flex justify-start items-center gap-1">
                <div className="w-5 self-stretch relative">
                    <div className="w-5 h-5 left-0 top-0 absolute bg-light-gray" />
                </div>
                <div className="text-center justify-start text-gray text-sm font-medium font-['Manrope']">text</div>
            </div>
            <div data-property-1="Default" className="h-7 px-2.5 py-[2.50px] inline-flex justify-start items-center gap-1">
                <div className="w-5 self-stretch relative">
                    <div className="w-5 h-5 left-0 top-0 absolute bg-light-gray" />
                </div>
                <div className="text-center justify-start text-gray text-sm font-medium font-['Manrope']">text</div>
            </div>
            <div data-property-1="Default" className="h-7 px-2.5 py-[2.50px] inline-flex justify-start items-center gap-1">
                <div className="w-5 self-stretch relative">
                    <div className="w-5 h-5 left-0 top-0 absolute bg-light-gray" />
                </div>
                <div className="text-center justify-start text-gray text-sm font-medium font-['Manrope']">text</div>
            </div>
            <div data-property-1="Default" className="h-7 px-2.5 py-[2.50px] inline-flex justify-start items-center gap-1">
                <div className="w-5 self-stretch relative">
                    <div className="w-5 h-5 left-0 top-0 absolute bg-light-gray" />
                </div>
                <div className="text-center justify-start text-gray text-sm font-medium font-['Manrope']">text</div>
            </div>
        </div>
    )
}

export default ServiceFilter