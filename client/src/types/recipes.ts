// Type for the pagination details
export interface Pagination {
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

// Type for a single instruction
interface Instruction {
  step: number;
  instruction: string;
}

// Type for a single ingredient
interface Ingredient {
  quantity: string; // Can be a string or a number
  ingredient: string;
}

// Type for a single meal item
interface Meal {
  _id: number;
  mealName: string;
  createdBy: string;
  mealCategory: string;
  mealArea: string;
  rating: number;
  description: string;
  instructions: Instruction[];
  mealImg: string;
  ingredients: Ingredient[];
}

/* Type for RecipeView Response */
export interface Recipe {
  recipe: Meal;
}

// Type for the entire response object
export interface ApiResponse {
  pagination?: Pagination;
  data: Meal[];
}

export interface setFiltersProps {
  category: string | undefined;
  area: string | undefined;
}
