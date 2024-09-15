import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { IAuthUser } from 'src/common/auth/interfaces/auth.interface';

import { IEncryptionService } from '../interfaces/enceryption.service.interface';

@Injectable()
export class EncryptionService implements IEncryptionService {
    private readonly accessTokenSecret: string;
    private readonly accessTokenExpire: string;
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) {
        this.accessTokenSecret = this.configService.get<string>(
            'auth.accessToken.secret'
        );
        this.accessTokenExpire = this.configService.get<string>(
            'auth.accessToken.tokenExp'
        );
    }

    createHash(password: string): Promise<string> {
        return argon2.hash(password);
    }

    match(hash: string, password: string): Promise<boolean> {
        return argon2.verify(hash, password);
    }

    createAccessToken(payload: IAuthUser): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret: this.accessTokenSecret,
            expiresIn: this.accessTokenExpire,
        });
    }
}
