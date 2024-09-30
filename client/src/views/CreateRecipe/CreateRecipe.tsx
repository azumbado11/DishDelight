import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import {
  AddRecipeIcon,
  CreateRecipeIcon,
  RemoveRecipeIcon,
} from "../../assets/Icons";
import formStyle from "../../styles/form.module.css";
import { filters } from "../../utils/constants";
import style from "./CreateRecipe.module.css";
import CreateSelect from "./CreateSelect";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext/UserState";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../hooks/useModal";
import modalStyle from "../../styles/modal.module.css";

type Instructions = {
  step: number;
  instruction: string;
};

type Ingredients = {
  quantity: string;
  ingredient: string;
};

type CreateRecipeForm = {
  mealName: string;
  mealCategory: string;
  mealArea: string;
  description: string;
  instructions: Instructions[];
  mealImg: string;
  ingredients: Ingredients[];
};

type Recipe = CreateRecipeForm & {
  createdBy: string;
};

type PostRecipeArgs = {
  userId: string | undefined;
  recipe: Recipe;
};

const CreateRecipe = () => {
  const navigate = useNavigate();
  const { modal, setModal, dialogRef, showModal, closeModal } = useModal();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateRecipeForm>({
    defaultValues: {
      instructions: [{ step: 1, instruction: "" }],
      ingredients: [{ quantity: "", ingredient: "" }],
    },
  });

  /* useFieldArray calls for instructions and ingredients */
  const {
    fields: instructionsFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control,
    name: "instructions",
  });

  const {
    fields: ingredientsFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: "ingredients",
  });

  const mutation = useMutation({
    mutationFn: ({ userId, recipe }: PostRecipeArgs) =>
      postRecipe({ userId, recipe }),
    onSuccess: (data) => {
      console.log("Recipe creation successful");
      reset();
      navigate(`/recipes/${data.recipeId}`);
    },
    onError: (error: Error) => {
      console.log("Recipe creation failed", error.message);
      setModal((prev) => ({
        ...prev,
        title: error.name,
        message: error.message,
      }));
      showModal();
      reset();
    },
  });

  const onSubmit: SubmitHandler<CreateRecipeForm> = async (data) => {
    const recipe: Recipe = {
      mealName: data.mealName,
      createdBy: context?.user?.userId ?? "",
      mealCategory: data.mealCategory,
      mealArea: data.mealArea,
      description: data.description,
      instructions: data.instructions,
      mealImg: data.mealImg,
      ingredients: data.ingredients,
    };

    mutation.mutate({ userId: context?.user?.userId, recipe });
  };

  const context = useContext(UserContext);

  return (
    <form
      className={style.createform__container}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={style.header__deco}>
        <div className={style.header_color_deco}></div>
        <div className={style.header_white_deco}></div>
        <div className={style.icon__container}>
          <CreateRecipeIcon />
        </div>
      </div>
      <h2>Share a Recipe</h2>
      <div className={style.form_inputs__container}>
        <label className={style.label}>
          <input
            className={formStyle.input}
            type="text"
            placeholder="Recipe Name"
            autoComplete="off"
            {...register("mealName", {
              required: {
                value: true,
                message: "Recipe name is required",
              },
              minLength: {
                value: 3,
                message: "Recipe name must be 3 or more characters long",
              },
              maxLength: {
                value: 50,
                message: "Recipe name input exceed maxLength",
              },
            })}
          />
          {errors.mealName && (
            <span className={formStyle.error}>{errors.mealName.message}</span>
          )}
        </label>
        <div className={style.forminput__wrapper}>
          {filters.map((i) => {
            const registerName =
              "meal" + i.name.charAt(0).toUpperCase() + i.name.slice(1);
            return (
              <label className={style.label} key={i.name}>
                <CreateSelect
                  type={registerName}
                  options={i.options}
                  register={register}
                />
              </label>
            );
          })}
        </div>
        <label className={style.label}>
          <input
            className={formStyle.input}
            type="text"
            placeholder="Description"
            autoComplete="off"
            {...register("description", {
              required: {
                value: true,
                message: "Description is required",
              },
              minLength: {
                value: 20,
                message: "Description must be 20 or more characters long",
              },
              maxLength: {
                value: 300,
                message: "Description input exceed maxLength",
              },
            })}
          />
          {errors.description && (
            <span className={formStyle.error}>
              {errors.description.message}
            </span>
          )}
        </label>
        <label className={style.label}>
          <input
            className={formStyle.input}
            type="text"
            placeholder="ImageUrl 1280 x 720"
            autoComplete="off"
            {...register("mealImg", {
              required: {
                value: true,
                message: "Image Url is required",
              },
              pattern: {
                value:
                  /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+[^\s]*$/i,
                message: "Invalid url",
              },
            })}
          />
          {errors.mealImg && (
            <span className={formStyle.error}>{errors.mealImg.message}</span>
          )}
        </label>
        <div className={style.list_div_wrapper}>
          <span className={style.list_div_wrapper_title}>Ingredients</span>
          {ingredientsFields.map((_, index) => {
            return (
              <div className={style.list_inputs_wrappper} key={index}>
                <div className={style.list_label}>
                  <label className={style.list_double_label}>
                    <input
                      className={formStyle.input}
                      type="text"
                      placeholder="Quantity"
                      {...register(`ingredients.${index}.quantity` as const, {
                        required: {
                          value: true,
                          message: "Quantity is required",
                        },
                        maxLength: {
                          value: 30,
                          message: "Quantity input exceed maxLength",
                        },
                      })}
                    />
                    {errors.ingredients?.[index]?.quantity && (
                      <span className={formStyle.error}>
                        {errors.ingredients[index].quantity.message}
                      </span>
                    )}
                  </label>
                  <label className={style.list_double_label}>
                    <input
                      className={formStyle.input}
                      type="text"
                      placeholder="Ingredient"
                      {...register(`ingredients.${index}.ingredient` as const, {
                        required: {
                          value: true,
                          message: "Ingredient is required",
                        },
                        maxLength: {
                          value: 50,
                          message: "Ingredient input exceed maxLength",
                        },
                      })}
                    />
                    {errors.ingredients?.[index]?.ingredient && (
                      <span className={formStyle.error}>
                        {errors.ingredients[index].ingredient.message}
                      </span>
                    )}
                  </label>
                </div>
                <div className={style.input_controls__wrapper}>
                  {index + 1 === ingredientsFields.length ? (
                    <button
                      className={`${style.list__btn} ${style.double_btn}`}
                      onClick={() => {
                        appendIngredient({ quantity: "", ingredient: "" });
                      }}
                    >
                      <AddRecipeIcon />
                    </button>
                  ) : (
                    <div className={style.hidden_block}></div>
                  )}
                  {index > 0 && index === ingredientsFields.length - 1 ? (
                    <button
                      className={style.list__btn}
                      onClick={() => {
                        removeIngredient(index);
                      }}
                    >
                      <RemoveRecipeIcon />
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
        <div className={style.list_div_wrapper}>
          <span className={style.list_div_wrapper_title}>Instructions</span>
          {instructionsFields.map((_, index) => {
            return (
              <div className={style.list_inputs_wrappper} key={index}>
                <label className={style.list_label_single}>
                  <input
                    className={formStyle.input}
                    type="text"
                    placeholder="Instruction"
                    autoComplete="off"
                    {...register(`instructions.${index}.instruction` as const, {
                      required: {
                        value: true,
                        message: "Instruction is required",
                      },
                    })}
                  />
                  {errors.instructions?.[index]?.instruction && (
                    <span className={formStyle.error}>
                      {errors.instructions[index].instruction.message}
                    </span>
                  )}
                </label>
                <div className={style.input_controls__wrapper}>
                  {index + 1 === instructionsFields.length ? (
                    <button
                      className={style.list__btn}
                      onClick={() => {
                        appendInstruction({
                          step: instructionsFields.length + 1,
                          instruction: "",
                        });
                      }}
                    >
                      <AddRecipeIcon />
                    </button>
                  ) : null}
                  {index > 0 && index === instructionsFields.length - 1 ? (
                    <button
                      className={style.list__btn}
                      onClick={() => {
                        removeInstruction(index);
                      }}
                    >
                      <RemoveRecipeIcon />
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
        <button className={formStyle.button}>Create</button>
      </div>
      <dialog className={modalStyle.modal__container} ref={dialogRef}>
        <h4>{modal?.title}</h4>
        <span>{modal?.message}</span>
        <button onClick={closeModal} className={modalStyle.modal_close_btn}>
          Close
        </button>
      </dialog>
    </form>
  );
};

export default CreateRecipe;

const postRecipe = async ({ userId, recipe }: PostRecipeArgs) => {
  try {
    const res = await fetch(`http://localhost:3000/users/${userId}/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(recipe),
    });
    if (!res.ok) {
      const errorData = await res.json();
      const errorMessage =
        errorData.message || "Recipe Creation failed. Please try again.";
      throw new Error(errorMessage);
    }
    return await res.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
};
