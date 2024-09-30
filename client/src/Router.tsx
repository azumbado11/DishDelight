import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  UserFavorites,
  UserProfile,
  UserRecipes,
  UserSettings,
} from "./components/Layout/index.ts";
import { LoginForm, RegisterForm } from "./components/UI/index.ts";
import { FormLayout, MainLayout } from "./layouts/index.ts";
import {
  CreateRecipe,
  Error,
  Home,
  Profile,
  ProtectedRoute,
  Recipes,
  RecipeView,
  Unauthorized,
} from "./views/index.ts";
/* Routes and Views creation */
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MainLayout>
        <Home />
      </MainLayout>
    ),
  },
  {
    path: "/recipes",
    element: (
      <MainLayout>
        <Recipes />
      </MainLayout>
    ),
  },
  {
    path: "/recipes/:id",
    element: (
      <MainLayout>
        <RecipeView />
      </MainLayout>
    ),
  },
  {
    path: "/login",
    element: (
      <FormLayout>
        <LoginForm />
      </FormLayout>
    ),
  },
  {
    path: "/register",
    element: (
      <FormLayout>
        <RegisterForm />
      </FormLayout>
    ),
  },
  {
    path: "/profile/:userId",
    element: (
      <MainLayout>
        <Profile />
      </MainLayout>
    ),
    children: [
      {
        path: "userprofile",
        element: <UserProfile />,
      },
      {
        path: "recipes",
        element: <UserRecipes />,
      },
      {
        path: "favorites",
        element: <UserFavorites />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "settings",
            element: <UserSettings />,
          },
          {
            path: "recipes/create",
            element: <CreateRecipe />,
          },
        ],
      },
    ],
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "*",
    element: <Error />,
  },
]);

export const Router = () => <RouterProvider router={router} />;
