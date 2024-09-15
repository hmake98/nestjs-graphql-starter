import { registerAs } from '@nestjs/config';

export default registerAs(
    'auth',
    (): Record<string, any> => ({
        accessToken: {
            secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
            tokenExp: process.env.AUTH_ACCESS_TOKEN_EXP,
        },
    })
);
