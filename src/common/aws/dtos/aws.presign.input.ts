import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { FileClass } from 'src/core/graphql/enums/file.class.enum';

@InputType()
export class AwsPresignInput {
    @Field()
    @IsNotEmpty()
    fileNameWithExtension: string;

    @Field(() => FileClass)
    @IsNotEmpty()
    fileClass: FileClass;
}
