import React from "react";
import { SearchIcon, CancelIcon } from "../../../assets/Icons";
import style from "./Search.module.css";
import { useSearch } from "./Search.hooks";

type SearchProps = {
  setSearch: React.Dispatch<React.SetStateAction<string | null>>;
};

const Search: React.FC<SearchProps> = ({ setSearch }) => {
  const { searchRef, handleChange, handleReset } = useSearch({
    setSearch,
  });
  return (
    <div className={style.search__container}>
      <SearchIcon />
      <input
        type="text"
        className={style.search__input}
        placeholder="Search..."
        ref={searchRef}
        name="search"
        onChange={handleChange}
      />
      {searchRef.current?.value && (
        <button className={style.resetbtn} onClick={handleReset}>
          <CancelIcon />
        </button>
      )}
    </div>
  );
};

export default Search;
