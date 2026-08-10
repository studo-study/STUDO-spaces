import * as argon2 from 'argon2';
import { AuthConfig, ServerConfig } from '../config/configuration';
import { User } from '../types/user';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginRequest, RegisterUserRequest } from '@studo/types';
import { profiles, settings, users } from '../drizzle/schema';
import { eq, sql } from 'drizzle-orm';
import { rethrowAsConflict } from '../lib/unique-violation';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../types/auth';
import { Role } from './roles';
import { ImpersonateDto } from '../session/session.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<ServerConfig>,
  ) {}

  //ww hashen
  async hashPassword(password: string): Promise<string> {
    const authConfig = this.configService.get<AuthConfig>('auth')!;
    // 👇 3
    return argon2.hash(password, {
      type: argon2.argon2id,
      hashLength: authConfig.hashLength,
      timeCost: authConfig.timeCost,
      memoryCost: authConfig.memoryCost,
    });
  }

  //ww verifieren
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, password);
  }

  //token ondertekenen
  private signJwt(user: User): string {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      roles: user.roles,
    });
  }

  //token verifieren
  async verifyJwt(token: string): Promise<JwtPayload> {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

    if (!payload) {
      throw new UnauthorizedException('Invalid authentication token');
    }

    return payload;
  }

  //login functie
  async login({ email, password }: LoginRequest): Promise<string> {
    // Case-insensitive: login moet werken ongeacht de casing van de email.
    const user = await this.db.query.users.findFirst({
      where: sql`lower(${users.email}) = lower(${email})`,
    });

    if (!user) {
      throw new UnauthorizedException(
        'The given email and password do not match',
      );
    }

    const passwordValid = await this.verifyPassword(
      password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new UnauthorizedException(
        'The given email and password do not match',
      );
    }

    await this.db
      .update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, user.id));

    return this.signJwt(user);
  }

  /**
   * Find an existing user by email, or provision a new user + profile for an
   * OAuth/social login. Existing users get their lastLogin bumped. Returns the
   * persisted user row.
   */
  private async findOrCreateOAuthUser(params: {
    email: string;
    displayName: string;
    imgUrl: string;
    tag: string;
    verified: boolean;
  }): Promise<User> {
    // Case-insensitive: voorkom een duplicate account als de provider de email
    // met andere casing teruggeeft dan de bestaande rij.
    const existing = await this.db.query.users.findFirst({
      where: sql`lower(${users.email}) = lower(${params.email})`,
    });

    if (existing) {
      await this.db
        .update(users)
        .set({ lastLogin: new Date() })
        .where(eq(users.id, existing.id));
      return existing;
    }

    const date = new Date();

    const [{ id: uid }] = await this.db
      .insert(users)
      .values({
        email: params.email.toLowerCase(),
        passwordHash: '',
        displayName: params.displayName,
        imgUrl: params.imgUrl,
        joinDate: date,
        totalSets: 0,
        streakStarted: null,
        streakCount: 0,
        streakLastUpdate: null,
        lastLogin: date,
        roles: [Role.USER],
        publicRole: 'student',
        verified: params.verified,
        banned: false,
      })
      .returning({ id: users.id });

    await this.db.insert(settings).values({
      userId: uid,
    });
    await this.db.insert(profiles).values({
      userId: uid,
      displayName: params.displayName,
      imgUrl: params.imgUrl === 'default' ? '' : params.imgUrl,
      bannerUrl: '',
      joinDate: date,
      streak: 0,
      verified: false,
      tags: [params.tag],
    });

    return (await this.db.query.users.findFirst({
      where: eq(users.id, uid),
    }))!;
  }

  //google users
  async validateGoogleUser(googleUser: {
    email: string;
    firstName: string;
    lastName: string;
    picture?: string;
  }): Promise<string> {
    const fullName = `${googleUser.firstName} ${googleUser.lastName}`;
    const user = await this.findOrCreateOAuthUser({
      email: googleUser.email,
      displayName: fullName,
      imgUrl: googleUser.picture ?? '',
      tag: fullName,
      verified: false,
    });
    return this.signJwt(user);
  }

  //microsoft users
  async validateMicrosoftUser(microsoftUser: {
    email: string;
    firstName: string;
    lastName: string;
    displayName: string;
    picture?: string;
  }): Promise<string> {
    const user = await this.findOrCreateOAuthUser({
      email: microsoftUser.email,
      displayName: `${microsoftUser.firstName} ${microsoftUser.lastName}`,
      imgUrl: microsoftUser.picture || 'default',
      tag: microsoftUser.displayName,
      verified: true, // Microsoft users zijn al geverifieerd
    });
    return this.signJwt(user);
  }

  //smartschool users
  async validateSmartschoolUser(smartschoolUser: {
    email: string;
    firstName: string;
    lastName: string;
    displayName: string;
    picture?: string;
  }): Promise<string> {
    const user = await this.findOrCreateOAuthUser({
      email: smartschoolUser.email,
      displayName: `${smartschoolUser.firstName} ${smartschoolUser.lastName}`,
      imgUrl: smartschoolUser.picture || 'default',
      tag: smartschoolUser.displayName,
      verified: true,
    });
    return this.signJwt(user);
  }

  //registreer functie
  async register({
    displayName,
    email,
    password,
    role,
  }: RegisterUserRequest): Promise<string> {
    const date = new Date();
    const passwordHash = await this.hashPassword(password);

    // Case-insensitive: A@x.com en a@x.com zijn dezelfde account.
    const existingUser = await this.db.query.users.findFirst({
      where: sql`lower(${users.email}) = lower(${email})`,
    });

    if (existingUser) {
      throw new ConflictException({
        code: 'EMAIL_TAKEN',
        message: 'There is already a user with this email address',
      });
    }

    const displayNameClash = await this.db.query.users.findFirst({
      where: sql`lower(${users.displayName}) = lower(${displayName})`,
    });

    if (displayNameClash) {
      throw new ConflictException({
        code: 'DISPLAY_NAME_TAKEN',
        message: 'There is already a user with this display name',
      });
    }

    // User. De insert kan alsnog 23505 gooien als een gelijktijdige registratie
    // net langs de pre-check glipte; map dat naar een nette 409.
    const [{ id: uid }] = await this.db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        passwordHash: passwordHash,
        displayName: displayName,
        imgUrl: 'default',
        joinDate: date,
        totalSets: 0,
        streakStarted: date,
        streakCount: 0,
        streakLastUpdate: date,
        lastLogin: date,
        roles: [Role.USER],
        publicRole: role,
        verified: false,
        banned: false,
      })
      .returning({ id: users.id })
      .catch(rethrowAsConflict);

    // Settings
    await this.db.insert(settings).values({
      userId: uid,
    });

    // Profile
    await this.db.insert(profiles).values({
      userId: uid,
      displayName: displayName,
      imgUrl: '',
      bannerUrl: '',
      joinDate: date,
      streak: 0,
      verified: false,
      tags: [displayName],
    });

    // Fetch the created user
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, uid),
    });

    // Return JWT
    return this.signJwt(user!);
  }

  async validateSocialUser(socialUser: {
    email: string;
    displayName: string;
    provider: string;
    providerId?: string;
    imgUrl?: string;
  }): Promise<{ token: string; user: any }> {
    let user = await this.db.query.users.findFirst({
      where: eq(users.email, socialUser.email),
    });

    if (!user) {
      const date = new Date();

      const [{ id: uid }] = await this.db
        .insert(users)
        .values({
          email: socialUser.email,
          passwordHash: '',
          displayName: socialUser.displayName,
          imgUrl: socialUser.imgUrl || 'default',
          joinDate: date,
          totalSets: 0,
          streakStarted: null,
          streakCount: 0,
          streakLastUpdate: null,
          lastLogin: date,
          roles: [Role.USER],
          publicRole: 'student',
          verified: false,
          banned: false,
        })
        .returning({ id: users.id });

      await this.db.insert(profiles).values({
        userId: uid,
        displayName: socialUser.displayName,
        imgUrl: socialUser.imgUrl || '',
        bannerUrl: '',
        joinDate: date,
        streak: 0,
        verified: false,
        tags: [socialUser.displayName],
      });

      user = await this.db.query.users.findFirst({
        where: eq(users.id, uid),
      });
    } else {
      await this.db
        .update(users)
        .set({
          lastLogin: new Date(),
          imgUrl: socialUser.imgUrl || user.imgUrl, // update foto
        })
        .where(eq(users.id, user.id));
      user = await this.db.query.users.findFirst({
        where: eq(users.id, user.id),
      });
    }
    const token = this.signJwt(user!);
    return { token, user: user! };
  }

  /**
   * Mint een kortlevende impersonatie-token voor `body.userId`, aangevraagd
   * door admin `actorId`. De token draagt de rollen van de DOEL-user (geen
   * privilege-escalatie), een `act`-claim (RFC 8693) voor audit, en een
   * `impersonated`-flag zodat gevoelige endpoints kunnen weigeren.
   */
  async impersonate(body: ImpersonateDto, actorId: string): Promise<string> {
    const target = await this.db.query.users.findFirst({
      where: eq(users.id, body.userId),
    });

    if (!target) {
      throw new NotFoundException('User to impersonate not found');
    }

    const targetRoles = (target.roles as string[]) ?? [];
    // een admin mag geen andere admin impersonaten
    if (targetRoles.includes(Role.ADMIN)) {
      throw new ForbiddenException('Cannot impersonate an admin');
    }

    const token = this.jwtService.sign(
      {
        sub: target.id,
        email: target.email,
        roles: targetRoles,
        act: { sub: actorId }, // RFC 8693 actor-claim
        impersonated: true,
      },
      { expiresIn: '30m' },
    );

    this.logger.warn(
      `IMPERSONATION start: admin=${actorId} target=${target.id}`,
    );

    return token;
  }
}
