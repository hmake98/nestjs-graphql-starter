import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';
import { fromIni } from '@aws-sdk/credential-providers';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AwsPresignPutResponse } from '../dtos/aws.presign.response';
import { IS3CredentialResponse } from '../interfaces/aws.s3.interface';
import { IAwsS3Service } from '../interfaces/aws.s3.service.interface';

@Injectable()
export class AwsS3Service implements IAwsS3Service {
    private stsClient: STSClient;
    private readonly region: string;
    private readonly roleArn: string;
    private readonly bucketName: string;
    private readonly presignExpiry: number;
    private readonly isLocalEnv: boolean;
    private readonly localAwsProfile: string;

    constructor(private readonly configService: ConfigService) {
        this.region = this.configService.get<string>('aws.region');
        this.roleArn = this.configService.get<string>('aws.roleArn');
        this.bucketName = this.configService.get<string>('aws.s3.bucket');
        this.presignExpiry =
            this.configService.get<number>('aws.s3.linkExpire');
        this.isLocalEnv = this.configService.get<string>('app.env') === 'local';
        this.localAwsProfile = this.configService.get<string>(
            'aws.localProfileName'
        );

        if (!this.isLocalEnv) {
            this.stsClient = new STSClient({ region: this.region });
        }
    }

    async getTemporaryCredentials(): Promise<IS3CredentialResponse> {
        if (this.isLocalEnv) {
            const credentials = await fromIni({
                profile: this.localAwsProfile,
            })();
            return {
                accessKeyId: credentials.accessKeyId,
                secretAccessKey: credentials.secretAccessKey,
                sessionToken: credentials.sessionToken,
            };
        } else {
            const command = new AssumeRoleCommand({
                RoleArn: this.roleArn,
                RoleSessionName: `s3-access-${Date.now()}`,
                DurationSeconds: 3600, // 1 hour
            });

            const response = await this.stsClient.send(command);
            return {
                accessKeyId: response.Credentials.AccessKeyId,
                secretAccessKey: response.Credentials.SecretAccessKey,
                sessionToken: response.Credentials.SessionToken,
            };
        }
    }

    async getS3Client(): Promise<S3Client> {
        if (this.isLocalEnv) {
            return new S3Client({
                region: this.region,
                credentials: fromIni({ profile: this.localAwsProfile }),
            });
        } else {
            const credentials = await this.getTemporaryCredentials();
            return new S3Client({
                region: this.region,
                credentials: credentials,
            });
        }
    }

    async getPresignedUrlForPut(key: string): Promise<AwsPresignPutResponse> {
        try {
            const s3Client = await this.getS3Client();
            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            const url = await getSignedUrl(s3Client, command, {
                expiresIn: this.presignExpiry,
            });

            return {
                url,
                expirey: this.presignExpiry,
            };
        } catch (error) {
            throw error;
        }
    }
}
