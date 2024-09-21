import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginInput } from 'src/common/auth/dtos/login.input';
import { SignupInput } from 'src/common/auth/dtos/signup.input';
import { AuthService } from 'src/common/auth/services/auth.service';
import { EncryptionService } from 'src/common/helper/services/encryption.service';
import { PrismaService } from 'src/database/services/prisma.service';

describe('AuthService', () => {
    let authService: AuthService;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    };

    const mockEncryptionService = {
        match: jest.fn(),
        createHash: jest.fn(),
        createAccessToken: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: EncryptionService, useValue: mockEncryptionService },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('login', () => {
        const loginInput: LoginInput = {
            email: 'test@example.com',
            password: 'password123',
        };

        it('should throw NotFoundException if user is not found', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(authService.login(loginInput)).rejects.toThrow(
                new NotFoundException('user.errors.notFound')
            );
        });

        it('should throw BadRequestException if password is incorrect', async () => {
            const mockUser = {
                id: '123',
                password: 'hashedPassword',
                role: 'USER',
            };
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            mockEncryptionService.match.mockResolvedValue(false);

            await expect(authService.login(loginInput)).rejects.toThrow(
                new BadRequestException('auth.errors.invalidPassword')
            );
        });

        it('should return AuthResponse if login is successful', async () => {
            const mockUser = {
                id: '123',
                email: 'test@example.com',
                password: 'hashedPassword',
                role: 'USER',
            };
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            mockEncryptionService.match.mockResolvedValue(true);
            mockEncryptionService.createAccessToken.mockResolvedValue(
                'accessToken'
            );

            const result = await authService.login(loginInput);

            expect(result).toEqual({
                accessToken: 'accessToken',
                user: mockUser,
            });
        });
    });

    describe('signup', () => {
        const signupInput: SignupInput = {
            email: 'test@example.com',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe',
        };

        it('should throw NotFoundException if user already exists', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue({ id: '123' });

            await expect(authService.signup(signupInput)).rejects.toThrow(
                new NotFoundException('user.errors.alreadyExists')
            );
        });

        it('should create a new user and return AuthResponse', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);
            mockEncryptionService.createHash.mockResolvedValue(
                'hashedPassword'
            );
            mockPrismaService.user.create.mockResolvedValue({
                id: '123',
                email: 'test@example.com',
                role: 'USER',
                firstName: 'John',
                lastName: 'Doe',
            });
            mockEncryptionService.createAccessToken.mockResolvedValue(
                'accessToken'
            );

            const result = await authService.signup(signupInput);

            expect(result).toEqual({
                accessToken: 'accessToken',
                user: {
                    id: '123',
                    email: 'test@example.com',
                    role: 'USER',
                    firstName: 'John',
                    lastName: 'Doe',
                },
            });

            expect(mockPrismaService.user.create).toHaveBeenCalledWith({
                data: {
                    email: 'test@example.com',
                    password: 'hashedPassword',
                    role: 'USER',
                    firstName: 'John',
                    lastName: 'Doe',
                },
            });
        });
    });
});
