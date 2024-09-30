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

// Type for a single meal item
export interface Meal {
  mealId: number;
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
