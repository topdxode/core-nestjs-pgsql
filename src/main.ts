import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './config/app.config';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix(AppConfig.globalPrefix);
	app.useGlobalPipes(new ValidationPipe());

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
			exceptionFactory: (errors) => {
				const errorMessages = errors.map((error) => {
					const constraints = error.constraints ? Object.values(error.constraints) : [];
					return constraints.join(', ');
				});
				return new BadRequestException(`Validation failed: ${errorMessages.join(', ')}`);
			},
		}),
	);

	await app.listen(process.env.PORT);
}
bootstrap();
