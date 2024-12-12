import { Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';

@Injectable()
export class RedisService {
	private readonly redis: Redis.Redis;

	constructor() {
		this.redis = new Redis.default({
			host: process.env.REDIS_HOST,
			port: parseInt(process.env.REDIS_PORT, 10),
		});
	}

	async set(key: string, value: string, ttl: number): Promise<void> {
		await this.redis.set(key, value, 'EX', ttl);
	}

	async get(key: string): Promise<string | null> {
		return await this.redis.get(key);
	}

	async del(key: string): Promise<void> {
		await this.redis.del(key);
	}

	async hset(hashKey: string, field: string, value: any): Promise<void> {
		const serializedValue = JSON.stringify(value);
		await this.redis.hset(hashKey, field, serializedValue);
	}

	async hget<T>(hashKey: string, field: string): Promise<T | null> {
		const result = await this.redis.hget(hashKey, field);
		return result ? JSON.parse(result) : null;
	}

	async hdel(hashKey: string, field: string): Promise<void> {
		await this.redis.hdel(hashKey, field);
	}

	async hexists(hashKey: string, field: string): Promise<boolean> {
		const exists = await this.redis.hexists(hashKey, field);
		return exists === 1;
	}
}