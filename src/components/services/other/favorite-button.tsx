import {PageTitle, SubBody, Subtitle, Body, ButtonText, Caption} from '@/components/text-styles/textStyles'
import { Button, TextButton } from '@/components/buttons/buttons'
import { useState } from 'react';
import HeartIcon from '@/assets/icons/heart.svg'
import HeartFilledIcon from '@/assets/icons/heart-filled.svg'
import { useBoolean } from '@/hooks/use-boolean';
import axios from 'axios';
import { endpoints } from '@/config/endpoints.config';
import Cookies from 'js-cookie';

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
        // try {
        // const response = await fetch(`/api/hotels/${id}/favorite`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ favorite: !isFavorite }),
        // });
        const token = Cookies.get("token");
        try {
            const response = await axios.patch(endpoints.favorite(id), {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAnimate(true);
            isFavorite.toggle();
        } catch (err) {
            console.error("Failed Favorite", err);
        } finally {
        setLoading(false);
        }
    };

    return (
        <Button 
            onClick={handleFavorite}
            className={`absolute top-0 left-0 z-10 ${large ? 'w-[35px] right-2.5 top-2.5' : 'w-[23px] left-1.5 top-1.5'} bg-custom-white shadow-[var(--boxshadow-lifted)] text-dark-blue rounded-full`}
        >
            { isFavorite.value ? 
                <HeartFilledIcon 
                    className={`${ animate ? 'filled-heart' : ''} translate-y-[1px]`}
                    width = {large ? '18' : '12'} 
                    onAnimationEnd={handleAnimationEnd} />:
                <HeartIcon 
                    className={`${ animate ? 'filled-heart' : ''} translate-y-[1px]`} 
                    width = {large ? '18' : '12'}
                    onAnimationEnd={handleAnimationEnd} />
            }
        </Button>
    )
}

export default FavoriteButton