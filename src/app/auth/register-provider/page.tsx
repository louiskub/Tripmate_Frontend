"use client"

import Navbar from '@/components/navbar/navbar';
import {PageTitle, SubBody, Subtitle, Body, ButtonText} from '@/components/textStyles'
import { FieldInput, PasswordInput } from '@/components/inputs'
import { Button, TextButton } from '@/components/buttons';
import { useState } from 'react';
import { paths } from '@/config/paths.config';

import PasswordValidate from '@/components/password-validate';
import { Dropdown, DropdownOptionProps } from '@/components/inputs';



export default function RegisterPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [isPasswordValid, setIsPasswordValid] = useState(false)
    const [business, setBusiness] = useState("")

    const options: DropdownOptionProps[] = [
        { label: 'Hotel', value: 'hotel'},
        { label: 'Restaurant', value: 'restaurant'},
        { label: 'Rental Car', value: 'rental_car'},
    ];

    const handleRegister = () => [
        console.log("register")
    ]

    return (
        <div className="bg-[url('/images/wave2.jpg')] shadow-[var(--boxshadow-lifted)] h-[100vh] bg-cover bg-center">
            <Navbar />
            <div className="flex flex-col relative -translate-1/2 left-1/2 top-1/2 w-[600px] bg-gradient-to-br from-translucent-white to-transparent-white rounded-2xl shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)]  border-2 border-translucent-white backdrop-blur-lg">
                <PageTitle className='text-center mt-6 mb-14'>Register Business Account</PageTitle>
                <div className="flex-1 w-full items-center flex flex-col px-20 justify-between">

                    <div className='w-full flex flex-col gap-3.5'>
                        <div className="flex flex-col w-full">
                            <Body className='text-custom-gray'>Username</Body>
                            <FieldInput value={username} onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                        <div className="flex flex-col w-full">
                            <Body className='text-custom-gray'>Email</Body>
                            <FieldInput value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="flex flex-col w-full">
                            <Body className='text-custom-gray'>password</Body>
                            <PasswordInput type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                            <PasswordValidate password={password}
                            onValidationChange={(valid) => setIsPasswordValid(valid)}/>
                        </div>
                        <div className="flex flex-col w-full">
                            <Body className='text-custom-gray'>Business Type</Body>
                            <Dropdown options={options} value={business} onSelect={setBusiness} placeholder='Select Business Type'></Dropdown>
                        </div>
                    </div>
                    
                    <div className='flex flex-col gap-1 w-full mb-14 mt-12'>
                        <Button 
                        className='w-full border-2 rounded-[10px] border-custom-black' 
                        text='Register'
                        onClick={handleRegister}
                        disabled={!isPasswordValid} />
                    
                        <div className="self-stretch flex flex-col justify-start items-center gap-2.5">
                            <span className='flex items-center'>
                                <Body>Already have an account?</Body>
                                <TextButton as='a' href={paths.auth.login} text='Log in' className='px-2 underline text-dark-blue'/>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
