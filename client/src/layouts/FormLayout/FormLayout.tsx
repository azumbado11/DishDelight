import React from "react";
import image from "../../assets/form.webp";
import style from "./FormLayout.module.css";

const FormLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <main className={style.section}>
      <div className={style.form}>
        <img src={image} alt="form decorative image" className={style.img} />
        {children}
      </div>
    </main>
  );
};

export default FormLayout;
