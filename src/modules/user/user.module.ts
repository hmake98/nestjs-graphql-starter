import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';

import { UserResolver } from './resolvers/user.resolver';
import { UserService } from './services/user.service';

@Module({
    imports: [DatabaseModule],
    exports: [UserService],
    providers: [UserService, UserResolver],
})
export class UserModule {}
