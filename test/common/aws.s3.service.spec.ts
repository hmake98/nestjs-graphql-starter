import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {
    AssumeRoleCommand,
    AssumeRoleCommandOutput,
    STSClient,
} from '@aws-sdk/client-sts';
import { fromIni } from '@aws-sdk/credential-providers';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AwsS3Service } from 'src/common/aws/services/aws.s3.service';

jest.mock('@aws-sdk/client-sts');
jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/credential-providers');
jest.mock('@aws-sdk/s3-request-presigner');

describe('AwsS3Service', () => {
    let service: AwsS3Service;

    describe('Local Environment', () => {
        beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
                providers: [
                    AwsS3Service,
                    {
                        provide: ConfigService,
                        useValue: {
                            get: jest.fn((key: string) => {
                                switch (key) {
                                    case 'aws.region':
                                        return 'us-east-1';
                                    case 'aws.roleArn':
                                        return 'arn:aws:iam::123456789012:role/my-role';
                                    case 'aws.s3.bucket':
                                        return 'my-bucket';
                                    case 'aws.s3.linkExpire':
                                        return 900;
                                    case 'app.env':
                                        return 'local';
                                    case 'aws.localProfileName':
                                        return 'default';
                                    default:
                                        return null;
                                }
                            }),
                        },
                    },
                ],
            }).compile();

            service = module.get<AwsS3Service>(AwsS3Service);
        });

        it('should get temporary credentials using fromIni', async () => {
            const mockCredentials = {
                accessKeyId: 'LOCAL_ACCESS_KEY_ID',
                secretAccessKey: 'LOCAL_SECRET_ACCESS_KEY',
                sessionToken: 'LOCAL_SESSION_TOKEN',
            };
            (fromIni as jest.Mock).mockReturnValue(() =>
                Promise.resolve(mockCredentials)
            );

            const credentials = await service.getTemporaryCredentials();

            expect(credentials).toEqual(mockCredentials);
            expect(fromIni).toHaveBeenCalledWith({ profile: 'default' });
        });

        it('should create an S3 client with fromIni credentials', async () => {
            const mockCredentialsProvider = jest.fn();
            (fromIni as jest.Mock).mockReturnValue(mockCredentialsProvider);

            const s3Client = await service.getS3Client();

            expect(S3Client).toHaveBeenCalledWith({
                region: 'us-east-1',
                credentials: mockCredentialsProvider,
            });
        });

        it('should generate a presigned URL for put operation', async () => {
            const mockS3Client = {};
            jest.spyOn(service, 'getS3Client').mockResolvedValue(
                mockS3Client as S3Client
            );
            (getSignedUrl as jest.Mock).mockResolvedValue(
                'https://presigned.url'
            );

            const result = await service.getPresignedUrlForPut('test-key');

            expect(result).toEqual({
                url: 'https://presigned.url',
                expirey: 900,
            });
            expect(getSignedUrl).toHaveBeenCalledWith(
                mockS3Client,
                expect.any(PutObjectCommand),
                { expiresIn: 900 }
            );
        });
    });

    describe('Non-Local Environment', () => {
        beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
                providers: [
                    AwsS3Service,
                    {
                        provide: ConfigService,
                        useValue: {
                            get: jest.fn((key: string) => {
                                switch (key) {
                                    case 'aws.region':
                                        return 'us-east-1';
                                    case 'aws.roleArn':
                                        return 'arn:aws:iam::123456789012:role/my-role';
                                    case 'aws.s3.bucket':
                                        return 'my-bucket';
                                    case 'aws.s3.linkExpire':
                                        return 900;
                                    case 'app.env':
                                        return 'production';
                                    default:
                                        return null;
                                }
                            }),
                        },
                    },
                ],
            }).compile();

            service = module.get<AwsS3Service>(AwsS3Service);
        });

        it('should get temporary credentials using STS', async () => {
            const mockResponse = {
                Credentials: {
                    AccessKeyId: 'STS_ACCESS_KEY_ID',
                    SecretAccessKey: 'STS_SECRET_ACCESS_KEY',
                    SessionToken: 'STS_SESSION_TOKEN',
                },
            } as unknown as AssumeRoleCommandOutput;
            jest.spyOn(STSClient.prototype, 'send').mockImplementation(
                async () => mockResponse as AssumeRoleCommandOutput
            );

            const credentials = await service.getTemporaryCredentials();

            expect(credentials).toEqual({
                accessKeyId: 'STS_ACCESS_KEY_ID',
                secretAccessKey: 'STS_SECRET_ACCESS_KEY',
                sessionToken: 'STS_SESSION_TOKEN',
            });
            expect(STSClient).toHaveBeenCalledWith({ region: 'us-east-1' });
            expect(STSClient.prototype.send).toHaveBeenCalledWith(
                expect.any(AssumeRoleCommand)
            );
        });

        it('should create an S3 client with temporary credentials', async () => {
            const mockCredentials = {
                accessKeyId: 'STS_ACCESS_KEY_ID',
                secretAccessKey: 'STS_SECRET_ACCESS_KEY',
                sessionToken: 'STS_SESSION_TOKEN',
            };
            jest.spyOn(service, 'getTemporaryCredentials').mockResolvedValue(
                mockCredentials
            );

            const s3Client = await service.getS3Client();

            expect(S3Client).toHaveBeenCalledWith({
                region: 'us-east-1',
                credentials: mockCredentials,
            });
        });

        it('should generate a presigned URL for put operation', async () => {
            const mockS3Client = {};
            jest.spyOn(service, 'getS3Client').mockResolvedValue(
                mockS3Client as S3Client
            );
            (getSignedUrl as jest.Mock).mockResolvedValue(
                'https://presigned.url'
            );

            const result = await service.getPresignedUrlForPut('test-key');

            expect(result).toEqual({
                url: 'https://presigned.url',
                expirey: 900,
            });
            expect(getSignedUrl).toHaveBeenCalledWith(
                mockS3Client,
                expect.any(PutObjectCommand),
                { expiresIn: 900 }
            );
        });
    });

    describe('Error Handling', () => {
        it('should throw an error if getSignedUrl fails', async () => {
            const mockS3Client = {};
            jest.spyOn(service, 'getS3Client').mockResolvedValue(
                mockS3Client as S3Client
            );
            const mockError = new Error('getSignedUrl error');
            (getSignedUrl as jest.Mock).mockRejectedValue(mockError);

            await expect(
                service.getPresignedUrlForPut('test-key')
            ).rejects.toThrow('getSignedUrl error');
        });

        it('should throw an error if STS client fails', async () => {
            const mockError = new Error('STS error');
            jest.spyOn(STSClient.prototype, 'send').mockImplementation(() =>
                Promise.reject(mockError)
            );

            await expect(service.getTemporaryCredentials()).rejects.toThrow(
                'STS error'
            );
        });
    });
});
