import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { FindAllQueryParams } from './entities/recipe.entity';
import DBLocal from 'db-local';
import { Meal } from '../types/recipes';

/* DBLocal instance and db path*/
const { Schema } = new DBLocal({ path: './src/databases/recipes' });

/* Schema for Recipes DB */
const Recipe = Schema('Recipe', {
  _id: { type: Number, required: true },
  mealName: { type: String, required: true },
  createdBy: { type: String, required: true },
  mealCategory: { type: String, required: true },
  mealArea: { type: String, required: true },
  rating: { type: Number, required: true },
  description: { type: String, required: true },
  instructions: Array,
  mealImg: { type: String, required: true },
  ingredients: Array,
});

@Injectable()
export class RecipesService {
  findAll(params: FindAllQueryParams) {
    /* query params destructure */
    const { category, area, search, page = 1, pageSize = 10 } = params;
    console.log('Params:', { category, area, search, page, pageSize });

    /* normalized to lowercase string filter params */
    const normalizedCategory = category?.toLowerCase();
    const normalizedArea = area?.toLowerCase();
    const normalizedSearch = search?.toLowerCase();

    /* parsed string pagination params */
    const parsedPage = Number(page);
    const parsedPageSize = Number(pageSize);

    /* continue only if page and pageSize are positive */
    if (parsedPage < 1 || parsedPageSize < 1) {
      throw new NotFoundException('Invalid Page Size');
    }

    /* Filtering function */
    const filteredData = Recipe.find((recipe: Meal) => {
      /* normalized to lowercase string recipe data for filtering  */
      const recipeCategory = recipe.mealCategory.toLowerCase();
      const recipeArea = recipe.mealArea.toLowerCase();
      const recipeName = recipe.mealName.toLowerCase();

      return (
        (!normalizedCategory || recipeCategory === normalizedCategory) &&
        (!normalizedArea || recipeArea === normalizedArea) &&
        (!normalizedSearch || recipeName.includes(normalizedSearch))
      );
    });

    /* Handle Pagination */
    const totalItems = filteredData.length;
    const startIndex = (parsedPage - 1) * parsedPageSize;
    const endIndex = startIndex + parsedPageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    const hasNextPage = endIndex < totalItems;

    /* Not found error */
    if (paginatedData.length === 0 && parsedPage > 1) {
      console.error('Throwing NotFoundException due to empty paginated data');
      throw new NotFoundException('Recipe Not Found');
    }

    /* Check if no data was found for valid query params */
    if (totalItems === 0) {
      console.error('Throwing NotFoundException due to no matching data');
      throw new NotFoundException('No recipes found matching the query');
    }

    return {
      pagination: {
        has_next_page: hasNextPage,
        current_page: parsedPage,
        items: {
          count: paginatedData.length,
          total: totalItems,
          per_page: parsedPageSize,
        },
      },
      data: paginatedData,
    };
  }

  findOne(recipeId: number) {
    /* filter a recipe by recipeId */
    const recipe = Recipe.findOne({ _id: recipeId });

    /* if there is no recipe, throw 404 */
    if (!recipe) throw new NotFoundException('Recipe Not Found');
    return { recipe };
  }

  /* Find many recipes by Id */
  getRecipesByIds(ids: number[]) {
    // Validate the ids array
    if (ids.length === 0) {
      throw new BadRequestException('Invalid or no IDs provided');
    }

    /* find recipes by an array of ids */
    const recipes = Recipe.find((recipe) => ids.includes(recipe._id));

    /* check if there is matches */
    if (recipes.length === 0)
      throw new NotFoundException('IDs do not match any recipe');

    return recipes;
  }

  /* Add a specific user created recipe to recipes db (private) */
  create(createRecipe: CreateRecipeDto) {
    /* assign recipe id */
    const id = Recipe.find().length + 1;

    /* capitalize recipe category and area */
    const normalizedCategory = this.capitalize(createRecipe.mealCategory);
    const normalizedArea = this.capitalize(createRecipe.mealArea);

    /* add recipe to recipes db */
    Recipe.create({
      _id: id,
      mealName: createRecipe.mealName,
      createdBy: createRecipe.createdBy,
      mealCategory: normalizedCategory,
      mealArea: normalizedArea,
      rating: 0,
      description: createRecipe.description,
      instructions: createRecipe.instructions,
      mealImg: createRecipe.mealImg,
      ingredients: createRecipe.ingredients,
    }).save();

    return id;
  }

  /* Remove a specific user created recipe from recipes db (private) */
  remove(userId: string, recipeId: number) {
    const recipe = Recipe.findOne({ _id: recipeId });

    if (recipe.createdBy !== userId)
      throw new NotFoundException(
        'This user its not allowed to delete that recipe',
      );

    Recipe.remove({ _id: recipeId });

    return recipe.mealName;
  }

  /* Helper to check a recipe coincidence in recipes db with userId and mealName */
  doesRecipeExist(userId: string, mealName: string) {
    /* filter a recipe with userId and mealName */
    const recipe = Recipe.findOne({ createdBy: userId, mealName: mealName });

    /* check recipe coincidence */
    if (recipe)
      throw new NotFoundException(`You already have a recipe for ${mealName}`);

    return false;
  }

  /* Helper to capitalize a string */
  private capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
