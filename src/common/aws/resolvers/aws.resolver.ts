import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { IAuthUser } from 'src/common/auth/interfaces/auth.interface';
import { CurrentUser } from 'src/core/decorators/user.decorator';

import { AwsPresignInput } from '../dtos/aws.presign.input';
import { AwsPresignPutResponse } from '../dtos/aws.presign.response';
import { AwsS3Service } from '../services/aws.s3.service';

@Resolver()
export class AwsResolver {
    constructor(private readonly awsS3Service: AwsS3Service) {}

    @Mutation(() => AwsPresignPutResponse)
    async getPresignUrlForPut(
        @CurrentUser() { userId }: IAuthUser,
        @Args('presignInput') presignInput: AwsPresignInput
    ) {
        const key = `${presignInput.fileClass}/${userId}_file_${Date.now()}_${presignInput.fileNameWithExtension}`;
        return this.awsS3Service.getPresignedUrlForPut(key);
    }
}
