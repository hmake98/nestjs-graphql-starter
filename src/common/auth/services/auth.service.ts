import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { HelperEncryptionService } from 'src/common/helper/services/helper.encryption.service';
import { PrismaService } from 'src/database/services/prisma.service';

import { AuthResponse } from '../dtos/auth.response';
import { LoginInput } from '../dtos/login.input';
import { SignupInput } from '../dtos/signup.input';
import { IAuthService } from '../interfaces/auth.service.interface';

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly helperEncryptionService: HelperEncryptionService
    ) {}

    async login(data: LoginInput): Promise<AuthResponse> {
        try {
            const { email, password } = data;
            const user = await this.prismaService.user.findUnique({
                where: {
                    email,
                },
            });

            if (!user) {
                throw new NotFoundException('user.errors.notFound');
            }

            const checkPassword = await this.helperEncryptionService.match(
                user.password,
                password
            );
            if (!checkPassword) {
                throw new BadRequestException('auth.errors.invalidPassword');
            }

            const token = await this.helperEncryptionService.createAccessToken({
                role: user.role,
                userId: user.id,
            });

            return {
                accessToken: token,
                user,
            };
        } catch (error) {
            throw error;
        }
    }

    async signup(data: SignupInput): Promise<AuthResponse> {
        try {
            const { email, password, firstName, lastName } = data;
            const findUser = await this.prismaService.user.findUnique({
                where: {
                    email,
                },
            });

            if (findUser) {
                throw new NotFoundException('user.errors.alreadyExists');
            }

            const hashPassword =
                await this.helperEncryptionService.createHash(password);

            const user = await this.prismaService.user.create({
                data: {
                    email: email,
                    password: hashPassword,
                    role: 'USER',
                    firstName: firstName?.trim(),
                    lastName: lastName?.trim(),
                },
            });

            const token = await this.helperEncryptionService.createAccessToken({
                role: user.role,
                userId: user.id,
            });

            return {
                accessToken: token,
                user,
            };
        } catch (error) {
            throw error;
        }
    }
}
