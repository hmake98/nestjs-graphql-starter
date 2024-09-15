import { Query, Resolver } from '@nestjs/graphql';
import { IAuthUser } from 'src/common/auth/interfaces/auth.interface';
import { CurrentUser } from 'src/core/decorators/user.decorator';

import { UserResponse } from '../dtos/user.response';
import { UserService } from '../services/user.service';

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Query(() => UserResponse)
    async me(@CurrentUser() { userId }: IAuthUser) {
        return this.userService.getProfile(userId);
    }
}
