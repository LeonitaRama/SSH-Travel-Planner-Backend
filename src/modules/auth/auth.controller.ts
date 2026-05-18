// // src/modules/auth/auth.controller.ts
// import {
//   Controller,
//   Post,
//   Body,
//   Get,
//   UseGuards,
//   Req,
//   Headers,
//   BadRequestException,
//   HttpCode,
//   HttpStatus,
// } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { AuthService } from './auth.service.js';
// import { RegisterDto } from './dto/register.dto.js';
// import { LoginDto } from './dto/login.dto.js';
// import { Roles } from '../../common/decorators/roles.decorator.js';
// import { Role } from '../../common/enums/role.enum.js';
// import { Public } from '../../common/decorators/public.decorator.js';
// import {
//   ApiTags,
//   ApiHeader,
//   ApiBearerAuth,
//   ApiOperation,
//   ApiResponse,
//   ApiBody,
//   ApiSecurity,
// } from '@nestjs/swagger';

// @ApiSecurity('tenant-id')
// @ApiTags('Auth')
// @Controller('auth')
// export class AuthController {
//   constructor(private authService: AuthService) {}

//   // ============================================
//   // POST /auth/register - Regjistrim i ri
//   // Public endpoint - nuk kërkon autentikim
//   // ============================================
//   @Public()
//   @Post('register')
//   @ApiOperation({
//     summary: 'Register a new user',
//     description: 'Regjistron një përdorues të ri në një tenant specifik',
//   })
//   // @ApiHeader({
//   //   name: 'x-tenant-id',
//   //   required: true,
//   //   description: 'Tenant ID (UUID format) - must match tenantId in body',
//   // })
//   @ApiBody({ type: RegisterDto })
//   @ApiResponse({
//     status: 201,
//     description: 'User registered successfully',
//     schema: {
//       example: {
//         message: 'User registered successfully',
//         user: {
//           id: '123e4567-e89b-12d3-a456-426614174000',
//           email: 'user@example.com',
//           username: 'john_doe',
//           role: 'CUSTOMER',
//         },
//         access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
//         refresh_token: '8ae576951be0a1baaf70704487cb934e...',
//       },
//     },
//   })
//   @ApiResponse({
//     status: 400,
//     description: 'Bad Request - Invalid tenant ID or missing header',
//     schema: {
//       example: {
//         message: 'Tenant ID header (x-tenant-id) is required',
//         error: 'Bad Request',
//         statusCode: 400,
//       },
//     },
//   })
//   @ApiResponse({
//     status: 404,
//     description: 'Tenant not found',
//     schema: {
//       example: {
//         message: 'Tenant not found',
//         error: 'Not Found',
//         statusCode: 404,
//       },
//     },
//   })
//   @ApiResponse({
//     status: 409,
//     description: 'User already exists in this tenant',
//     schema: {
//       example: {
//         message: 'User already exists in this tenant',
//         error: 'Conflict',
//         statusCode: 409,
//       },
//     },
//   })
//   @HttpCode(HttpStatus.CREATED)
//   async register(
//     @Headers('x-tenant-id') tenantId: string,
//     @Body() dto: RegisterDto,
//   ) {
//     if (!tenantId) {
//       throw new BadRequestException('x-tenant-id header is required');
//     }

//     if (tenantId !== dto.tenantId) {
//       throw new BadRequestException(
//         'Tenant ID mismatch between header and body',
//       );
//     }

//     return this.authService.register(dto);
//   }

//   // ============================================
//   // POST /auth/login - Hyrje në sistem
//   // Public endpoint - nuk kërkon autentikim
//   // ============================================
//   @Public()
//   @Post('login')
//   @ApiOperation({
//     summary: 'Login user',
//     description: 'Autentikon përdoruesin dhe kthen access token',
//   })
//   // @ApiHeader({
//   //   name: 'x-tenant-id',
//   //   required: true,
//   //   description: 'Tenant ID (UUID format)',
//   // })
//   @ApiBody({ type: LoginDto })
//   @ApiResponse({
//     status: 200,
//     description: 'Login successful',
//     schema: {
//       example: {
//         access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
//         refresh_token: '75380d8f2389302eb91ff4c749630faf...',
//         user: {
//           id: '123e4567-e89b-12d3-a456-426614174000',
//           email: 'user@example.com',
//           username: 'john_doe',
//           role: 'CUSTOMER',
//         },
//       },
//     },
//   })
//   @ApiResponse({
//     status: 401,
//     description: 'Invalid credentials',
//     schema: {
//       example: {
//         message: 'Invalid credentials',
//         error: 'Unauthorized',
//         statusCode: 401,
//       },
//     },
//   })
//   @ApiResponse({
//     status: 404,
//     description: 'Tenant not found',
//     schema: {
//       example: {
//         message: 'Tenant not found',
//         error: 'Not Found',
//         statusCode: 404,
//       },
//     },
//   })
//   @HttpCode(HttpStatus.OK)
//   async login(@Headers('x-tenant-id') tenantId: string, @Body() dto: LoginDto) {
//     if (!tenantId) {
//       throw new BadRequestException('x-tenant-id header is required');
//     }
//     return this.authService.login(tenantId, dto);
//   }

//   // ============================================
//   // GET /auth/profile - Profili im
//   // Vetëm user-at e autentikuar
//   // ============================================
//   @Get('profile')
//   @UseGuards(AuthGuard('jwt'))
//   @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
//   @ApiBearerAuth('JWT-auth')
//   @ApiOperation({
//     summary: 'Get user profile',
//     description: 'Merr profilin e përdoruesit të autentikuar',
//   })
//   // @ApiHeader({
//   //   name: 'x-tenant-id',
//   //   required: true,
//   //   description: 'Tenant ID (UUID format)',
//   // })
//   @ApiResponse({
//     status: 200,
//     description: 'Profile retrieved successfully',
//     schema: {
//       example: {
//         id: '123e4567-e89b-12d3-a456-426614174000',
//         email: 'user@example.com',
//         username: 'john_doe',
//         role: 'CUSTOMER',
//         tenantId: '0b3f8cb4-6007-4925-a339-810579cd3b14',
//         createdAt: '2026-05-13T12:21:06.932Z',
//       },
//     },
//   })
//   @ApiResponse({
//     status: 401,
//     description: 'Unauthorized - Invalid or missing token',
//     schema: {
//       example: {
//         message: 'Invalid or missing token',
//         error: 'Unauthorized',
//         statusCode: 401,
//       },
//     },
//   })
//   @ApiResponse({
//     status: 403,
//     description: 'Forbidden - Insufficient role',
//     schema: {
//       example: {
//         message:
//           'Access denied. Required roles: CUSTOMER, STAFF, ADMIN, SUPER_ADMIN',
//         error: 'Forbidden',
//         statusCode: 403,
//       },
//     },
//   })
//   async profile(@Req() req: any) {
//     return this.authService.getProfile(req.user.sub);
//   }

//   // ============================================
//   // POST /auth/logout - Dalje nga sistemi
//   // Vetëm user-at e autentikuar
//   // ============================================
//   @Post('logout')
//   @UseGuards(AuthGuard('jwt'))
//   @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
//   @ApiBearerAuth('JWT-auth')
//   @ApiOperation({
//     summary: 'Logout user',
//     description: 'Fshin refresh token-in e përdoruesit dhe kryen logout',
//   })
//   // @ApiHeader({
//   //   name: 'x-tenant-id',
//   //   required: true,
//   //   description: 'Tenant ID (UUID format)',
//   // })
//   @ApiResponse({
//     status: 200,
//     description: 'Logged out successfully',
//     schema: {
//       example: {
//         message: 'Logged out successfully',
//       },
//     },
//   })
//   @ApiResponse({
//     status: 401,
//     description: 'Unauthorized - Invalid or missing token',
//   })
//   @HttpCode(HttpStatus.OK)
//   async logout(@Req() req: any) {
//     return this.authService.logout(req.user.sub);
//   }

//   // ============================================
//   // POST /auth/refresh-token - Rifresko token-in
//   // Public endpoint - merr refresh token
//   // ============================================
//   @Public()
//   @Post('refresh-token')
//   @ApiOperation({
//     summary: 'Refresh access token',
//     description:
//       'Gjeneron një access token të ri duke përdorur refresh token-in',
//   })
//   @ApiBody({
//     schema: {
//       type: 'object',
//       properties: {
//         refreshToken: {
//           type: 'string',
//           description: 'Refresh token i marrë gjatë login ose register',
//           example: '75380d8f2389302eb91ff4c749630faf...',
//         },
//       },
//       required: ['refreshToken'],
//     },
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Token refreshed successfully',
//     schema: {
//       example: {
//         access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
//       },
//     },
//   })
//   @ApiResponse({
//     status: 400,
//     description: 'Bad Request - Refresh token is required',
//     schema: {
//       example: {
//         message: 'Refresh token is required',
//         error: 'Bad Request',
//         statusCode: 400,
//       },
//     },
//   })
//   @ApiResponse({
//     status: 401,
//     description: 'Unauthorized - Invalid or expired refresh token',
//     schema: {
//       example: {
//         message: 'Invalid refresh token',
//         error: 'Unauthorized',
//         statusCode: 401,
//       },
//     },
//   })
//   @HttpCode(HttpStatus.OK)
//   async refreshToken(@Body('refreshToken') refreshToken: string) {
//     if (!refreshToken) {
//       throw new BadRequestException('Refresh token is required');
//     }
//     return this.authService.refreshToken(refreshToken);
//   }
// }

// src/modules/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Headers,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/enums/role.enum.js';
import { Public } from '../../common/decorators/public.decorator.js';
import {
  ApiTags,
  ApiSecurity, // Shto këtë import
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ============================================
  // POST /auth/register - Regjistrim i ri
  // ============================================
  @Public()
  @Post('register')
  @ApiSecurity('tenant-id') // <--- Lidhet me butonin global Authorize për tenant-id
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Regjistron një përdorues të ri në një tenant specifik',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid tenant ID or missing header',
  })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  @ApiResponse({
    status: 409,
    description: 'User already exists in this tenant',
  })
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: RegisterDto,
  ) {
    if (!tenantId) {
      throw new BadRequestException('x-tenant-id header is required');
    }

    if (tenantId !== dto.tenantId) {
      throw new BadRequestException(
        'Tenant ID mismatch between header and body',
      );
    }

    return this.authService.register(dto);
  }

  // ============================================
  // POST /auth/login - Hyrje në sistem
  // ============================================
  @Public()
  @Post('login')
  @ApiSecurity('tenant-id') // <--- Lidhet me butonin global Authorize për tenant-id
  @ApiOperation({
    summary: 'Login user',
    description: 'Autentikon përdoruesin dhe kthen access token',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  @HttpCode(HttpStatus.OK)
  async login(@Headers('x-tenant-id') tenantId: string, @Body() dto: LoginDto) {
    if (!tenantId) {
      throw new BadRequestException('x-tenant-id header is required');
    }
    return this.authService.login(tenantId, dto);
  }

  // ============================================
  // GET /auth/profile - Profili im
  // ============================================
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth') // Merr tokenin nga Authorize global
  @ApiSecurity('tenant-id') // Merr tenant-id nga Authorize global
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Merr profilin e përdoruesit të autentikuar',
  })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient role' })
  async profile(@Req() req: any) {
    return this.authService.getProfile(req.user.sub);
  }

  // ============================================
  // POST /auth/logout - Dalje nga sistemi
  // ============================================
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('tenant-id')
  @ApiOperation({
    summary: 'Logout user',
    description: 'Fshin refresh token-in e përdoruesit dhe kryen logout',
  })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: any) {
    return this.authService.logout(req.user.sub);
  }

  // ============================================
  // POST /auth/refresh-token - Rifresko token-in
  // ============================================
  @Public()
  @Post('refresh-token')
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Gjeneron një access token të ri duke përdorur refresh token-in',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          description: 'Refresh token i marrë gjatë login ose register',
          example: '75380d8f2389302eb91ff4c749630faf...',
        },
      },
      required: ['refreshToken'],
    },
  })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Refresh token is required',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired refresh token',
  })
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }
    return this.authService.refreshToken(refreshToken);
  }
}
