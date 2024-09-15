import { Module } from '@nestjs/common';

import { AwsResolver } from './resolvers/aws.resolver';
import { AwsS3Service } from './services/aws.s3.service';

@Module({
    providers: [AwsS3Service, AwsResolver],
    exports: [AwsS3Service],
})
export class AwsModule {}
