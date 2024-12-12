import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const DatabaseConfig = (): TypeOrmModuleOptions => ({
	type: 'postgres',
	host: process.env.DB_HOST,
	port: 5432,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD ,
	database: process.env.DB_NAME,
	schema: process.env.DBSCHEMA,
	synchronize: true,
	autoLoadEntities: true,
	logging: process.env.DB_LOGGING === 'true',
});