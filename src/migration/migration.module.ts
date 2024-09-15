import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { CommonModule } from 'src/common/common.module';

import { UserSeed } from './seeds/user.seed';

@Module({
    imports: [CommonModule, CommandModule],
    providers: [UserSeed],
    exports: [UserSeed],
})
export class MigrationModule {}
