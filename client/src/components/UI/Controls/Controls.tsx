import React from "react";
import { LeftArrow, RightArrow } from "../../../assets/Icons";
import "./Controls.css";
import { Pagination } from "../../../types/recipes";
import { useControls } from "./Controls.hooks";

type ControlsProps = {
  pagination: Pagination | undefined;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

const Controls: React.FC<ControlsProps> = ({ pagination, setPage }) => {
  const { page, handlePrevPage, handleNextPage } = useControls({
    pagination,
    setPage,
  });

  return (
    <section className="controls__container">
      <button
        className={`control-cta-btn`}
        onClick={handlePrevPage}
        disabled={page === 1}
      >
        <LeftArrow />
      </button>
      <div className="controls__page">
        <span>Page: {pagination?.current_page} </span>
      </div>
      <button
        className={`control-cta-btn`}
        onClick={handleNextPage}
        disabled={!pagination?.has_next_page}
      >
        <RightArrow />
      </button>
    </section>
  );
};

export default Controls;
