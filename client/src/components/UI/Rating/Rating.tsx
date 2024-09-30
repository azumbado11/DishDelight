import React from "react";
import { StarIcon, HalfStarIcon, OutlineStar } from "../../../assets/Icons";
import "./Rating.css";

interface RatingProps {
  value: number;
  maxRating?: number;
}

const Rating: React.FC<RatingProps> = ({ value, maxRating = 5 }) => {
  // Create an array of star values based on maxRating
  const stars = Array.from({ length: maxRating }, (_, index) => {
    const starValue = index + 1;

    if (value >= starValue) {
      return <StarIcon key={index} />;
    } else if (value >= starValue - 0.5) {
      return <HalfStarIcon key={index} />;
    } else {
      return <OutlineStar key={index} />;
    }
  });

  return <div className="rating__container">{stars}</div>;
};

export default Rating;
