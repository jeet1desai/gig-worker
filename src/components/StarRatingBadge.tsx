import { Star } from 'lucide-react';

interface StarRatingBadgeProps {
  rating: number;
  max?: number;
}

export default function StarRatingBadge({
  rating,
  max = 5
}: StarRatingBadgeProps) {
  const filledStars = Math.floor(rating);
  const hasHalfStar =
    rating - filledStars >= 0.25 && rating - filledStars < 0.75;
  const emptyStars = max - filledStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="inline-flex items-center rounded-md bg-green-500 px-2 py-1 text-sm font-medium text-white">
      <span className="mr-1">{rating}</span>
      <div className="flex items-center space-x-0.5">
        {Array.from({ length: filledStars }).map((_, i) => (
          <Star key={`full-${i}`} size={14} fill="#FFD700" stroke="none" />
        ))}

        {hasHalfStar && (
          <div className="relative h-[14px] w-[14px]">
            <Star
              size={14}
              fill="white"
              stroke="none"
              className="absolute top-0 left-0"
            />
            <Star
              size={14}
              fill="#FFD700"
              stroke="none"
              className="absolute top-0 left-0"
              style={{ clipPath: 'inset(0 50% 0 0)' }}
            />
          </div>
        )}

        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} size={14} fill="white" stroke="none" />
        ))}
      </div>
    </div>
  );
}
