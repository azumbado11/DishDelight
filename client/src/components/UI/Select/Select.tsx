import React from "react";
import "./Select.css";
import { useSelect } from "./Select.hooks";

type SelectProps = {
  type: string;
  options: string[];
  onChange: () => void;
};

const Select: React.FC<SelectProps> = ({ type, options, onChange }) => {
  const { selectRef, handleChange } = useSelect({ type, onChange });

  return (
    <select
      className="filters__select"
      name={type}
      onChange={handleChange}
      ref={selectRef}
    >
      <option value="">{type}</option>
      {options.map((i) => (
        <option value={i} key={i}>
          {i}
        </option>
      ))}
    </select>
  );
};
export default Select;
