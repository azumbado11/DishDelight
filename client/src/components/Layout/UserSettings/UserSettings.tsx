import { SettingsIcon } from "../../../assets/Icons";
import style from "../../../styles/userprofile.module.css";

const UserSettings = () => {
  return (
    <section className={style.favorites__container}>
      <header className={style.favorites__header}>
        <div className={style.favorites__title}>
          <div className={style.icon__container}>
            <SettingsIcon />
          </div>
          <h2>Settings</h2>
        </div>
      </header>
      <section className={style.profilecontent__container}>
        <p>Your user account settings...</p>
      </section>
    </section>
  );
};

export default UserSettings;
