import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MealCategories, MealAreas } from 'src/recipes/entities/recipe.entity';

/* Instructions Array Validation */
class Instructions {
  @IsNumber()
  @IsNotEmpty()
  step: number;

  @IsString()
  @IsNotEmpty()
  instruction: string;
}

/* Ingredients Array Validation */
class Ingredients {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  quantity: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  ingredient: string;
}

export class UserCreateRecipeDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  mealName: string;

  @IsNotEmpty()
  @IsEnum(MealCategories)
  mealCategory: MealCategories;

  @IsNotEmpty()
  @IsEnum(MealAreas)
  mealArea: MealAreas;

  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  @MaxLength(300)
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Instructions)
  instructions: Instructions[];

  @IsUrl()
  @IsNotEmpty()
  mealImg: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Ingredients)
  ingredients: Ingredients[];
}
