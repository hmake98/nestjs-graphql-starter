import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class SignupInput {
    @Field()
    @IsEmail()
    email: string;

    @Field()
    @IsNotEmpty()
    password: string;

    @Field({ nullable: true })
    @IsOptional()
    firstName?: string;

    @Field({ nullable: true })
    @IsOptional()
    lastName?: string;
}
