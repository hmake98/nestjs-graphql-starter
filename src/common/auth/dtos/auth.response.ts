import { ObjectType, Field } from '@nestjs/graphql';
import { UserResponse } from 'src/modules/user/dtos/user.response';

@ObjectType()
export class AuthResponse {
    @Field()
    accessToken: string;

    @Field()
    user: UserResponse;
}
