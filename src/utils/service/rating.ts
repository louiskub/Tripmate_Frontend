export function ratingText(rating: number): string {
    if (rating >= 9.0) return "Excellent";
    if (rating >= 8.0) return "Very Good";
    if (rating >= 7.0) return "Good";
    if (rating >= 6.0) return "Pleasant";
    if (rating >= 5.0) return "Average";
    if (rating >= 4.0) return "Poor";
    return "Very Poor";
}

export type ratingMeta = {
    key: string
    label: string
}

export const hotelRatingMeta: ratingMeta[] = [
    { key: 'cleanliness', label: 'Cleanliness' },
    { key: 'comfort', label: 'Comfort' },
    { key: 'meal', label: 'Meal' },
    { key: 'location', label: 'Location' },
    { key: 'service', label: 'Service' },
    { key: 'facilities', label: 'Facilities' },
]

export const restaurantRatingMeta: ratingMeta[] = [
    { key: 'cleanliness', label: 'Cleanliness' },
    { key: 'delicacy', label: 'Delicacy' },
    { key: 'service', label: 'Service' },
    { key: 'location', label: 'Location' },
    { key: 'vibe', label: 'Vibe' },
]

export const guideRatingMeta: ratingMeta[] = [
    { key: 'knowledge', label: 'Knowledge' },
    { key: 'communication', label: 'Communication' },
    { key: 'punctuality', label: 'Punctuality' },
    { key: 'safety', label: 'Safety' },
    { key: 'route_planning', label: 'Route planning' },
    { key: 'local_insights', label: 'Local insights' },
]