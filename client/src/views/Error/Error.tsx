import { Link } from "react-router-dom";
import style from "./Error.module.css";

const Error = () => {
  return (
    <section className={style.error}>
      <div className={style.wrapper}>
        <h2 className={style.header}>Page Not Found</h2>
        <Link to={"/"} className={style.link}>
          Go Back to Home
        </Link>
      </div>
    </section>
  );
};

export default Error;
