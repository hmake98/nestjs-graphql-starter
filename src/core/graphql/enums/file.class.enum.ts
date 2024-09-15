import { registerEnumType } from '@nestjs/graphql';

export enum FileClass {
    USER_PROFILE = 'user-profiles',
}

registerEnumType(FileClass, {
    name: 'FileClass',
    description: 'File class to be stored in S3 bucket.',
});
