import { Field, ObjectType } from '@nestjs/graphql';
import { Role, User } from '@prisma/client';

@ObjectType()
export class UserResponse implements User {
    @Field()
    id: string;

    @Field()
    email: string;

    @Field({ nullable: true })
    avatar: string;

    @Field({ nullable: true })
    firstName: string;

    @Field({ nullable: true })
    lastName: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field({ nullable: true })
    deletedAt: Date;

    @Field()
    role: Role;

    password: string;
}
