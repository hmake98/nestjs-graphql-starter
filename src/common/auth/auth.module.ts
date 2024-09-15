import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';
import { HelperModule } from '../helper/helper.module';
import { JwtStrategy } from './providers/jwt.provider';
import { AuthResolver } from './resolvers/auth.resolver';
import { AuthService } from './services/auth.service';

@Module({
    imports: [DatabaseModule, HelperModule],
    providers: [AuthResolver, AuthService, JwtStrategy],
    exports: [AuthResolver, AuthService],
})
export class AuthModule {}
