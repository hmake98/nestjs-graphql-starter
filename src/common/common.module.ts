import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
    AcceptLanguageResolver,
    HeaderResolver,
    I18nModule,
    QueryResolver,
} from 'nestjs-i18n';

import configs from '../config';
import { AuthModule } from './auth/auth.module';
import { AwsModule } from './aws/aws.module';
import { HelperModule } from './helper/helper.module';

@Module({
    imports: [
        AuthModule,
        AwsModule,
        HelperModule,
        ConfigModule.forRoot({
            load: configs,
            isGlobal: true,
            cache: true,
            envFilePath: ['.env'],
            expandVariables: true,
        }),
        I18nModule.forRoot({
            fallbackLanguage: 'en',
            loaderOptions: {
                path: join(__dirname, '../languages/'),
                watch: true,
            },
            resolvers: [
                { use: QueryResolver, options: ['lang'] },
                AcceptLanguageResolver,
                new HeaderResolver(['accept-language']),
            ],
        }),
    ],
})
export class CommonModule {}
