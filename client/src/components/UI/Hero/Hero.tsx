import { Link } from "react-router-dom";
import image from "../../../assets/hero.webp";
import { SectionLayout } from "../../../layouts";
import "./Hero.css";

const Hero = () => {
  return (
    <SectionLayout>
      <section className="hero__container">
        <div className="hero-info__container">
          <span className="hero-info-italics">Join Our Cooking Community</span>
          <h1>Discover Your Next Favorite Recipe</h1>
          <p>
            Explore thousands of delicious recipes from around the world and
            elevate your cooking with gourmet recipes at home.
          </p>
          <div className="hero-cta-btns__wrapper">
            <Link to={"/recipes"} className="hero-cta-btn">
              Browse Recipes
            </Link>
            <Link to={"/login"} className="hero-cta-btn hero-cta-btn-outline">
              Share your cooking
            </Link>
          </div>
        </div>
        <img
          src={image}
          alt="hero recipe image"
          className="hero-img__container"
        />
      </section>
    </SectionLayout>
  );
};

export default Hero;
