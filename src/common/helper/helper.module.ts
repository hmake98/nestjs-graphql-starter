import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { HelperEncryptionService } from './services/helper.encryption.service';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('auth.accessToken.secret'),
                signOptions: {
                    expiresIn: configService.get<string>(
                        'auth.accessToken.tokenExp'
                    ),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [HelperEncryptionService],
    exports: [HelperEncryptionService],
})
export class HelperModule {}
