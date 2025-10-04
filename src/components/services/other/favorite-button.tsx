import {PageTitle, SubBody, Subtitle, Body, ButtonText, Caption} from '@/components/text-styles/textStyles'
import { Button, TextButton } from '@/components/buttons/buttons'
import { useState } from 'react';
import HeartIcon from '@/assets/icons/heart.svg'
import HeartFilledIcon from '@/assets/icons/heart-filled.svg'
import { useBoolean } from '@/hooks/use-boolean';

type FavoriteButtonProps = {
    favorite: boolean
    hotel_id: string
}

const FavoriteButton = ({ favorite, hotel_id }: FavoriteButtonProps) => {
    const isFavorite = useBoolean(favorite)
    const [loading, setLoading] = useState(false);
    const [animate, setAnimate] = useState(false);

    const handleAnimationEnd = () => {
        setAnimate(false);
    };

    async function handleFavoriteHotel() {
        if (loading) return;
        setLoading(true)
        try {
        const response = await fetch(`/api/hotels/${hotel_id}/favorite`, {
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
            onClick={handleFavoriteHotel}
            className='absolute z-10 right-1.5 top-1.5 w-6 bg-custom-white shadow-[var(--boxshadow-lifted)] text-dark-blue rounded-full'>
            { isFavorite.value ? 
                <HeartFilledIcon 
                    className={`${ animate ? 'filled-heart' : ''}`} 
                    width='12'
                    onAnimationEnd={handleAnimationEnd} />:
                <HeartIcon className={`${ animate ? 'filled-heart' : ''}`} 
                    width='12'
                    onAnimationEnd={handleAnimationEnd} />
            }
        </Button>
    )
}

export default FavoriteButton