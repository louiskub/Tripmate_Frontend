"use client"

import Navbar from '@/components/navbar/navbar';
import {PageTitle, SubBody, Subtitle, Body, ButtonText} from '@/components/text-styles/textStyles'
import { FieldInput, PasswordInput } from '@/components/inputs/inputs'
import { Button, TextButton } from '@/components/buttons/buttons'
import { createContext, useContext, useState, ReactNode } from "react";
import { paths } from '@/config/paths.config'
import PasswordValidate from '@/components/other/password-validate';

type ForgotPasswordData = {
    email: string;
    code: string;
    newPassword: string;
};

type ForgotPasswordContextType = {
    formData: ForgotPasswordData;
    setFormData: React.Dispatch<React.SetStateAction<ForgotPasswordData>>;
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
};

const ForgotPasswordContext = createContext<ForgotPasswordContextType | null>(null);

export function ForgotPasswordProvider({children}: {children: ReactNode}) {
    const [formData, setFormData] = useState<ForgotPasswordData>({
        email: "",
        code: "",
        newPassword: "",
    });

    const [step, setStep] = useState(1);

    return (
        <ForgotPasswordContext.Provider value={{ formData, setFormData, step, setStep }}>
        {children}
        </ForgotPasswordContext.Provider>
    );
}

export function useForgotPassword() {
    const ctx = useContext(ForgotPasswordContext);
    if (!ctx) throw new Error("useForgotPassword must be used inside ForgotPasswordProvider");
    return ctx;
}

export default function ForgotPasswordFlow() {
    return (
        <div className="bg-[url('/images/wave2.jpg')] shadow-[var(--boxshadow-lifted)] h-[100vh] bg-cover bg-center">
            <Navbar />
            <ForgotPasswordProvider>
            <Steps />
            </ForgotPasswordProvider>
        </div>
    )
}

function Steps() {
    const { step } = useForgotPassword();
    switch (step){
        case 1:
            return <StepEmail />;
        case 2:
            return <StepVerify />;
        case 3:
            return <StepReset />;
    }
}

function StepEmail() {
    const { formData, setFormData, setStep } = useForgotPassword();
    console.log(formData.email)

    return (
        <div className="flex flex-col justify-between relative -translate-1/2 left-1/2 top-1/2 w-[600px] h-[420px] bg-gradient-to-br from-translucent-white to-transparent-white rounded-2xl shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)]  border-2 border-translucent-white backdrop-blur-lg">
            <PageTitle className='text-center mt-6 mb-6'>Forgot Password</PageTitle>
            <SubBody className='px-21 text-center mb-10 text-dark-gray'>
                Please provide  an email address that you used when you registered your account. We will send an OTP to this email
                to reset your password.
            </SubBody>
            <div className="flex-1 w-full items-center flex flex-col px-20 justify-between">

                <div className='w-full flex flex-col gap-3.5'>
                    <div className="flex flex-col w-full">
                        <Body className='text-custom-gray'>Email</Body>
                        <FieldInput value={formData.email} onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}></FieldInput>
                    </div>
                </div>
                
                <div className='flex flex-col gap-1 w-full mb-14 mt-12'>
                    <Button 
                    className='w-full border-2 rounded-[10px] border-custom-black'
                    text='Continue'
                    onClick={() => setStep(2)}
                    disabled={!formData.email} />
                
                    <div className="self-stretch flex flex-col justify-start items-center gap-2.5">
                        <span className='flex items-center'>
                            <Body>Back to</Body>
                            <TextButton as='a' href={paths.auth.login} text='Log in' className='px-2 underline text-dark-blue'/>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StepVerify() {
    const { formData, setFormData, setStep } = useForgotPassword();

    return (
            <div className="flex flex-col justify-between relative -translate-1/2 left-1/2 top-1/2 w-[600px] h-[420px] bg-gradient-to-br from-translucent-white to-transparent-white rounded-2xl shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)]  border-2 border-translucent-white backdrop-blur-lg">
                <PageTitle className='text-center mt-6 mb-6'>Verification</PageTitle>
                <SubBody className='px-21 text-center mb-10 text-dark-gray'>
                    An OTP has been sent to your email ({formData.email}).
                Please enter an OTP below.
                </SubBody>
                <div className="flex-1 w-full items-center flex flex-col px-20 justify-between">
                    <div className='w-full flex flex-col gap-3.5'>
                        <div className="flex flex-col w-full">
                            <Body className='text-custom-gray'>OTP</Body>
                            <FieldInput value={formData.code} onChange={(e) => setFormData((f) => ({ ...f, code: e.target.value }))}></FieldInput>
                            <span className='flex items-center'>
                                <Body className='text-dark-gray'>Didn’t receive OTP?</Body>
                                <TextButton as='a' href='' text='Resend' className='px-2 text-dark-blue'/>
                            </span>
                        </div>
                        
                    </div>
                    
                    <div className='flex flex-col gap-1 w-full mb-14 mt-12'>
                        <Button 
                        className='w-full border-2 rounded-[10px] border-custom-black'
                        text='Continue'
                        onClick={() => {
                            setStep(3);
                        }} />
                    
                        <div className="self-stretch flex flex-col justify-start items-center gap-2.5">
                            <span className='flex items-center'>
                                <Body>Back to</Body>
                                <TextButton as='a' href={paths.auth.login} text='Log in' className='px-2 underline text-dark-blue'/>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
    )
}

function StepReset() {
    const { formData, setFormData} = useForgotPassword();
    const [isPasswordValid, setIsPasswordValid] = useState(false)

    const handleResetPassword = () => {
        console.log("reset password")
    }

    return (
            <div className="flex flex-col justify-between relative -translate-1/2 left-1/2 top-1/2 w-[600px] h-[420px] bg-gradient-to-br from-translucent-white to-transparent-white rounded-2xl shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)]  border-2 border-translucent-white backdrop-blur-lg">
                <PageTitle className='text-center mt-6 mb-14'>Reset Password</PageTitle>
                <div className="flex-1 w-full items-center flex flex-col px-20 justify-between">

                    <div className='w-full flex flex-col gap-3.5'>
                        <div className="flex flex-col w-full">
                            <Body className='text-custom-gray'>New Password</Body>
                            <PasswordInput value={formData.newPassword} onChange={(e) => setFormData((f) => ({ ...f, newPassword: e.target.value }))}/>
                            <PasswordValidate
                                password={formData.newPassword}
                                onValidationChange={(valid) => setIsPasswordValid(valid)}/>
                        </div>
                    </div>
                    
                    <div className='flex flex-col gap-1 w-full mb-14 mt-12'>
                        <Button 
                        className='w-full border-2 rounded-[10px] border-custom-black'
                        text='Reset Password'
                        onClick={handleResetPassword}
                        disabled={!isPasswordValid} />
                    
                        <div className="self-stretch flex flex-col justify-start items-center gap-2.5">
                            <span className='flex items-center'>
                                <Body>Back to</Body>
                                <TextButton as='a' href={paths.auth.login} text='Log in' className='px-2 underline text-dark-blue'/>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
    )
}