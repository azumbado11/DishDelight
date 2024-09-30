// Type for a single instruction
interface Instruction {
  step: number;
  instruction: string;
}

// Type for a single ingredient
interface Ingredient {
  quantity: string;
  ingredient: string;
}

export enum MealAreas {
  Italian = 'italian',
  Greek = 'greek',
  American = 'american',
  Caribbean = 'caribbean',
  Russian = 'russian',
  French = 'french',
  Japanese = 'japanese',
  Chinese = 'chinese',
  Austrian = 'austrian',
  Latin_American = 'latin american',
  British = 'brithish',
}

export enum MealCategories {
  Breakfast = 'breakfast',
  Main_Course = 'main course',
  Dessert = 'dessert',
  Salad = 'salad',
  Drink = 'drink',
}

// Type for a single meal item
interface Meal {
  mealId: number;
  mealName: string;
  createdBy: string;
  mealCategory: MealCategories;
  mealArea: MealAreas;
  rating: number;
  description: string;
  instructions: Instruction[];
  mealImg: string;
  ingredients: Ingredient[];
}

export class Recipe {
  data: Meal[];
}

export interface FindAllQueryParams {
  category?: MealCategories;
  area?: MealAreas;
  search?: string;
  page?: number;
  pageSize?: number;
}
