// DTO — Data Transfer Object
// Validates and types the incoming request body for login

import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
