import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MealCategories, MealAreas } from '../entities/recipe.entity';

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

/* Recipe DTO */
export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  mealName: string;

  @IsUUID()
  @IsNotEmpty()
  createdBy: string;

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
/* mealId is assigned by DB */
/* rating is assigned by DB */
