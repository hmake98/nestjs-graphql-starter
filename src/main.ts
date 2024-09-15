import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication, NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { AppModule } from './app/app.module';

async function bootstrap() {
    const logger = new Logger('Bootstrap');

    try {
        const app: NestApplication = await NestFactory.create(AppModule);
        const configService = app.select(AppModule).get(ConfigService);
        const port = configService.get<number>('app.http.port');
        const host = configService.get<string>('app.http.host');

        const expressApp = app.getHttpAdapter().getInstance();

        const isProduction =
            configService.get<string>('app.env') === 'production';

        // Security middleware
        if (isProduction) {
            app.use(helmet());
        } else {
            app.use(
                helmet({
                    contentSecurityPolicy: false,
                    crossOriginEmbedderPolicy: false,
                })
            );
        }

        // Validation pipe
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                transform: true,
                transformOptions: {
                    enableImplicitConversion: true,
                },
            })
        );

        // CORS configuration
        app.enableCors({
            origin: configService.get<string>('app.cors.origin'),
            credentials: true,
        });

        // Root endpoint
        expressApp.get('/', (_req, res) => {
            res.status(200).json({
                status: 200,
                message: 'Welcome to graph APIs.',
            });
        });

        expressApp.get('/favicon.ico', (_req, res) => res.sendStatus(200));

        await app.listen(port, host);

        logger.log(`🚀 Application is running on: http://localhost:${port}`);
        logger.log(`🚀 GraphQL Playground: http://localhost:${port}/graphql`);
    } catch (error) {
        logger.error('Failed to start the application:', error);
        process.exit(1);
    }
}

bootstrap();
