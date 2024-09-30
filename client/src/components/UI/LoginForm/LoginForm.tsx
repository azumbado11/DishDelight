import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/UserContext/UserState";
import { useModal } from "../../../hooks/useModal";
import { login } from "../../../services";
import style from "../../../styles/form.module.css";
import modalStyle from "../../../styles/modal.module.css";

type LoginFormValues = {
  loginUsername: string;
  loginPassword: string;
};

const LoginForm = () => {
  const navigate = useNavigate();
  const context = useContext(UserContext);
  const { modal, setModal, dialogRef, showModal, closeModal } = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>();

  const mutation = useMutation({
    mutationFn: (credentials: { username: string; password: string }) =>
      login(credentials),
    onSuccess: (data) => {
      console.log("Login successful", data);
      context?.setUser({ userId: data.data._id });
      reset();
      navigate("/");
    },
    onError: (error: Error) => {
      console.error("Login failed", error.message);
      setModal((prev) => ({
        ...prev,
        title: error.name,
        message: error.message,
      }));
      showModal();
      reset();
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    const credentials = {
      username: data.loginUsername,
      password: data.loginPassword,
    };

    mutation.mutate(credentials);
  };
  console.log(mutation.error);

  return (
    <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
      <h2>Login</h2>
      <label className={style.label}>
        <input
          className={style.input}
          type="text"
          autoComplete="off"
          placeholder="Enter your username"
          {...register("loginUsername", {
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
        {errors.loginUsername && (
          <span className={style.error}>{errors.loginUsername.message}</span>
        )}
      </label>
      <label className={style.label}>
        <input
          className={style.input}
          type="password"
          placeholder="Enter your Password"
          {...register("loginPassword", {
            required: { value: true, message: "Password is required" },
            minLength: {
              value: 6,
              message: "Password must be 6 or more characters long",
            },
          })}
        />
        {errors.loginPassword && (
          <span className={style.error}>{errors.loginPassword.message}</span>
        )}
      </label>
      <div className={style.wrapper}>
        <button className={style.button}>Sign In</button>
        <span>
          Don't have an account?{" "}
          <Link className={style.link} to={"/register"}>
            Join Now
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

export default LoginForm;
