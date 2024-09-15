import { S3Client } from '@aws-sdk/client-s3';

import { AwsPresignPutResponse } from '../dtos/aws.presign.response';
import { IS3CredentialResponse } from './aws.s3.interface';

export interface IAwsS3Service {
    getTemporaryCredentials(): Promise<IS3CredentialResponse>;
    getS3Client(): Promise<S3Client>;
    getPresignedUrlForPut(key: string): Promise<AwsPresignPutResponse>;
}
