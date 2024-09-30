import { Link, useNavigate, useParams } from "react-router-dom";
import { AvatarIcon, DeleteIcon, ItemIcon } from "../../assets/Icons";
import { Favorite, Rating } from "../../components/UI";
import style from "./RecipeView.module.css";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { Recipe } from "../../types/recipes";

import { UserContext } from "../../context/UserContext/UserState";
import { getUsernameById } from "../../services";

type DeleteRecipeArgs = {
  userId: string | undefined;
  recipeId: string | undefined;
};

const RecipeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const mutation = useMutation({
    mutationFn: ({ userId, recipeId }: DeleteRecipeArgs) =>
      deleteRecipe({ userId, recipeId }),
    onSuccess: (data) => {
      console.log(data);
      navigate(`/profile/${context?.user?.userId}/recipes`);
    },
    onError: (error: Error) => {
      console.log("Error deleting recipe", error.message);
    },
  });

  const handleDelete = () => {
    mutation.mutate({ userId: context?.user?.userId, recipeId: id });
  };

  const {
    data: recipeData,
    error: recipeError,
    isLoading: recipeLoading,
  } = useQuery({
    queryKey: ["recipeId", id],
    queryFn: () => getRecipeById(id),
  });

  const {
    data: username,
    error: usernameError,
    isLoading: usernameLoading,
  } = useQuery({
    queryKey: ["username", recipeData?.recipe.createdBy],
    queryFn: () => getUsernameById(recipeData?.recipe.createdBy),
    enabled:
      !!recipeData?.recipe
        ?.createdBy /* Enable the query only if recipeData and createdBy are available */,
  });
  const context = useContext(UserContext);
  const isLogged = recipeData?.recipe.createdBy === context?.user?.userId;
  if (recipeLoading) return <div>Loading...</div>;
  if (!recipeData?.recipe)
    return <section className={style.section}>Recipe Not Found</section>;
  if (recipeError) return <div>An Error Occurred: {recipeError.message}</div>;

  return (
    <section className={style.section}>
      <header className={style.header}>
        <div className={style.category__wrapper}>
          <div className={style.category__info}>
            <span className={style.category}>{recipeData.recipe.mealArea}</span>
            <span className={style.category}>
              {recipeData.recipe.mealCategory}
            </span>
          </div>
          <div className={style.recipe_controls__wrapper}>
            <Favorite recipeId={recipeData.recipe._id} />
            {isLogged ? (
              <button className={style.recipe_delbtn} onClick={handleDelete}>
                <DeleteIcon />
              </button>
            ) : null}
          </div>
        </div>
        <h1 className={style.title}>{recipeData.recipe.mealName}</h1>
        <div className={style.header__info}>
          <div className={style.header__info__wrapper}>
            <AvatarIcon />
            {usernameLoading ? (
              <span>Loading username...</span>
            ) : usernameError ? (
              <span>Error fetching username</span>
            ) : (
              <Link to={`/profile/${recipeData.recipe.createdBy}/userprofile`}>
                {isLogged ? `${username?.username} (you)` : username?.username}
              </Link>
            )}
          </div>
          <div className={style.header__info__wrapper}>
            <Rating value={recipeData.recipe.rating ?? 0} />
            <span>({recipeData.recipe.rating})</span>
          </div>
        </div>
      </header>
      <section className={style.media}>
        <img
          className={style.img}
          src={recipeData.recipe.mealImg}
          alt={`${recipeData.recipe.mealName} image`}
        />
        <div className={style.info}>
          <p className={style.desc}>{recipeData.recipe.description}</p>
        </div>
        <section className={style.indications}>
          <aside className={style.ingredients}>
            <h2>Ingredients</h2>
            <div className={style.ingredients__wrapper}>
              {recipeData.recipe.ingredients.map((i) => {
                return (
                  <div className={style.ingredient} key={i.ingredient}>
                    <ItemIcon />
                    <p>{i.quantity}</p>
                    <p>{i.ingredient}</p>
                  </div>
                );
              })}
            </div>
          </aside>
          <section className={style.instructions}>
            <h2>Instructions</h2>
            {recipeData.recipe.instructions.map((i) => {
              return (
                <div className={style.instruction} key={i.step}>
                  <div className={style.step}>
                    <span>{i.step}</span>
                  </div>
                  <div className={style.instruction__content}>
                    <p>{i.instruction}</p>
                  </div>
                </div>
              );
            })}
          </section>
        </section>
      </section>
    </section>
  );
};

export default RecipeView;

export const getRecipeById = async (
  recipeId: string | undefined
): Promise<Recipe> => {
  const res = await fetch(`http://localhost:3000/recipes/${recipeId}`);
  return await res.json();
};

const deleteRecipe = async ({ userId, recipeId }: DeleteRecipeArgs) => {
  try {
    const res = await fetch(
      `http://localhost:3000/users/${userId}/recipes/${recipeId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    /* Check if the res is not ok */
    if (!res.ok) {
      /* Parse error message from the res if available */
      const errorData = await res.json();
      const errorMessage =
        errorData.message || "Error deleting recipe. Please try again.";
      throw new Error(errorMessage);
    }

    /* SIf res is ok, return the JSON data */
    return await res.json();
  } catch (error) {
    throw error;
  }
};
