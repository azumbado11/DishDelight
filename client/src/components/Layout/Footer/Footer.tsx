import { LogoIcon } from "../../../assets/Icons";
import "./Footer.css";
const Footer = () => {
  return (
    <footer className="footer__container">
      <div className="footer__links">
        <span>Terms</span>
        <span>About</span>
        <span>Privacy</span>
      </div>
      <div className="footer__logo">
        <LogoIcon />
        <h3>Dish Delight</h3>
      </div>
      <span>2024. Practice Project</span>
    </footer>
  );
};

export default Footer;
