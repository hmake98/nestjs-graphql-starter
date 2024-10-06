import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Command } from 'nestjs-command';
import { HelperEncryptionService } from 'src/common/helper/services/helper.encryption.service';
import { PrismaService } from 'src/database/services/prisma.service';

@Injectable()
export class UserSeed {
    private readonly logger = new Logger(UserSeed.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly prismaService: PrismaService,
        private readonly helperEncryptionService: HelperEncryptionService
    ) {}

    private getAdminEmail(): string {
        const email = this.configService.get<string>('admin.email');
        if (!email) {
            throw new Error('Admin email is not configured');
        }
        return email.trim();
    }

    private getAdminPassword(): string {
        const password = this.configService.get<string>('admin.password');
        if (!password) {
            throw new Error('Admin password is not configured');
        }
        return password;
    }

    @Command({
        command: 'seed:user',
        describe: 'Seeds admin user',
    })
    async seeds(): Promise<void> {
        this.logger.log('Starting admin user seed');

        const email = this.getAdminEmail();
        const password = this.getAdminPassword();

        try {
            const passwordHash =
                await this.helperEncryptionService.createHash(password);

            await this.prismaService.user.upsert({
                where: { email },
                update: { password: passwordHash },
                create: {
                    email,
                    password: passwordHash,
                    role: 'ADMIN',
                },
            });

            this.logger.log('Admin user seeded successfully');
        } catch (error) {
            this.logger.error('Failed to seed admin user', error.stack);
            throw new Error('Failed to seed admin user: ' + error.message);
        }
    }

    @Command({
        command: 'rollback:user',
        describe: 'Remove admin user',
    })
    async remove(): Promise<void> {
        this.logger.log('Starting admin user removal');

        const email = this.getAdminEmail();

        try {
            await this.prismaService.user.delete({
                where: { email },
            });

            this.logger.log('Admin user removed successfully');
        } catch (error) {
            if (error.code === 'P2025') {
                this.logger.warn('Admin user not found, nothing to remove');
            } else {
                this.logger.error('Failed to remove admin user', error.stack);
                throw new Error(
                    'Failed to remove admin user: ' + error.message
                );
            }
        }
    }
}
