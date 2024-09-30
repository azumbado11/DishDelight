import { useEffect, useRef, useState } from "react";
import { useDebounce } from "../../../hooks/useDebounce";

type UseSearchProps = {
  setSearch: React.Dispatch<React.SetStateAction<string | null>>;
};

export const useSearch = ({ setSearch }: UseSearchProps) => {
  /* searchInput Ref */
  const searchRef = useRef<HTMLInputElement>(null);

  /* state for searchInput current value */
  const [searchValue, setSearchValue] = useState<string>("");

  /* debounced value */
  const search = useDebounce(searchValue);

  /* handle input change */
  const handleChange = () => {
    const currentValue = searchRef.current?.value ?? "";
    setSearchValue((prev) => (prev = currentValue));
  };

  useEffect(() => {
    setSearch((prev) => (prev = search));
  }, [search]);

  const handleReset = () => {
    if (searchRef.current) {
      searchRef.current.value = "";
    }
    setSearch("");
  };

  return {
    searchRef,
    handleChange,
    handleReset,
  };
};
