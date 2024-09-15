import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/services/prisma.service';

import { UserResponse } from '../dtos/user.response';
import { IUserService } from '../interfaces/user.service.interface';

@Injectable()
export class UserService implements IUserService {
    constructor(private readonly prismaService: PrismaService) {}

    getProfile(userId: string): Promise<UserResponse> {
        return this.prismaService.user.findUnique({
            where: {
                id: userId,
            },
        });
    }
}
