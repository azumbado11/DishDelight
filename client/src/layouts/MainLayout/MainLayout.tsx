import React from "react";
import { Footer, Navbar } from "../../components/Layout/index";
import styles from "./mainlayout.module.css";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.section}>
      <Navbar />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
