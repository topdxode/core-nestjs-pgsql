import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
	@IsNotEmpty()
	firstName: string;

	@IsNotEmpty()
	lastName: string;

	@IsNotEmpty()
	userName: string;

	@IsEmail()
	email: string;

	@IsNotEmpty()
	@MinLength(6)
	password: string;
}