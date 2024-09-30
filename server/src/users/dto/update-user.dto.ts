import { PartialType } from '@nestjs/mapped-types';
import { UserCredentialsDto } from './user-credentials.dto';

export class UpdateUserDto extends PartialType(UserCredentialsDto) {}
