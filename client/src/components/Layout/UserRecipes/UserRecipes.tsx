import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { AddRecipeIcon, RecipeIcon } from "../../../assets/Icons";
import { GridLayout } from "../../../layouts";
import {
  getUsernameById,
  getUserRecipesfromIds,
  getUserRecipesIds,
} from "../../../services";
import style from "../../../styles/userprofile.module.css";
import { useCheckAuth } from "../../../utils/helpers";

const UserRecipes = () => {
  const { userId } = useParams();
  const isLogged = useCheckAuth();
  /* get user created recipes ids */
  const { data, isLoading, error } = useQuery({
    queryKey: ["userRecipesIds", userId],
    queryFn: () => getUserRecipesIds(userId),
  });

  /* convert ids to recipes data */
  const {
    data: userRecipes,
    isLoading: userRecipesLoading,
    isError: userRecipesError,
  } = useQuery({
    queryKey: ["userRecipes", data?.recipes],
    queryFn: () => getUserRecipesfromIds(data?.recipes),
    enabled: !!data?.recipes,
  });

  /* Get user usernam from user id */
  const {
    data: username,
    error: usernameError,
    isLoading: usernameLoading,
  } = useQuery({
    queryKey: ["username", userId],
    queryFn: () => getUsernameById(userId),
    enabled: !!userId, // Enable the query only if recipeData and createdBy are available
  });

  const recipes = {
    data: userRecipes,
  };

  if (userRecipesLoading)
    return <div className={style.favorites__container}>Loading Recipes...</div>;
  if (userRecipesError)
    return <div className={style.favorites__container}>An Error Occurred</div>;

  return (
    <section className={style.favorites__container}>
      <header className={style.favorites__header}>
        <div className={style.favorites__title}>
          <div className={style.icon__container}>
            <RecipeIcon />
          </div>
          {usernameLoading ? (
            <h2>Loading user recipes</h2>
          ) : usernameError ? (
            <h2>Error getting recipes</h2>
          ) : (
            <h2>{isLogged ? "Your" : username?.username} recipes</h2>
          )}
        </div>
        {isLogged ? (
          <Link to={"create"} className={style.user_cta_btn}>
            <span>Create</span>
            <AddRecipeIcon />
          </Link>
        ) : null}
      </header>
      <section className={style.profilecontent__container}>
        {data?.recipes.length > 0 ? (
          <p>Recipes ({data?.recipes.length})</p>
        ) : (
          <p>
            {isLogged
              ? "You haven't created recipes yet"
              : "User don't have favorites yet"}
          </p>
        )}
        {userRecipes && (
          <GridLayout data={recipes} loading={isLoading} error={error} />
        )}
      </section>
    </section>
  );
};

export default UserRecipes;
