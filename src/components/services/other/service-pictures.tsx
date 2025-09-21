import {PageTitle, SubBody, Subtitle, Body, ButtonText, Caption} from '@/components/text-styles/textStyles'
import { Button, TextButton } from '@/components/buttons/buttons'
import { useState, ReactNode } from 'react';
import ArrowIcon from '@/assets/icons/pagination-arrow.svg'

type ServicePicturesProps = {
    pictures: Array<string>
    children: ReactNode
}

const ServicePictures = ({ pictures, children }: ServicePicturesProps) => {
    const [index, setIndex] = useState(1);
    const [transition, setTransition] = useState(true);
    
    const slides = [pictures[pictures.length - 1], ...pictures, pictures[0]];

    const next = () => {
        setIndex(prev => prev + 1);
        setTransition(true);
    };

    const prev = () => {
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
        <div className="flex overflow-hidden w-full h-90 gap-1.5">            
            <div className="rounded-[10px] h-full flex-1 overflow-hidden">
                <img 
                    src={pictures[0]}
                    className="w-full h-full object-cover" 
                />
            </div>
            <div className='flex-1 h-full grid grid-cols-2 grid-rows-2 gap-1.5'>
                {pictures.slice(1, 5).map((pic, idx) => (
                    <div key={idx} className="w-full h-full">
                        <img
                        src={pic}
                        className="w-full h-full object-cover rounded-[10px]"
                        />
                    </div>
                    ))}
            </div>
        </div>
    )
}

export default ServicePictures