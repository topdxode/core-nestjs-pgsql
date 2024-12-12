import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { RedisService } from 'src/common/redis/redis.service';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly jwtService: JwtService,
		private readonly redisService: RedisService
	) { }

	async register(registerDto: RegisterDto): Promise<{ accessToken: string }> {
		const { email, password, userName, ...reqRegister } = registerDto;

		const existingUser = await this.userRepository.findOne({
			where: [{ email }, { userName }]
		});

		if (existingUser) throw new ConflictException('Email is already in use.');

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = this.userRepository.create({
			...reqRegister,
			userName,
			email,
			password: hashedPassword,
		});
		await this.userRepository.save(user);

		const payload = { sub: user.id, email: user.email };
		const accessToken = this.jwtService.sign(payload);

		return { accessToken };
	}

	async login(userName: string, password: string): Promise<{ accessToken: string }> {
		const user = await this.userRepository.findOne({ where: { userName } });

		if (!user) {
			throw new UnauthorizedException('Invalid username or password');
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid username or password');
		}

		const payload = { sub: user.id, userName: user.userName };
		const accessToken = this.jwtService.sign(payload);

		const hashKey = `user:${user.id}`;
		await this.redisService.hset(hashKey, 'token', accessToken);

		return { accessToken };
	}

	async logout(userId: number): Promise<void> {
		const hashKey = `user:${userId}`;
		await this.redisService.hdel(hashKey, 'token');
	}
}