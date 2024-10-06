import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    getRequest(context: ExecutionContext): Request {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            'PUBLIC_ROUTE_KEY',
            [context.getHandler(), context.getClass()]
        );
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }

    handleRequest(
        err: any,
        user: any,
        _info: any,
        context: ExecutionContext,
        _status?: any
    ) {
        const request = this.getRequest(context);
        const authorization = request.headers['authorization'];
        const token = authorization?.replace('Bearer ', '');

        if (!token) {
            throw new UnauthorizedException('auth.errors.missingAccessToken');
        }

        if (err || !user) {
            throw new UnauthorizedException('auth.errors.invalidAccessToken');
        }

        return user;
    }
}
