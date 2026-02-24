import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, Role } from '@digital-dhuriya/database';
import * as bcrypt from 'bcrypt';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private sanitizeUser(user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    isActive: boolean;
    commissionPercent: Prisma.Decimal | null;
  }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      commissionPercent: Number(user.commissionPercent ?? 0),
    };
  }

  private async signToken(user: { id: string; email: string; role: Role }) {
    return this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.signToken(user);

    return {
      accessToken,
      user: this.sanitizeUser(user),
    };
  }

  async register(dto: RegisterDto, requester: AuthenticatedUser | null) {
    const existingCount = await this.prisma.user.count();
    const canSelfBootstrap = existingCount === 0;

    if (!canSelfBootstrap && requester?.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException('Only super admin can create users');
    }

    const emailTaken = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (emailTaken) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash: hashedPassword,
        role: dto.role ?? Role.FREELANCER,
        commissionPercent: dto.commissionPercent ?? null,
      },
    });

    return this.sanitizeUser(user);
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found');
    }

    return this.sanitizeUser(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const matches = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedException('Current password is invalid');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { message: 'Password updated successfully' };
  }

  verifyToken(token: string): AuthenticatedUser | null {
    try {
      const payload = this.jwtService.verify<{ sub: string; email: string; role: Role }>(token);
      return {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
      };
    } catch {
      return null;
    }
  }
}

