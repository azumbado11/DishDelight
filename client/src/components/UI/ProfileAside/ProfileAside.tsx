import React, { useContext } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  AvatarIcon,
  FilledHeartIcon,
  RecipeIcon,
  SettingsIcon,
  UserIcon,
} from "../../../assets/Icons";
import { UserContext } from "../../../context/UserContext/UserState";
import "./ProfileAside.css";

type ProfileProps = {
  username: string | undefined;
};

const Profile: React.FC<ProfileProps> = ({ username }) => {
  /* Requested userId from params*/
  const { userId } = useParams();

  /* Requested userId stored in userContext when logged */
  const context = useContext(UserContext);
  return (
    <aside className="aside__container">
      <section className="aside__user">
        <div className="avatar__container">
          <AvatarIcon />
        </div>
        <h2>{username}</h2>
      </section>
      <nav>
        <NavLink
          className={({ isActive }) =>
            isActive ? "link__container active" : "link__container"
          }
          to={"userprofile"}
        >
          <UserIcon />
          <span>Profile</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "link__container active" : "link__container"
          }
          to={"recipes"}
        >
          <RecipeIcon />
          <span>Recipes</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "link__container active" : "link__container"
          }
          to={"favorites"}
        >
          <FilledHeartIcon />
          <span>Favorites</span>
        </NavLink>
        {userId === context?.user?.userId ? (
          <NavLink
            className={({ isActive }) =>
              isActive ? "link__container active" : "link__container"
            }
            to={"settings"}
          >
            <SettingsIcon />
            <span>Settings</span>
          </NavLink>
        ) : null}
      </nav>
    </aside>
  );
};

export default Profile;
