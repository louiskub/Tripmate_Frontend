'use client'


import {PageTitle, SubBody, Subtitle, Body, ButtonText, Caption} from '@/components/text-styles/textStyles'
import { Button, TextButton } from '@/components/buttons/buttons'
import { useState, ReactNode } from 'react';
import ArrowIcon from '@/assets/icons/pagination-arrow.svg'

type ImageSlideProps = {
    pictures: Array<string>
    children?: ReactNode
    className?: string
    onClick?: () => void
}

const ImageSlide = ({ pictures, children, className, onClick }: ImageSlideProps) => {
    const [index, setIndex] = useState(1);
    const [transition, setTransition] = useState(true);
    
    const slides = [pictures[pictures.length - 1], ...pictures, pictures[0]];

    const next = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        setIndex(prev => prev + 1);
        setTransition(true);
    };

    const prev = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        setIndex(prev => prev - 1);
        setTransition(true);
    };

    const handleTransitionEnd = () => {
        if (index === slides.length - 1) {
            setTransition(false);
            setIndex(1);
        }
        if (index === 0) {
            setTransition(false);
            setIndex(slides.length - 2);
        }
    };

    return (
        <div 
            onClick={onClick}
            className={`relative rounded-[10px] overflow-hidden group ${className ? className: 'w-44 aspect-square'} ${onClick? 'hover:cursor-pointer': ''}`}>            
            <div
                className={`w-full h-full flex z-100 ${transition ? 'transition-transform duration-300' : ''}`}
                style={{ transform: `translateX(-${index * 100}%)` }}
                onTransitionEnd={handleTransitionEnd}
            >
                {slides.map((pic, i) => (
                <img key={i} 
                    className="flex-shrink-0 w-full h-full object-cover"
                    src={pic || '/images/placeholder.png'} />
                ))}
            </div>

            <div className={`absolute z-10 inset-0 flex justify-between px-0.5 items-center pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 transition-all`}>
                <Button
                    onClick= {prev}
                    className='w-1/9 max-w-8 bg-translucent-white'>
                    <ArrowIcon className='w-2/3 -scale-100'/>
                </Button>

                <Button
                    onClick={next}
                    className='w-1/9 max-w-8 bg-translucent-white'>
                    <ArrowIcon className='w-2/3'/>
                </Button>
            </div>

            <div className="w-full h-full left-0 top-0 absolute bg-gradient-to-b from-white/0 to-black/30 z-2" />

            <div className="absolute z-2 bottom-1 w-full flex gap-1 justify-center items-end">
            {pictures.map((_, i) => {
                const realIndex = (index - 1 + pictures.length) % pictures.length;
                return (
                <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                    realIndex === i
                        ? 'bg-custom-white/90'
                        : 'bg-translucent-white'
                    }`}
                />
                );
            })}
            </div>

            {children}

        </div>
    )
}

export default ImageSlide