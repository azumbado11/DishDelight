import React from "react";
import { RecipeCard, Skeleton } from "../../components/UI";
import { ApiResponse } from "../../types/recipes";
import layoutStyle from "../SectionLayout/sectionlayout.module.css";
import style from "./gridlayout.module.css";

type GridLayoutProps = {
  data: ApiResponse | undefined;
  loading: boolean;
  error: Error | null;
};

const GridLayout: React.FC<GridLayoutProps> = ({ data, loading, error }) => {
  if (loading) {
    return <Skeleton />;
  }
  if (error) {
    return (
      <section className={layoutStyle.section}>Error {error.message}</section>
    );
  }

  if (!data?.data.length) {
    return null;
  }
  return (
    <section className={style.grid}>
      {data?.data.map((i) => {
        return (
          <RecipeCard
            mealId={i._id}
            mealCategory={i.mealCategory}
            mealName={i.mealName}
            mealImg={i.mealImg}
            rating={i.rating}
            key={i._id}
          />
        );
      })}
    </section>
  );
};

export default GridLayout;
