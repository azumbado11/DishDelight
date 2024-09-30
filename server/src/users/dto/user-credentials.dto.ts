import { IsNotEmpty, IsString, MinLength } from 'class-validator';
export class UserCredentialsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
