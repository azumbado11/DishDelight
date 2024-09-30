/* User login request */
export const login = async (credentials: {
  username: string;
  password: string;
}) => {
  try {
    const res = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    // Check if the res is not ok
    if (!res.ok) {
      // Parse error message from the res if available
      const errorData = await res.json();
      const errorMessage =
        errorData.message || "Login failed. Please try again.";
      throw new Error(errorMessage);
    }

    // If res is ok, return the JSON data
    return await res.json();
  } catch (error) {
    throw error;
  }
};

/* User register request */
export const formRegister = async (credentials: {
  username: string;
  password: string;
}) => {
  try {
    const res = await fetch("http://localhost:3000/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    /* Check if the response is not ok */
    if (!res.ok) {
      /* Parse error message from the response if available */
      const errorData = await res.json();
      const errorMessage =
        errorData.message || "Register failed. Please try again.";
      throw new Error(errorMessage);
    }

    /* If response is ok, return the JSON data */
    return await res.json();
  } catch (error) {
    throw error;
  }
};

/* User logout request */
export const logout = async () => {
  try {
    const res = await fetch("http://localhost:3000/users/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) throw new Error("Invalid Post");
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

/* Get user created recipes ids */
export const getUserRecipesIds = async (userId: string | undefined) => {
  const res = await fetch(`http://localhost:3000/users/${userId}/recipes`);
  return await res.json();
};

/* Get a username based on id */
export const getUsernameById = async (
  userId: string | undefined
): Promise<{ username: string }> => {
  const res = await fetch(`http://localhost:3000/users/${userId}/username`);
  return await res.json();
};

/* Get recipes based on recipeIds */
export const getUserRecipesfromIds = async (recipeIds: string) => {
  const res = await fetch(
    `http://localhost:3000/recipes/batch/ids?q=${recipeIds}`
  );
  return await res.json();
};

/* Get user favorite recipes based on userId */
export const getUserFavoritesIds = async (userId: string | undefined) => {
  const res = await fetch(`http://localhost:3000/users/${userId}/favorites`);
  return await res.json();
};
