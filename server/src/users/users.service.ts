import { Injectable } from '@nestjs/common';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { UserCreateRecipeDTO } from './dto/user-create-recipe.dto';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import DBLocal from 'db-local';
import { ValidationError } from '../errors/errors';
import { SALT_ROUNDS } from 'src/constants';
import { RecipesService } from 'src/recipes/recipes.service';
import { JwtService } from '@nestjs/jwt';

const { Schema } = new DBLocal({ path: './src/databases/users' });

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  recipes: Array,
  favorites: Array,
});

@Injectable()
export class UsersService {
  constructor(
    private readonly recipesService: RecipesService,
    private readonly jwtService: JwtService,
  ) {}
  /* Register User Method */
  async create(userCredentials: UserCredentialsDto) {
    const { username, password } = userCredentials;

    /* Verify if user already exists */
    const user = User.findOne({ username });
    if (user) throw new ValidationError('User Already Exists');

    /* Create an user unique Id */
    const id = crypto.randomUUID();

    /* Hash user password */
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    /* Save user to the database */
    User.create({
      _id: id,
      username: userCredentials.username,
      password: hashedPassword,
      recipes: [],
      favorites: [],
    }).save();

    return {
      id,
    };
  }

  async login(userCredentials: UserCredentialsDto) {
    const { username, password } = userCredentials;

    /* Check if user exists */
    const user = User.findOne({ username });
    if (!user) throw new ValidationError('User does not exist');

    /* check passwords */
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new ValidationError('Password is invalid');

    /* data that would be sign and send in jwt */
    const payload = { id: user._id, username: user.username };

    /* create token with payload */
    const token = this.jwtService.sign(payload);

    /* Return user data without password */
    return {
      _id: user._id,
      username: user.username,
      token,
    };
  }

  /* Get user username by Id (public) */
  getUsername(userId: string) {
    const user = this.findUserById(userId);
    return {
      username: user.username,
    };
  }

  /* Get user data by Id (private) */
  findOne(userId: string) {
    const user = this.findUserById(userId);
    return {
      username: user.username,
      recipes: user.recipes,
      favorites: user.favorites,
    };
  }

  /* Delete user by Id (private) */
  remove(userId: string) {
    const user = this.findUserById(userId);

    user.remove();
    return { message: `User deleted successfully` };
  }

  /* Get user by id created recipes (public) */
  recipes(userId: string) {
    const user = this.findUserById(userId);
    return {
      recipes: user.recipes,
    };
  }

  /* Get user by id favorite recipes (public) */
  favorites(userId: string) {
    const user = this.findUserById(userId);
    return {
      favorites: user.favorites,
    };
  }

  /* Add a recipe to user recipes [] and to recipes db (private) */
  createRecipe(userId: string, createRecipe: UserCreateRecipeDTO) {
    /* check if user exists in db */
    const user = this.findUserById(userId);

    /* check with mealName and userID if recipe already exists on recipe DB !! */
    this.recipesService.doesRecipeExist(userId, createRecipe.mealName);

    const recipe = {
      mealName: createRecipe.mealName,
      createdBy: userId,
      mealCategory: createRecipe.mealCategory,
      mealArea: createRecipe.mealArea,
      description: createRecipe.description,
      instructions: createRecipe.instructions,
      mealImg: createRecipe.mealImg,
      ingredients: createRecipe.ingredients,
    };

    /* call createRecipe Service and return Id */
    const recipeId = this.recipesService.create(recipe);

    /* get user created recipes */
    const userRecipes = user.recipes;

    /* push returned createdRecipe Id in user recipes[] */
    userRecipes.push(recipeId);

    /* update in users db the new favorites[] */
    user.update({ recipes: userRecipes }).save();

    return {
      message: `Your ${createRecipe.mealName} recipe has been created successfully`,
      recipeId,
    };
  }

  /* Add a recipe id to user favorites [] (private) */
  addFavorite(userId: string, recipeId: number) {
    /* check if user exists in db */
    const user = this.findUserById(userId);

    /* get user favorite recipes */
    const userFavorites = user.favorites;

    /* check if recipe is already in favorites */
    if (userFavorites.find((i) => i === recipeId))
      throw new ValidationError('Recipe is already in your favorites');

    /* push recipeId in user favorites [] */
    userFavorites.push(recipeId);

    /* update in users db the new favorites[] */
    user.update({ favorites: userFavorites }).save();
    return { message: `Recipe #${recipeId} added to your favorites` };
  }

  /* remove a recipe from user recipes [] and recipes db (private) */
  deleteRecipe(userId: string, recipeId: number) {
    /* check if user exists in db */
    const user = this.findUserById(userId);

    /* get user recipes */

    const userRecipes = user.recipes;
    /* check if recipe its in user recipes */
    if (!userRecipes.find((i) => i === recipeId))
      throw new ValidationError('Recipe is not in your created recipes');

    /* remove the recipe from user recipes and update the change in users db */
    const updatedRecipes = userRecipes.filter((i) => i !== recipeId);
    user.update({ recipes: updatedRecipes }).save();

    /* remove the recipe from recipes db */
    const recipeName = this.recipesService.remove(userId, recipeId);

    return { message: `${recipeName} recipe removed` };
  }

  /* remove a recipe from user favorites [] (private) */
  deleteFavorite(userId: string, recipeId: number) {
    /* check if user exists in db */
    const user = this.findUserById(userId);

    /* get user favorite recipes */
    const userFavorites = user.favorites;

    /* check if recipe its in user favorites */
    if (!userFavorites.find((i) => i === recipeId))
      throw new ValidationError('Recipe is not in your favorites');

    /* remove the recipe from user favorites and update the change in users db */
    const updatedFavorites = userFavorites.filter((i) => i !== recipeId);
    user.update({ favorites: updatedFavorites }).save();
    return { message: `Recipe #${recipeId} removed from your favorites` };
  }

  /* Helper function to check if user exists */
  private findUserById(userId: string) {
    const user = User.findOne({ _id: userId });
    if (!user) throw new ValidationError('User does not exist');
    return user;
  }
}
