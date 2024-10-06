import { IAuthUser } from 'src/common/auth/interfaces/auth.interface';

export interface IHelperEncryptionService {
    createHash(password: string): Promise<string>;
    match(hash: string, password: string): Promise<boolean>;
    createAccessToken(payload: IAuthUser): Promise<string>;
}
