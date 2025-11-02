"use client";

import Navbar from '@/components/navbar/navbar';
import {PageTitle, SubBody, Subtitle, Body, ButtonText} from '@/components/text-styles/textStyles'
import { FieldInput, PasswordInput } from '@/components/inputs/inputs'
import { Button, TextButton } from '@/components/buttons/buttons'
import { useState } from 'react';
import { paths } from '@/config/paths.config'
import { endpoints } from '@/config/endpoints.config';
import { useRouter } from "next/navigation"
import axios from "axios";

export default function LoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter();

    const handleLogin = async (username: string, password:string) => {
        try {
            const response = await axios.post(endpoints.auth.login, {
                username,
                password,
            });

            const token = response.data.access_token;

            document.cookie = `token=${token}; max-age=3600; path=/`;
            router.push(paths.home)
        } catch (error: any) {
            console.error("Login failed:", error.response?.data || error.message);
            alert("Login failed. Please check your credentials.");
        }
    }

    return (
        <div className="bg-[url('/images/wave2.jpg')] shadow-(--boxshadow-lifted) h-screen bg-cover bg-center">
            <Navbar />
            <div className="flex flex-col relative -translate-1/2 left-1/2 top-1/2 w-[600px] bg-linear-to-br from-translucent-white to-transparent-white rounded-2xl shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)]  border-2 border-translucent-white backdrop-blur-lg">
                <PageTitle className='text-center mt-6 mb-14'>Log in</PageTitle>
                <div className="flex-1 w-full items-center flex flex-col px-20 justify-between">

                    <div className='w-full flex flex-col gap-3.5'>
                        <div className="flex flex-col w-full">
                            <Body className='text-custom-gray'>Username</Body>
                            <FieldInput value={username} onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                        <div className="flex flex-col w-full">
                            <Body className='text-custom-gray'>password</Body>
                            <PasswordInput type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <TextButton as='a' className='px-2 inline-flex self-end text-custom-gray' href={paths.auth.forgot_password} text='forgot password?'/>
                    </div>
                    
                    <div className='flex flex-col gap-1 w-full mb-14 mt-12'>
                        <Button 
                        className='w-full border-2 rounded-[10px] border-custom-black'
                        text='Login'
                        onClick={() => handleLogin(username, password)} />
                    
                        <div className="self-stretch flex flex-col justify-start items-center gap-2.5">
                            <span className='flex items-center'>
                                <Body>Don’t have an account?</Body>
                                <TextButton as='a' href={paths.auth.register} text='Register' className='px-2 underline text-dark-blue'/>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}