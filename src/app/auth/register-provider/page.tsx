"use client"

import Navbar from '@/components/navbar/navbar';
import {PageTitle, SubBody, Subtitle, Body, ButtonText} from '@/components/text-styles/textStyles'
import { FieldInput, PasswordInput } from '@/components/inputs/inputs'
import { Button, TextButton } from '@/components/buttons/buttons';
import { useState } from 'react';
import { paths } from '@/config/paths.config';

import PasswordValidate from '@/components/other/password-validate';
import { Dropdown, DropdownOptionProps } from '@/components/inputs/inputs';
import { useRouter } from "next/navigation"
import axios from 'axios';
import { endpoints } from '@/config/endpoints.config';


export default function RegisterPage() {
        const router = useRouter();

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    // const [email, setEmail] = useState("")
    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
    const [isPasswordValid, setIsPasswordValid] = useState(false)
    const [role, setBusiness] = useState("")

    const isFormValid =
        username.trim() !== "" &&
        fname.trim() !== "" &&
        lname.trim() !== "" &&
        role.trim() !== "" &&
        isPasswordValid;

    const options: DropdownOptionProps[] = [
        { label: 'Hotel', value: 'hotel-manager'},
        { label: 'Restaurant', value: 'restaurant-manager'},
        { label: 'Rental Car', value: 'car-manager'},
        { label: 'Guide', value: 'guide'},
    ];

    const handleRegister = async () => {
        try {
            const response = await axios.post(endpoints.auth.register, {
                username,
                password,
                fname,
                lname,
                role,
            });

            console.log(response)

            router.push(paths.auth.login)
        } catch (error: any) {
            console.error("Register failed:", error.response?.data || error.message);
            alert("Register failed. Please check your credentials.");
        }
    }

    return (
        <div className="bg-[url('/images/wave2.jpg')] shadow-[var(--boxshadow-lifted)] min-h-screen bg-cover bg-center relative">
            <Navbar />
            <div className="flex flex-col absolute -translate-x-1/2 left-1/2 top-16 w-[600px] bg-gradient-to-br from-translucent-white to-transparent-white rounded-2xl shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)]  border-2 border-translucent-white backdrop-blur-lg">
                <PageTitle className='text-center mt-5 mb-10'>Register Business Account</PageTitle>
                <div className="flex-1 w-full items-center flex flex-col px-20 justify-between">

                    <div className='w-full flex flex-col gap-3'>
                        <div className="flex flex-col w-full">
                            <Body className='text-custom-gray'>Username</Body>
                            <FieldInput value={username} onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                        {/* <div className="flex flex-col w-full">
                            <Body className='text-custom-gray'>Email</Body>
                            <FieldInput value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div> */}
                        <div className="flex flex-col w-full">
                            <Body className='text-custom-gray'>First Name</Body>
                            <FieldInput value={fname} onChange={(e) => setFname(e.target.value)}></FieldInput>
                        </div>
                        <div className="flex flex-col w-full">
                            <Body className='text-custom-gray'>Last Name</Body>
                            <FieldInput value={lname} onChange={(e) => setLname(e.target.value)}></FieldInput>
                        </div>
                        <div className="flex flex-col w-full">
                            <Body className='text-custom-gray'>password</Body>
                            <PasswordInput type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                            <PasswordValidate password={password}
                            onValidationChange={(valid) => setIsPasswordValid(valid)}/>
                        </div>
                        <div className="flex flex-col w-full">
                            <Body className='text-custom-gray'>Business Type</Body>
                            <Dropdown options={options} value={role} onSelect={setBusiness} placeholder='Select Business Type'></Dropdown>
                        </div>
                    </div>
                    
                    <div className='flex flex-col gap-1 w-full mb-6 mt-6'>
                        <Button 
                        className='w-full border-2 rounded-[10px] border-custom-black' 
                        text='Register'
                        onClick={handleRegister}
                        disabled={!isFormValid} />
                    
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
