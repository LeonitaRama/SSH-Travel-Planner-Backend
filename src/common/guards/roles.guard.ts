// src/common/guards/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator.js';
import { Role } from '../enums/role.enum.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('You are not authenticated');
    }

    // Hierarkia e roleve: CUSTOMER < STAFF < ADMIN < SUPER_ADMIN
    const roleHierarchy = {
      [Role.CUSTOMER]: 1,
      [Role.STAFF]: 2,
      [Role.ADMIN]: 3,
      [Role.SUPER_ADMIN]: 4,
    };

    const userRoleLevel = roleHierarchy[user.role as Role] || 0;

    // Verifiko nëse user-i ka të paktën një nga rolet e kërkuara
    const hasRole = requiredRoles.some((role) => {
      const requiredLevel = roleHierarchy[role];
      return userRoleLevel >= requiredLevel;
    });

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
