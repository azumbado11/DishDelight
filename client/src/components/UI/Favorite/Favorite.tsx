import React from "react";
import { OutlineHeartIcon } from "../../../assets/Icons";
import { useFavorite } from "./Favorite.hooks";

type FavoriteProps = {
  recipeId: number;
};

const Favorite: React.FC<FavoriteProps> = ({ recipeId }) => {
  const { favorite, handleToggle } = useFavorite({ recipeId });

  return (
    <OutlineHeartIcon
      fillColor={favorite ? "var(--secondary-color)" : "transparent"}
      strokeColor={"var(--text-color)"}
      toggle={handleToggle}
    />
  );
};

export default Favorite;
