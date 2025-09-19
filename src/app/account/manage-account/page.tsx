"use client"

import {PageTitle, SubBody, Subtitle, Body, ButtonText} from '@/components/text-styles/textStyles'
import { FieldInput, PasswordInput } from '@/components/inputs/inputs'
import { FemaleGender, GenderInput, MaleGender, OtherGender } from '@/components/inputs/gender-input'
import { Button, TextButton } from '@/components/buttons/buttons'
import { useState } from 'react';
import { paths } from '@/config/paths.config'
import ProfilePageLayout from '@/components/layout/profile-page-layout';
import EditIcon from '@/assets/icons/edit.svg'
import PasswordValidate from '@/components/other/password-validate';
import XIcon from '@/assets/icons/X.svg'
import { useBoolean } from '@/hooks/use-boolean'


export default function ManageAccount() {
    const showChangePasswordPopup = useBoolean(false);
    const showDeleteAccountPopup = useBoolean(false);

    return (
    <ProfilePageLayout current_tab='manage_account'>
    <div className="flex-1 px-5 py-2.5 flex flex-col gap-2.5">
        <PageTitle className='px-4 mr-auto'>Manage Account</PageTitle>
        <div className="px-7 py-5 rounded-[10px] border border-light-gray flex flex-col justify-center gap-7">
            <div className="flex flex-col gap-1">
                <ButtonText>Password</ButtonText>
                <div className="self-stretch px-2.5 inline-flex justify-between items-center">
                    <Body className='text-custom-gray'>bla bla bla</Body>
                    <Button 
                        text='Change Password'
                        className='bg-pale-blue text-dark-blue !px-3 !h-8'
                        onClick={showChangePasswordPopup.setTrue}
                    />
                </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-1">
                <ButtonText>Delete Account</ButtonText>
                <div className="self-stretch px-2.5 inline-flex justify-between items-center">
                    <Body className='text-custom-gray'>bla bla bla</Body>                    
                    <Button 
                        text='Delete Account'
                        className='bg-light-red text-dark-red !px-3 !h-8'
                        onClick={showDeleteAccountPopup.setTrue}
                    />
                </div>
            </div>
        </div>
    </div>
    {showChangePasswordPopup.value && <ChangePasswordPopup Close={showChangePasswordPopup.setFalse}/>}
    {showDeleteAccountPopup.value && <DeleteAccountPopup Close={showDeleteAccountPopup.setFalse}/>}
    </ProfilePageLayout>
);
}

type PopupProps = {
    Close: () => void;
}

const ChangePasswordPopup = ( { Close }: PopupProps ) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [isPasswordValid, setIsPasswordValid] = useState(false)

    const handleChangePassword = () => {
        console.log("password changed")
        Close();
    }

    return (
    <div className='fixed top-0 left-0 bg-transparent-black w-full h-full flex justify-center items-center'>
    <div className="relative w-[480px] px-12 py-5 bg-white rounded-[20px] shadow-[var(--boxshadow-lifted)] flex flex-col gap-5">
        <div className="self-stretch flex flex-col justify-center items-center">
            <ButtonText>Change Password</ButtonText>
            <Button
                onClick={Close}>
                <XIcon className="absolute top-5 right-5 text-custom-gray" width='16' />
            </Button>
        </div>
        <div className="flex flex-col gap-2.5">
            <div className='w-full flex flex-col gap-3.5'>
                <div className="flex flex-col w-full">
                    <SubBody className='text-custom-gray'>Old Password</SubBody>
                    <PasswordInput
                        className='!h-8' 
                        value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}/>
                </div>
            </div>
            <div className='w-full flex flex-col gap-3.5'>
                <div className="flex flex-col w-full">
                    <SubBody className='text-custom-gray'>New Password</SubBody>
                    <PasswordInput 
                        className='!h-8'
                        value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                    <PasswordValidate
                        password={newPassword}
                        onValidationChange={(valid) => setIsPasswordValid(valid)}/>
                </div>
            </div>
            <div className='flex justify-end gap-1.5'>
                <Button 
                    as='button'
                    icon_after text='cancel'
                    className='!px-3 !h-8 bg-custom-white border'
                    onClick={Close}
                    >
                </Button>
                <Button 
                    as='button'
                    icon_after text='save'
                    className='!h-8 bg-light-blue text-dark-blue'
                    onClick={handleChangePassword}
                    disabled={!isPasswordValid || oldPassword == ''}
                    >
                </Button>
            </div>
        </div>
    </div>
    </div>
    )
}

const DeleteAccountPopup = ({Close} : PopupProps) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);

    const handleDeleteAccount = () => {
        console.log('delete account');
    }

    return (
        <div className="fixed inset-0 z-[50] flex justify-center items-center bg-transparent-black">
        <div className="relative w-[480px] px-12 py-5 bg-white rounded-[20px] shadow-[var(--boxshadow-lifted)] flex flex-col gap-5">
            <div className="self-stretch flex flex-col justify-center items-center">
                <ButtonText>Delete Account</ButtonText>
                <Button
                    onClick={Close}>
                    <XIcon className="absolute top-5 right-5 text-custom-gray" width='16' />
                </Button>
            </div>
            <div className="flex flex-col gap-10">
                <Body>
                    bla bla bla bla
                    bla bla bla bla
                    bla bla bla bla
                    bla bla bla bla
                    bla bla bla bla
                    bla bla bla bla
                    bla bla bla bla
                </Body>
                <div className='flex justify-end gap-1.5'>
                    <button 
                        className={`w-full relative bg-light-red/80 text-black !px-3 !h-8 rounded-xl overflow-hidden
                            ${isEnabled ? "cursor-pointer" : "cursor-default"}`}
                        onClick={() => {
                            handleDeleteAccount()
                            Close()
                        }}
                        onMouseEnter={() => {
                        if (!isEnabled) {
                            setIsAnimating(true)
                        }
                        }}
                        onMouseLeave={() => {
                            setIsAnimating(false)
                            setIsEnabled(false)
                        }}
                        onTransitionEnd={() => {
                        if (isAnimating && !isEnabled) {
                            setIsEnabled(true)
                        }
                        }}
                        >
                        <span className={`absolute inset-0 rounded-lg bg-red opacity-30 top-0 left-0  duration-[3000ms] ease-linear
                            ${isAnimating ? "translate-x-0 transition-transform" : "-translate-x-full transition-none"}`}></span>
                        <span className='relative z-10'>Delete Account</span>
                    </button>
                </div>
            </div>
        </div>
        </div>
    )
}
