import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LogoutIcon, UserIcon } from "../../../assets/Icons";
import { UserContext } from "../../../context/UserContext/UserState";
import { getUsernameById, logout } from "../../../services";
import style from "../../../styles/userprofile.module.css";
import { useCheckAuth } from "../../../utils/helpers";

const UserProfile = () => {
  const { userId } = useParams();
  const isLogged = useCheckAuth();
  const navigate = useNavigate();
  const context = useContext(UserContext);
  const {
    data: username,
    error: usernameError,
    isLoading: usernameLoading,
  } = useQuery({
    queryKey: ["username", userId],
    queryFn: () => getUsernameById(userId),
  });

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      context?.setUser(null);
      navigate("/");
    },
  });

  const handleLogout = () => {
    mutation.mutate();
  };

  return (
    <section className={style.favorites__container}>
      <header className={style.favorites__header}>
        <div className={style.favorites__title}>
          <div className={style.icon__container}>
            <UserIcon />
          </div>
          {usernameLoading ? (
            <h2>Loading user profile</h2>
          ) : usernameError ? (
            <h2>Error getting profile</h2>
          ) : (
            <h2>{isLogged ? "Your" : username?.username} profile</h2>
          )}
        </div>
        {isLogged ? (
          <button className={style.user_cta_btn} onClick={handleLogout}>
            Logout
            <LogoutIcon />
          </button>
        ) : null}
      </header>
      <section className={style.profilecontent__container}>
        <p>{username?.username} Content...</p>
      </section>
    </section>
  );
};

export default UserProfile;
