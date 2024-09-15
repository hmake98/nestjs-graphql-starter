import { registerAs } from '@nestjs/config';

export default registerAs(
    'aws',
    (): Record<string, any> => ({
        region: process.env.AWS_REGION,
        roleArn: process.env.AWS_ROLE_ARN,
        localProfileName: process.env.AWS_LOCAL_PROFILE_NAME,
        s3: {
            bucket: process.env.AWS_S3_BUCKET,
            linkExpire:
                parseInt(process.env.AWS_S3_PRESIGN_LINK_EXPIRES, 10) || 3600,
        },
    })
);
