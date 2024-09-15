import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';

import { HttpExceptionFilter } from './filters/exception.filter';
import * as resolvers from './graphql/resolvers';
import * as scalars from './graphql/scalars';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
    providers: [
        ...Object.values(resolvers),
        ...Object.values(scalars),
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
})
export class CoreModule {}
