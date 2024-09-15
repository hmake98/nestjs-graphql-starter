import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AwsPresignPutResponse {
    @Field()
    url: string;

    @Field()
    expirey: number;
}
