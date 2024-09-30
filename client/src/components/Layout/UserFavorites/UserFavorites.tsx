import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { FilledHeartIcon } from "../../../assets/Icons";
import { GridLayout } from "../../../layouts";
import {
  getUserFavoritesIds,
  getUsernameById,
  getUserRecipesfromIds,
} from "../../../services";
import style from "../../../styles/userprofile.module.css";
import { useCheckAuth } from "../../../utils/helpers";

const UserFavorites = () => {
  const { userId } = useParams();
  const isLogged = useCheckAuth();
  /* get favorite recipes ids */
  const { data } = useQuery({
    queryKey: ["userFavorites", userId],
    queryFn: () => getUserFavoritesIds(userId),
  });

  /* convert ids to recipes data */
  const {
    data: userFavorites,
    isLoading: userFavoritesLoading,
    error: userFavoritesError,
  } = useQuery({
    queryKey: ["userFavorites", data?.favorites],
    queryFn: () => getUserRecipesfromIds(data?.favorites),
    enabled: !!data?.favorites,
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

  const favorites = {
    data: userFavorites,
  };

  if (userFavoritesLoading)
    return <div className={style.favorites__container}>Loading Cards...</div>;
  if (userFavoritesError)
    return <div className={style.favorites__container}>An Error Occurred</div>;

  return (
    <section className={style.favorites__container}>
      <header className={style.favorites__header}>
        <div className={style.favorites__title}>
          <div className={style.icon__container}>
            <FilledHeartIcon />
          </div>
          {usernameLoading ? (
            <h2>Loading user favorites</h2>
          ) : usernameError ? (
            <h2>Error getting favorites</h2>
          ) : (
            <h2>{isLogged ? "Your" : username?.username} favorites</h2>
          )}
        </div>
      </header>
      <section className={style.profilecontent__container}>
        {data?.favorites.length > 0 ? (
          <p>Recipes ({data?.favorites.length})</p>
        ) : (
          <p>
            {isLogged
              ? "You haven't added recipes to favorites yet"
              : "User don't have favorites yet"}
          </p>
        )}
        {userFavorites && (
          <GridLayout
            data={favorites}
            loading={userFavoritesLoading}
            error={userFavoritesError}
          />
        )}
      </section>
    </section>
  );
};

export default UserFavorites;
