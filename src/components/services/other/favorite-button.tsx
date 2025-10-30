import {PageTitle, SubBody, Subtitle, Body, ButtonText, Caption} from '@/components/text-styles/textStyles'
import { Button, TextButton } from '@/components/buttons/buttons'
import { useState } from 'react';
import HeartIcon from '@/assets/icons/heart.svg'
import HeartFilledIcon from '@/assets/icons/heart-filled.svg'
import { useBoolean } from '@/hooks/use-boolean';

type FavoriteButtonProps = {
    favorite: boolean
    id: string
    type: "hotel" | "restaurant" | "rental_car" | "guide" | "attraction"
    large?: boolean
}

const FavoriteButton = ({ favorite, id,  type, large=false}: FavoriteButtonProps) => {
    const isFavorite = useBoolean(favorite)
    const [loading, setLoading] = useState(false);
    const [animate, setAnimate] = useState(false);

    const handleAnimationEnd = () => {
        setAnimate(false);
    };

    async function handleFavorite() {
        if (loading) return;
        setLoading(true)
        try {
        const response = await fetch(`/api/hotels/${id}/favorite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ favorite: !isFavorite }),
        });

        setAnimate(true);

        if (response.ok) throw new Error('Failed to update');
            isFavorite.toggle();
        } catch (error) {
        console.error(error);
        } finally {
        setLoading(false);
        }
    };

    return (
        <Button 
            onClick={handleFavorite}
            className={`absolute z-10 ${large ? 'w-[29px] right-2.5 top-2.5' : 'w-[23px] right-1.5 top-1.5'} bg-custom-white shadow-[var(--boxshadow-lifted)] text-dark-blue rounded-full`}
        >
            { isFavorite.value ? 
                <HeartFilledIcon 
                    className={`${ animate ? 'filled-heart' : ''} translate-y-[1px]`}
                    width = {large ? 16 : 12} 
                    onAnimationEnd={handleAnimationEnd} />:
                <HeartIcon 
                    className={`${ animate ? 'filled-heart' : ''} translate-y-[1px]`} 
                    width = {large ? 16 : 12}
                    onAnimationEnd={handleAnimationEnd} />
            }
        </Button>
    )
}

export default FavoriteButton