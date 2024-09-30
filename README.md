## Description
Recipes social network project made with React and NestJS.

## Author
**azumbado11**
* [LinkedIn](https://www.linkedin.com/in/azumbado11)

## Getting Started
- Install dependencies install dependencies on client and server folder
- In the root directory, run dev command to start the development server

Check [http://localhost:5173](http://localhost:5173) with your browser to see the frontend.
Check [http://localhost:3000](http://localhost:3000) with your browser to see the API.

# API Documentation

## Base URL
All endpoints are accessible at: http://localhost:3000

## Endpoints

### User Actions
- **GET** `/users/:userId` **(Private)**: Retrieve user data by ID.
- **GET** `/users/:userId/username` **(Public)**: Retrieve only the username by ID.
- **POST** `/users/register`: Register a new user.
- **POST** `/users/login`: Log in a user and retrieve authentication token.
- **POST** `/users/logout`: Log out the current user.
- **DELETE** `/users/:userId` **(Private)**: Remove a user by ID.

### User Data
- **GET** `/users/:userId/recipes` **(Public)**: Retrieve all recipes created by the user.
- **GET** `/users/:userId/favorites` **(Public)**: Retrieve favorite recipes of the user.
- **POST** `/users/:userId/recipes` **(Private)**: Add a new recipe to the database.
- **POST** `/users/:userId/favorites` **(Private)**: Add a recipe to the user's favorites.
- **DELETE** `/users/:userId/recipes` **(Private)**: Remove a recipe from the database.
- **DELETE** `/users/:userId/favorites` **(Private)**: Remove a recipe from the user's favorites.

### Recipes
- **GET** `/recipes` **(Public)**: Retrieve all recipes.
- **GET** `/recipes/:recipeId` **(Public)**: Retrieve a specific recipe by ID.
- **GET** `/recipes/batch/ids?q=` **(Public)**: Retrieve multiple recipes by their IDs.

## API Query Filters
Filter items by query parameters. The following parameters are allowed:

- **Category**: `?category=` (options: breakfast, main course, dessert, salad, drink)
- **Area**: `?area=` (options: italian, greek, american, caribbean, russian, french, japanese, chinese, austrian, latin american, british)
- **Recipe Name**: `?search=`

## Notes
- Endpoints marked as **(Private)** require authentication.
- Ensure proper permissions when accessing user-specific data.
	

## Contact
Contact me at gv11zumbado@gmail.com
