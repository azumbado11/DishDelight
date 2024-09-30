import style from "./Skeleton.module.css";

const Skeleton = () => {
  return (
    <section className={style.skeleton__container}>
      <article className={style.loader_card__container}></article>
      <article className={style.loader_card__container}></article>
      <article className={style.loader_card__container}></article>
      <article className={style.loader_card__container}></article>
      <article className={style.loader_card__container}></article>
      <article className={style.loader_card__container}></article>
      <article className={style.loader_card__container}></article>
      <article className={style.loader_card__container}></article>
      <article className={style.loader_card__container}></article>
      <article className={style.loader_card__container}></article>
    </section>
  );
};

export default Skeleton;
