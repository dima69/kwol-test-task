import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @Matches(/^[a-zA-Z\s]+$/, { message: 'Name must contain only latin letters' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^[a-zA-Z\s]+$/, { message: 'Password must contain only latin letters' })
  password: string;
}
