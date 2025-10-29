import {ButtonText, Subtitle, SmallTag, Caption, SubBody} from '@/components/text-styles/textStyles';
import React, { FC, ReactNode } from "react";
import CheckIcon from '@/assets/icons/bullet.svg'

type PriceCardProps = {
    name: string;
    description?: string;
    price: number;
    varient?: 'default' | 'unchecked' | 'checked';
    per?: 'day' | 'one-time' ;
};

const PriceCard = ( {name, description, price, varient='default', per='day'} : PriceCardProps) => {
    const variantClass = {
    default:
        'border-light-blue',
    unchecked:
        'border-light-gray group hover:border-light-blue hover:cursor-pointer',
    checked:
        'bg-pale-blue border-dark-blue hover:cursor-pointer',
    }
    return (
        <div 
            className={`relative grid grid-cols-[1fr_auto] grid-rows-2 p-2.5 w-60 border-2 rounded-lg
                ${variantClass[varient]}`}
        >
            <ButtonText className='text-custom-black'>{name}</ButtonText>
            <Caption className='flex items-center text-dark-gray'>{description}</Caption>
            <span className='flex items-center gap-0.5 col-start-2 row-start-1 row-span-2'>
                <SubBody className='text-custom-gray'>฿</SubBody>
                <Subtitle className='text-custom-black'>{price}</Subtitle>
                {
                    per !== 'one-time' && <SubBody className='text-custom-gray'>/{per}</SubBody>
                }
                
            </span>
            {
                varient !== 'default' &&
                <div className={`${varient == 'checked' ? 'bg-dark-blue':'bg-light-gray group-hover:bg-light-blue'} w-4 h-4 p-0.5 right-0.5 -translate-y-1/2 translate-x-1/2 top-0.5 absolute rounded-full flex justify-center items-center`}>
                    <div className="w-full h-full text-custom-white">
                        <CheckIcon />
                    </div>
                </div>
            }
            
        </div>
    );
};

export default PriceCard