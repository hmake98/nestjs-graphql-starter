import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/database/services/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly prismaService: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('auth.accessToken.secret'),
        });
    }

    async validate(payload: Record<string, string | number>) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: String(payload.userId),
            },
        });
        if (!user) {
            throw new UnauthorizedException('auth.errors.invalidAccessToken');
        }
        return payload;
    }
}
