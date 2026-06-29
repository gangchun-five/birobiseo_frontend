import { StarHalfIcon, StarIcon } from "lucide-react";

type ProductRatingProps = {
  rating: number;
  reviewCount?: number;
};

function getFilledStars(rating: number) {
  for (let index = 0; index < 5; index += 1) {
    if (index <= rating && rating < index + 0.5) {
      const stars = Array.from({ length: index }, (_, starIndex) => (
        <StarIcon key={starIndex} fill="#f5ae23" width="12px" height="12px" />
      ));
      stars.push(<StarHalfIcon key="half" fill="#f5ae23" width="12px" height="12px" />);
      return stars;
    }

    if (index + 0.5 <= rating && rating <= index + 1) {
      return Array.from({ length: index + 1 }, (_, starIndex) => (
        <StarIcon key={starIndex} fill="#f5ae23" width="12px" height="12px" />
      ));
    }
  }

  return [];
}

export function ProductRating({ rating, reviewCount }: ProductRatingProps) {
  const hasNoReviews = reviewCount === 0;
  const displayRating = hasNoReviews ? 0 : rating;

  return (
    <div className="market-rating">
      <span aria-hidden="true">
        <div className="rating-star-front">
          {getFilledStars(displayRating)}
        </div>
        <div className="rating-star-back">
          {Array.from({ length: 5 }, (_, index) => (
            <StarIcon key={index} strokeWidth={1.9} color="#e3e3e3" fill="#e3e3e3" width="12px" height="12px" />
          ))}
        </div>
      </span>
      <strong>{hasNoReviews ? "리뷰 없음" : displayRating.toFixed(1)}</strong>
      {typeof reviewCount === "number" ? <em>({reviewCount})</em> : null}
    </div>
  );
}
