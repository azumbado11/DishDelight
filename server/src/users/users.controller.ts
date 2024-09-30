import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  NotFoundException,
  UseGuards,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RecipesService } from 'src/recipes/recipes.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { UserCreateRecipeDTO } from './dto/user-create-recipe.dto';
import { ValidationError } from 'src/errors/errors';
import { JwtAuthGuard } from './guards/auth.guard';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly recipesService: RecipesService,
  ) {}
  /* * *  Handle User Actions Controllers * * */
  @Post('/register')
  async create(@Body() userCredentials: UserCredentialsDto) {
    try {
      const result = await this.usersService.create(userCredentials);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        data: result,
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/login')
  async login(
    @Body() userCredentials: UserCredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const user = await this.usersService.login(userCredentials);

      /* Set the token in an HTTP-only cookie */
      res.cookie('token', user.token, {
        httpOnly: true,
        secure: true, // Set to true in production for HTTPS process.env.NODE_ENV === 'production'
        maxAge: 3600000, // 1 hour
        sameSite: 'none',
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'User login successful',
        data: user,
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    try {
      res.clearCookie('token');
      return {
        statusCode: HttpStatus.OK,
        message: 'Logout Successfully',
      };
    } catch (error) {
      console.error('Error during logout:', error.message);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'An error occurred during logout',
      });
    }
  }

  /* Get only username with user id (public) */
  @Get(':userId/username')
  getUsername(@Param('userId') userId: string) {
    return this.handleRequest(() => this.usersService.getUsername(userId));
  }

  /* Get user all data (private) */
  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.handleRequest(() => this.usersService.findOne(userId));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userId')
  remove(@Param('userId') userId: string) {
    return this.handleRequest(() => this.usersService.remove(userId));
  }

  /* * * Hanlde User Data Controllers * * */

  /* Get Recipes Created by user id (public) */
  @Get(':userId/recipes')
  recipes(@Param('userId') userId: string) {
    return this.handleRequest(() => this.usersService.recipes(userId));
  }

  /* Get User Id favorite recipes (public) */
  @Get(':userId/favorites')
  favorites(@Param('userId') userId: string) {
    return this.handleRequest(() => this.usersService.favorites(userId));
  }

  /* add to recipes db a recipe by specific user (private) */
  @UseGuards(JwtAuthGuard)
  @Post(':userId/recipes')
  createRecipe(
    @Param('userId') userId: string,
    @Body() createRecipe: UserCreateRecipeDTO,
  ) {
    return this.handleRequest(() =>
      this.usersService.createRecipe(userId, createRecipe),
    );
  }

  /* add a favorite recipe by Id to users db (private) */
  @UseGuards(JwtAuthGuard)
  @Post(':userId/favorites/:recipeId')
  addFavorite(
    @Param('userId') userId: string,
    @Param('recipeId', ParseIntPipe) recipeId: number,
  ) {
    /* check if recipe exists */
    this.handleRequest(() => this.recipesService.findOne(recipeId));

    return this.handleRequest(() =>
      this.usersService.addFavorite(userId, recipeId),
    );
  }

  /* delete from recipes db a recipe created by specific user (private) */
  @UseGuards(JwtAuthGuard)
  @Delete(':userId/recipes/:recipeId')
  deleteRecipe(
    @Param('userId') userId: string,
    @Param('recipeId', ParseIntPipe) recipeId: number,
  ) {
    /* check if recipe exists */
    this.handleRequest(() => this.recipesService.findOne(recipeId));

    return this.handleRequest(() =>
      this.usersService.deleteRecipe(userId, recipeId),
    );
  }

  /* delete from recipes db a favorite recipe by specific user (private) */
  @UseGuards(JwtAuthGuard)
  @Delete(':userId/favorites/:recipeId')
  deleteFavorite(
    @Param('userId') userId: string,
    @Param('recipeId', ParseIntPipe) recipeId: number,
  ) {
    /* check if recipe exists */
    this.handleRequest(() => this.recipesService.findOne(recipeId));

    return this.handleRequest(() =>
      this.usersService.deleteFavorite(userId, recipeId),
    );
  }

  /* Utility function to handle exceptions */
  private handleRequest<T>(action: () => T): T {
    try {
      return action();
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
/* 
src/
├── constants/
│   └── index.ts
├── databases/
│   ├──Recipes/
│   │   └── Recipes.JSON
│   └──Users/
│      └── User.JSON
├── errors/
│   └── errors.ts
├──recipes/
│   ├── controllers/
│   ├── services/
│   ├── dto/
│   ├── entities/
│   └── recipes.module.ts
├──types/
│  ├── recipes.ts
│  └── user.ts
├──users/
│   ├── controllers/
│   ├── services/
│   ├── dto/
│   ├── entities/
│   └── users.module.ts
├── app.module.ts
└── main.ts

*/
/* 
Posiible
Following the next Nest project structure, do I need to create a separate module or something to handle user session with jwt and cookies (User module already have a route for login and register)
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   ├── auth.module.ts
│   └── auth.constants.ts

*/

/* 
@Post('/login')
  async login(@Body() userCredentials: UserCredentialsDto, @Res() res: Response) {
    try {
      const user = await this.usersService.login(userCredentials);
      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.SECRET_JWT_KEY, // Ensure SECRET_JWT_KEY is from an environment variable
        {
          expiresIn: '1h',
        },
      );

      res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS in production
          sameSite: 'strict', // Consider using 'strict' or 'lax' based on your requirements
          maxAge: 1000 * 60 * 60, // 1 hour
        })
        .status(HttpStatus.OK)
        .json({
          statusCode: HttpStatus.OK,
          message: 'User login successful',
          data: user,
          token, // Send the token if needed
        });
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
*/

/* 
https://www.youtube.com/watch?v=2P-Bxrtser4 17:40
*/
