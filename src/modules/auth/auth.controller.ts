import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post('register')
	async register(@Body() registerDto: RegisterDto) {
		return this.authService.register(registerDto);
	}

	@Post('login')
	async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
		return this.authService.login(loginDto.userName, loginDto.password);
	}

	@Post('logout')
	@UseGuards(JwtAuthGuard)
	async logout(@Req() req): Promise<void> {
		const userId = req.user.sub;
		await this.authService.logout(userId);
	}
}
