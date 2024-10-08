import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            'ROLES_KEY',
            [context.getHandler(), context.getClass()]
        );
        if (!requiredRoles) {
            return true;
        }

        const ctx = GqlExecutionContext.create(context);
        const user = ctx.getContext().req.user;

        if (!user || !user.role) {
            throw new ForbiddenException('auth.errors.unauthorized');
        }

        const hasRole = requiredRoles.some(
            role =>
                user.role === role ||
                (Array.isArray(user.role) && user.role.includes(role))
        );

        if (!hasRole) {
            throw new ForbiddenException('auth.errors.forbidden');
        }

        return true;
    }
}
