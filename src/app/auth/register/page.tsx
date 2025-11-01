"use client"

import Navbar from '@/components/navbar/navbar';
import {PageTitle, SubBody, Subtitle, Body, ButtonText} from '@/components/text-styles/textStyles'
import { FieldInput, PasswordInput } from '@/components/inputs/inputs'
import { Button, TextButton } from '@/components/buttons/buttons';
import { useState } from 'react';
import { paths } from '@/config/paths.config';
import PasswordValidate from '@/components/other/password-validate';
import { useRouter } from "next/navigation"
import axios from 'axios';
import { endpoints } from '@/config/endpoints.config';



export default function RegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
    const [email, setEmail] = useState("")

    const [isPasswordValid, setIsPasswordValid] = useState(false)
    const isFormValid =
        username.trim() !== "" &&
        fname.trim() !== "" &&
        lname.trim() !== "" &&
        password.trim() !== "" &&
        isPasswordValid;

    const handleRegister = async () => {
        try {
            const response = await axios.post(endpoints.auth.register, {
                username,
                password,
                fname,
                lname,
            });

            console.log(response)

            router.push(paths.auth.login)
        } catch (error: any) {
            console.error("Register failed:", error.response?.data || error.message);
            alert("Register failed. Please check your credentials.");
        }
    }

    return (
        <div className="bg-[url('/images/wave2.jpg')] shadow-(--boxshadow-lifted) h-screen bg-cover bg-center">
            <Navbar />
            <div className="flex flex-col relative -translate-1/2 left-1/2 top-7/13 w-[600px] bg-linear-to-br from-translucent-white to-transparent-white rounded-2xl shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)]  border-2 border-translucent-white backdrop-blur-lg">
                <PageTitle className='text-center mt-6 mb-12'>Register</PageTitle>
                <div className="flex-1 w-full items-center flex flex-col px-20 justify-between">

                    <div className='w-full flex flex-col gap-3.5'>
                        <div className="flex flex-col w-full">
                            <Body className='text-custom-gray'>Username</Body>
                            <FieldInput value={username} onChange={(e) => setUsername(e.target.value)}></FieldInput>
                        </div>
                        <div className="flex flex-col w-full">
                            <Body className='text-custom-gray'>First Name</Body>
                            <FieldInput value={fname} onChange={(e) => setFname(e.target.value)}></FieldInput>
                        </div>
                        <div className="flex flex-col w-full">
                            <Body className='text-custom-gray'>Last Name</Body>
                            <FieldInput value={lname} onChange={(e) => setLname(e.target.value)}></FieldInput>
                        </div>
                        <div className="flex flex-col w-full">
                            <Body className='text-custom-gray'>Password</Body>
                            <PasswordInput type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                            <PasswordValidate password={password}
                            onValidationChange={(valid) => setIsPasswordValid(valid)}/>
                        </div>
                    </div>
                    
                    <div className='flex flex-col gap-1 w-full mb-12 mt-10'>
                        <Button 
                        className='w-full border-2 rounded-[10px] border-custom-black' 
                        text='Register'
                        onClick={handleRegister}
                        disabled={!isFormValid} />
                    
                        <div className="self-stretch flex flex-col justify-start items-center gap-2.5">
                            <span className='flex items-center'>
                                <Body>Already have an account?</Body>
                                <TextButton as='a' href={paths.auth.login} text='Login' className='px-2 underline text-dark-blue'/>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
