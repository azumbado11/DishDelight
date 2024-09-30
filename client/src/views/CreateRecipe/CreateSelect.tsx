import React from "react";

type CreateSelectProps = {
  type: string;
  options: string[];
  register: any;
};
const CreateSelect: React.FC<CreateSelectProps> = ({
  type,
  options,
  register,
}) => {
  return (
    <select
      className="filters__select"
      name={type}
      {...register(type, {
        required: {
          value: true,
          message: "This field is required",
        },
      })}
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

export default CreateSelect;
