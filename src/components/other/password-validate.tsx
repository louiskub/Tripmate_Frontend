import { useEffect } from 'react';


import CheckIcon from '@/assets/icons/check-round.svg'
import {PageTitle, SubBody, Subtitle, Body, ButtonText} from '@/components/text-styles/textStyles'

type PasswordValidateProps = {
    password: string
    onValidationChange?: (isValid: boolean) => void
    }

    export default function PasswordValidate({ password, onValidationChange }: PasswordValidateProps) {
    const rules = [
        password.length >= 8,
        /\d/.test(password),
        /[a-z]/.test(password),
        /[A-Z]/.test(password),
    ]

    const isValid = rules.every(Boolean)

    useEffect(() => {
        onValidationChange?.(isValid)
    }, [isValid, onValidationChange])

    const ruleTexts = ["Minimum 8 Characters", "Number", "Lowercase", "Uppercase"]

    return (
        <div className="px-2.5 py-1.5 flex flex-col gap-1">
        {ruleTexts.map((text, idx) => (
            <ValidateItem key={idx} text={text} checked={rules[idx]} />
        ))}
        </div>
    )
}

type validateItemProps = {
    checked?: boolean
    text: string
}

const ValidateItem = ({checked = false, text} : validateItemProps) => {
    return (
        <SubBody className={`flex gap-1 items-center h-4.5 ${checked? 'text-dark-blue': 'text-custom-gray'}`}>
            <CheckIcon fill="currentcolor" width={16} height={16} />
            {text}
        </SubBody>
    )
}