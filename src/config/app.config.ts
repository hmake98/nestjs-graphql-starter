import { registerAs } from '@nestjs/config';

export default registerAs(
    'app',
    (): Record<string, any> => ({
        env: process.env.NODE_ENV ?? 'development',
        http: {
            host: process.env.HTTP_HOST ?? '0.0.0.0',
            port: process.env.HTTP_PORT
                ? Number.parseInt(process.env.HTTP_PORT)
                : 3001,
        },
        cors: {
            origin: process.env.APP_CORS_ORIGIN,
        },
        graphql: {
            playground: process.env.GRAPHQL_PLAYGROUND,
        },
        throttle: {
            ttl: 60,
            limit: 10,
        },
    })
);
