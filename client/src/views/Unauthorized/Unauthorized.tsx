import { Link } from "react-router-dom";
import style from "../Error/Error.module.css";

const Unauthorized = () => {
  return (
    <section className={style.error}>
      <div className={style.wrapper}>
        <h2 className={style.header}>403 Forbidden</h2>
        <p>You do not have permission to access this page.</p>
        <Link to={"/"} className={style.link}>
          Go Back to Home
        </Link>
      </div>
    </section>
  );
};

export default Unauthorized;
