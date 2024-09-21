import { registerEnumType } from '@nestjs/graphql';
import { Role } from '@prisma/client';

export enum FileStorageClass {
    USER_PROFILE,
}

registerEnumType(FileStorageClass, {
    name: 'FileStorageClass',
    description: 'File class stored in S3 bucket.',
});

registerEnumType(Role, {
    name: 'Role',
    description: 'File class stored in S3 bucket.',
});
