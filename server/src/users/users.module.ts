import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RecipesModule } from 'src/recipes/recipes.module';
import { JwtModule } from '@nestjs/jwt';
import { SECRET_JWT } from 'src/constants';
import { JwtStrategy } from './jwt.strategy';
@Module({
  imports: [
    RecipesModule,
    JwtModule.register({
      secret: SECRET_JWT,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
})
export class UsersModule {}
