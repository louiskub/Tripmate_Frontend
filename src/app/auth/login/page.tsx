'use client'

import Navbar from '@/components/navbar/navbar';
import {PageTitle, SubBody, Subtitle, Body, ButtonText} from '@/components/text-styles/textStyles'
import { FieldInput, PasswordInput } from '@/components/inputs/inputs'
import { Button, TextButton } from '@/components/buttons/buttons'
import { useEffect, useState } from 'react';
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
            
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // convert base64url → base64
            const jsonPayload = Buffer.from(base64, "base64").toString("utf8");
            const data = JSON.parse(jsonPayload);
            
            localStorage.setItem("username", data.username)
            localStorage.setItem("userId", data.sub)

        try {
            const res = await axios.get(endpoints.profile(data.sub), {
                headers: { Authorization: `Bearer ${token}` },
            });

            const profile = {
                fname: res.data.fname,
                lname: res.data.lname,
                profileImg: res.data.profileImg ?? "", // fallback if missing
            };

            // Example: save to localStorage
            localStorage.setItem("fname", profile.fname);
            localStorage.setItem("lname", profile.lname);
            localStorage.setItem("profileImg", profile.profileImg);

        } catch (err) {
            console.error("Failed to fetch user", err);
        }


            if (data.userRole == "hotel-manager")
                localStorage.setItem("userRole", "hotel")
            else if (data.userRole == "car-manager")
                localStorage.setItem("userRole", "car")
            else
                localStorage.setItem("userRole", data.userRole)

            if (data.userRole != "user"){
                const res = await axios.get(endpoints.auth.owner, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                localStorage.setItem("serviceId", res.data[0].id)
            }
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