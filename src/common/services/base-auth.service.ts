// src/common/services/base-auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { BaseTenantService } from "./base-tenant.service.js";
import { PrismaService } from "../../modules/prisma/prisma.service.js";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

@Injectable()
export abstract class BaseAuthService extends BaseTenantService {
  constructor(
    protected prismaService: PrismaService,
    protected jwtService: JwtService,
  ) {
    super(prismaService);
  }

  async validateUser(tenantId: string, email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { email, tenantId },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return user;
  }

  generateToken(user: any) {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    });
  }

  async getUserFromToken(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        tenantId: true,
        username: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return user;
  }
}
