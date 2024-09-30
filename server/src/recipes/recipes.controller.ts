import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FindAllQueryParams } from './entities/recipe.entity';
import { RecipesService } from './recipes.service';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  /* Get all recipes or filter by query */
  @Get()
  findAll(@Query() query: FindAllQueryParams) {
    try {
      return this.recipesService.findAll(query);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        'Unexpected error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /* Get recipe by Id */
  @Get(':recipeId')
  findOne(@Param('recipeId', ParseIntPipe) recipeId: number) {
    return this.recipesService.findOne(recipeId);
  }

  /* Get recipes by a batch of Ids */
  @Get('/batch/ids')
  getRecipesByIds(@Query('q') q: string) {
    /* check if theres a query */
    if (!q) throw new BadRequestException('No query parameter provided');

    /* convert the comma-separated string to an array of integers */
    const qArray = q.split(',').map((id) => parseInt(id, 10));

    /* filter out invalid IDs */
    const validIds = qArray.filter((i) => !isNaN(i));

    return this.recipesService.getRecipesByIds(validIds);
  }
}
