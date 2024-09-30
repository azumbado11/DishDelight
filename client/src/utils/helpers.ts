import { useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext/UserState";

/* Check if user is logged user is authenticated for private routes */
export const useCheckAuth = () => {
  const context = useContext(UserContext);
  const { userId: routeUserId } = useParams();

  const isLogged = context?.user?.userId === routeUserId;

  return isLogged;
};
