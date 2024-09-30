import { useContext, useState } from "react";
import { UserContext } from "../../../context/UserContext/UserState";

export const useNavbar = () => {
  /* Get userId from context */
  const context = useContext(UserContext);
  const userId = context?.user?.userId;

  /* State for toggleMenu */
  const [toggleMenu, setToggleMenu] = useState<boolean>(false);

  /* Toggle menu function */
  const handleToggleMenu = () => {
    setToggleMenu((prev) => !prev);
  };

  return { userId, toggleMenu, handleToggleMenu };
};
