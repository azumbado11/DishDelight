import { Outlet } from "react-router-dom";
import { ProfileAside } from "../../components/UI";
import "./Profile.css";
import { useProfile } from "./Profile.hooks";

const Profile = () => {
  const { username, isLoading, isError } = useProfile();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading profile. Please try again later.</div>;
  }
  return (
    <section className="profile__container">
      <ProfileAside username={username?.username} />
      <section className="outlet__container">
        <Outlet />
      </section>
    </section>
  );
};

export default Profile;
