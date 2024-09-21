import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ObjectType()
export class GenericResponse {
    @Field()
    @IsString()
    message: string;
}
