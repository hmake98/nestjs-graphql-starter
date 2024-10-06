import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';
import { IAuthUser } from 'src/common/auth/interfaces/auth.interface';
import { HelperEncryptionService } from 'src/common/helper/services/helper.encryption.service';

jest.mock('argon2');

describe('EncryptionService', () => {
    let service: HelperEncryptionService;
    let jwtService: JwtService;

    const mockConfigService = {
        get: jest.fn(),
    };

    const mockJwtService = {
        signAsync: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HelperEncryptionService,
                { provide: ConfigService, useValue: mockConfigService },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        service = module.get<HelperEncryptionService>(HelperEncryptionService);
        jwtService = module.get<JwtService>(JwtService);

        mockConfigService.get.mockImplementation((key: string) => {
            if (key === 'auth.accessToken.secret') return 'testSecret';
            if (key === 'auth.accessToken.tokenExp') return '1h';
            return null;
        });
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createHash', () => {
        it('should create a hash from a password', async () => {
            const password = 'testPassword';
            const hashedPassword = 'hashedPassword';
            (argon2.hash as jest.Mock).mockResolvedValue(hashedPassword);

            const result = await service.createHash(password);

            expect(result).toBe(hashedPassword);
            expect(argon2.hash).toHaveBeenCalledWith(password);
        });
    });

    describe('match', () => {
        it('should return true for matching password and hash', async () => {
            const password = 'testPassword';
            const hash = 'hashedPassword';
            (argon2.verify as jest.Mock).mockResolvedValue(true);

            const result = await service.match(hash, password);

            expect(result).toBe(true);
            expect(argon2.verify).toHaveBeenCalledWith(hash, password);
        });

        it('should return false for non-matching password and hash', async () => {
            const password = 'wrongPassword';
            const hash = 'hashedPassword';
            (argon2.verify as jest.Mock).mockResolvedValue(false);

            const result = await service.match(hash, password);

            expect(result).toBe(false);
            expect(argon2.verify).toHaveBeenCalledWith(hash, password);
        });
    });

    describe('createAccessToken', () => {
        it('should create an access token', async () => {
            const payload: IAuthUser = { userId: '123', role: 'USER' };
            const token = 'generatedToken';
            mockJwtService.signAsync.mockResolvedValue(token);

            const result = await service.createAccessToken(payload);

            expect(result).toBe(token);
            expect(jwtService.signAsync).toHaveBeenCalledWith(payload, {
                secret: 'testSecret',
                expiresIn: '1h',
            });
        });
    });
});
