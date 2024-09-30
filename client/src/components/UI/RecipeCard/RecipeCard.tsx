import React from "react";
import { Link } from "react-router-dom";
import { Favorite, Rating } from "../index";
import "./RecipeCard.css";
type RecipeCardProps = {
  mealId: number;
  mealName: string;
  mealCategory: string;
  mealImg?: string;
  rating: number;
};
const RecipeCard: React.FC<RecipeCardProps> = ({
  mealId,
  mealName,
  mealCategory,
  mealImg,
  rating,
}) => {
  return (
    <article className="recipe-card__container">
      <img
        className="recipe-card-img"
        src={mealImg}
        alt={`${mealName} image`}
      />
      <div className="recipe-card-info__wrapper">
        <div className="recipe-favorite">
          <Favorite recipeId={mealId} />
        </div>
        <span>{mealCategory}</span>
        <Link className="recipe-card-link" to={`/recipes/${mealId}`}>
          {mealName}
        </Link>
        <Rating value={rating} />
      </div>
    </article>
  );
};

export default RecipeCard;
