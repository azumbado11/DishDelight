import React from "react";
import style from "./sectionlayout.module.css";

const SectionLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <section className={style.section}>{children}</section>;
};

export default SectionLayout;
