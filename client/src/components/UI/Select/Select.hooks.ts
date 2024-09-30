import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

type UseSelectProps = {
  type: string;
  onChange: () => void;
};

export const useSelect = ({ type, onChange }: UseSelectProps) => {
  /* Select input ref */
  const selectRef = useRef<HTMLSelectElement | null>(null);

  /* Get URL params */
  const [searchParams, setSearchParams] = useSearchParams();

  /* Update selectRef based on searchParams when component mounts or searchParams change */
  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.value = searchParams.get(type) || "";
    }
  }, [searchParams, type]);

  /* Handle input change */
  const handleChange = () => {
    const params = new URLSearchParams(searchParams);

    if (selectRef.current) {
      if (selectRef.current.name === "category") {
        if (selectRef.current.value === "") {
          params.delete("category");
        } else {
          params.set("category", selectRef.current.value);
        }
      }
      if (selectRef.current.name === "area") {
        if (selectRef.current.value === "") {
          params.delete("area");
        } else {
          params.set("area", selectRef.current.value);
        }
      }
      setSearchParams(params);
      onChange();
    }
  };

  return {
    selectRef,
    handleChange,
  };
};
