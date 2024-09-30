import { NavLink, Link } from "react-router-dom";
import {
  CancelIcon,
  LogoIcon,
  MenuIcon,
  UserIcon,
} from "../../../assets/Icons";
import "./Navbar.css";
import { useNavbar } from "./Navbar.hooks";

const Navbar = () => {
  const { userId, toggleMenu, handleToggleMenu } = useNavbar();

  return (
    <>
      <header className="header__container">
        <NavLink className="header__logo" to={"/"}>
          <LogoIcon />
          <span>DishDelight</span>
        </NavLink>
        <nav className="header-nav__container">
          <ul className="header-links__container">
            <li className="header_link">
              <NavLink
                className={({ isActive }) => (isActive ? "active" : "")}
                to={"/"}
              >
                Home
              </NavLink>
            </li>
            <li className="header_link">
              <NavLink
                className={({ isActive }) => (isActive ? "active" : "")}
                to={"/about"}
              >
                About
              </NavLink>
            </li>
            <li className="header_link">
              <NavLink
                className={({ isActive }) => (isActive ? "active" : "")}
                to={"/recipes"}
              >
                Recipes
              </NavLink>
            </li>
            <li className="header_link">
              <NavLink
                className={({ isActive }) => (isActive ? "active" : "")}
                to={"/contact"}
              >
                Contact
              </NavLink>
            </li>
            <li className="header-user-profile">
              <NavLink
                to={userId ? `/profile/${userId}/userprofile` : `/login`}
              >
                {" "}
                <UserIcon />
              </NavLink>
            </li>
            <button className="header-user-menubtn" onClick={handleToggleMenu}>
              {toggleMenu ? <CancelIcon /> : <MenuIcon />}
            </button>
          </ul>
        </nav>
      </header>
      <div className={`toggle-menu__container ${toggleMenu ? "open" : ""}`}>
        <nav className="toggle-menu_nav">
          <Link to={"/"}>Home</Link>
          <Link to={"/about"}>About</Link>
          <Link to={"/recipes"}>Recipes</Link>
          <Link to={"/contact"}>Contact</Link>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
