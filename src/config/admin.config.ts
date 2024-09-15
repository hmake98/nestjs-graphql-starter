import { registerAs } from '@nestjs/config';

export default registerAs(
    'admin',
    (): Record<string, any> => ({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
    })
);
