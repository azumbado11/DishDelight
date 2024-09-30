import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/UserContext/UserState";
import { getUserFavoritesIds } from "../../../services";

type UseFavoriteProps = {
  recipeId: number;
};

/* Mutation function arg types */
type ToggleFavoriteArgs = {
  userId: string | undefined;
  recipeId: number;
};

export const useFavorite = ({ recipeId }: UseFavoriteProps) => {
  /* Get userId from context  */
  const context = useContext(UserContext);
  const userId = context?.user?.userId;
  const navigate = useNavigate();

  /* State for favorite component */
  const [favorite, setFavorite] = useState<boolean>(false);

  const queryClient = useQueryClient();

  /* Query to get all user favorites by Id */
  const { data } = useQuery({
    queryKey: ["userFavorites", userId],
    queryFn: () => getUserFavoritesIds(userId),
    enabled: !!userId,
    staleTime: 0,
  });

  /* Check if recipe is already in favorites */
  useEffect(() => {
    if (data) {
      setFavorite(data.favorites.includes(recipeId));
    }
  }, [data, recipeId]);

  /* Mutation for handling favorite toggle (add / delete) */
  const mutation = useMutation({
    mutationFn: async ({ userId, recipeId }: ToggleFavoriteArgs) => {
      const url = `http://localhost:3000/users/${userId}/favorites/${recipeId}`;
      const method = data.favorites.includes(recipeId) ? "DELETE" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Invalid Action");
      return response.json();
    },
    onError: (error) => {
      console.error("Failed to toggle favorite:", error);
      /* Revert optimistic update if needed */
      setFavorite((prev) => !prev);
    },
    onSuccess: () => {
      /* refetch */
      queryClient.invalidateQueries({ queryKey: ["userFavorites", userId] });
    },
  });

  /* Add to favorite using API endpoint  */
  const handleToggle = () => {
    if (userId) {
      /* optimistic update */
      setFavorite((prev) => !prev);

      /* server update */
      mutation.mutateAsync({ userId, recipeId });
    } else {
      /* prohibit if user isnt logged  */
      navigate("/login");
    }
  };

  return {
    favorite,
    handleToggle,
  };
};
