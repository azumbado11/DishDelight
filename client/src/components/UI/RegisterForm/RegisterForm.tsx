import { useMutation } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useModal } from "../../../hooks/useModal";
import { formRegister } from "../../../services";
import style from "../../../styles/form.module.css";
import modalStyle from "../../../styles/modal.module.css";

type RegisterFormValues = {
  registerUsername: string;
  registerPassword: string;
  registerComfirmPassword: string;
};

const RegisterForm = () => {
  const { modal, setModal, dialogRef, showModal, closeModal } = useModal();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<RegisterFormValues>();

  const mutation = useMutation({
    mutationFn: (credentials: { username: string; password: string }) =>
      formRegister(credentials),
    onSuccess: (data) => {
      console.log("Register successful", data);
      reset();
      navigate("login");
    },
    onError: (error: Error) => {
      console.error("Register failed", error.message);
      setModal((prev) => ({
        ...prev,
        title: error.name,
        message: error.message,
      }));
      showModal();
      reset();
    },
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    if (data.registerPassword !== data.registerComfirmPassword)
      throw new Error("Invalid Passwords");

    const credentials = {
      username: data.registerUsername,
      password: data.registerComfirmPassword,
    };

    mutation.mutate(credentials);
  };

  return (
    <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
      <h2>Register</h2>
      <label className={style.label}>
        <input
          className={style.input}
          type="text"
          placeholder="Enter your username"
          autoComplete="off"
          {...register("registerUsername", {
            required: {
              value: true,
              message: "Username is required",
            },
            minLength: {
              value: 3,
              message: "Username must be 3 or more characters long",
            },
          })}
        />
        {errors.registerUsername && (
          <span className={style.error}>{errors.registerUsername.message}</span>
        )}
      </label>
      <label className={style.label}>
        <input
          className={style.input}
          type="password"
          placeholder="Enter your Password"
          {...register("registerPassword", {
            required: { value: true, message: "Password is required" },
            minLength: {
              value: 6,
              message: "Password must be 6 or more characters long",
            },
          })}
        />
        {errors.registerPassword && (
          <span className={style.error}>{errors.registerPassword.message}</span>
        )}
      </label>
      <label className={style.label}>
        <input
          className={style.input}
          type="password"
          placeholder="Validate your Password"
          {...register("registerComfirmPassword", {
            required: { value: true, message: "Password is required" },
            validate: (value) =>
              value === watch("registerPassword") || "Passwords do not match",
          })}
        />
        {errors.registerComfirmPassword && (
          <span className={style.error}>
            {errors.registerComfirmPassword.message}
          </span>
        )}
      </label>
      <div className={style.wrapper}>
        <button className={style.button}>Sign Up</button>
        <span>
          Have an account?{" "}
          <Link className={style.link} to={"/login"}>
            Log in
          </Link>
        </span>
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

export default RegisterForm;
