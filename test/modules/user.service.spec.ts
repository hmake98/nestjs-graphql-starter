import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/database/services/prisma.service';
import { UserResponse } from 'src/modules/user/dtos/user.response';
import { UserService } from 'src/modules/user/services/user.service';

describe('UserService', () => {
    let service: UserService;
    let prismaService: PrismaService;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getProfile', () => {
        it('should return a user profile if user is found', async () => {
            const mockUser = {
                id: 'user-id-123',
                email: 'test@example.com',
                firstName: 'John',
                lastName: 'Doe',
                role: 'ADMIN',
            } as UserResponse;
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

            const result = await service.getProfile('user-id-123');

            expect(result).toEqual(mockUser);
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { id: 'user-id-123' },
            });
        });

        it('should return null if user is not found', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            const result = await service.getProfile('user-id-123');

            expect(result).toBeNull();
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { id: 'user-id-123' },
            });
        });
    });
});
