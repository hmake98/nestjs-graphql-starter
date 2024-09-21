import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { FileStorageClass } from 'src/app/graphql/enums';

@InputType()
export class AwsPresignInput {
    @Field()
    @IsNotEmpty()
    fileNameWithExtension: string;

    @Field(() => FileStorageClass)
    @IsNotEmpty()
    fileClass: FileStorageClass;
}
