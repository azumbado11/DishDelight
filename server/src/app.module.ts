import { Module } from '@nestjs/common';
import { RecipesModule } from './recipes/recipes.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [RecipesModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
