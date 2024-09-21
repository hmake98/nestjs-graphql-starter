import { join } from 'path';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TerminusModule } from '@nestjs/terminus';
import { CommonModule } from 'src/common/common.module';
import { CoreModule } from 'src/core/core.module';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from 'src/modules/user/user.module';

import * as resolvers from '../app/graphql/resolvers';
import * as scalars from '../app/graphql/scalars';
import { AppController } from './app.controller';

@Module({
    controllers: [AppController],
    imports: [
        TerminusModule,
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                sortSchema: true,
                autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
                cache: 'bounded',
                playground: false,
                ...(configService.get<string>('app.graphql.playground') ===
                    'true' && {
                    plugins: [ApolloServerPluginLandingPageLocalDefault()],
                }),
                context: ({ req }) => ({ req }),
            }),
        }),

        // Imported
        CoreModule,
        DatabaseModule,
        CommonModule,
        UserModule,
    ],
    providers: [...Object.values(resolvers), ...Object.values(scalars)],
})
export class AppModule {}
