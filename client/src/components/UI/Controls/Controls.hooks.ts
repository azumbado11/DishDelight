import { Pagination } from "../../../types/recipes";

type UseControlsProps = {
  pagination: Pagination | undefined;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export const useControls = ({ pagination, setPage }: UseControlsProps) => {
  /* Page value */
  const page = pagination?.current_page || 1;

  const handlePrevPage = () => {
    if (page > 1) {
      window.scrollTo(0, 0);
      setPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    window.scrollTo(0, 0);
    setPage((prev) => prev + 1);
  };

  return {
    page,
    handlePrevPage,
    handleNextPage,
  };
};
