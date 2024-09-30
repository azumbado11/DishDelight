import React from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { Pagination } from "../../../types/recipes";
import { filters } from "../../../utils/constants";
import { Search, Select } from "../index";
import "./Filter.css";

type FiltersProps = {
  pagination: Pagination | undefined;
  onFilterChange: () => void;
  search: string | null;
  setSearch: React.Dispatch<React.SetStateAction<string | null>>;
};

const Filters: React.FC<FiltersProps> = ({
  pagination,
  onFilterChange,
  setSearch,
}) => {
  const [searchParams] = useSearchParams();

  // Check if all filter parameters are empty except page
  const allParamsEmpty =
    searchParams.get("page") &&
    !searchParams.get("category") &&
    !searchParams.get("area") &&
    !searchParams.get("search");
  return (
    <section className="filters__container">
      <h2>Explore Recipes ({pagination?.items.total})</h2>
      <div className="filters__controls">
        <NavLink
          className={({ isActive }) =>
            isActive && allParamsEmpty
              ? "filter__control active"
              : "filter__control"
          }
          to="/recipes?page=1"
        >
          All
        </NavLink>
        {filters.map((i) => {
          return (
            <Select
              type={i.name}
              options={i.options}
              key={i.name}
              onChange={onFilterChange}
            />
          );
        })}
        <Search setSearch={setSearch} />
      </div>
    </section>
  );
};

export default Filters;
