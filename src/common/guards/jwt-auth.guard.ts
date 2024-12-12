import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly redisService: RedisService,
	) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const authHeader = request.headers['authorization'];

		if (!authHeader) {
			throw new UnauthorizedException('No token provided');
		}

		const token = authHeader.split(' ')[1];
		
		try {
			const payload = this.jwtService.verify(token);
			const hashKey = `user:${payload.sub}`;

			const activeToken = await this.redisService.hget<string>(hashKey, 'token');
			if (activeToken !== token) {
				throw new UnauthorizedException('Session expired or invalid');
			}

			request.user = payload;
			return true;
		} catch (error) {
			throw new UnauthorizedException('Invalid or expired token');
		}
	}
}