import * as argon2 from 'argon2';
import { AuthConfig, ServerConfig } from '../config/configuration';
import { User } from '../types/user';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginRequest, RegisterUserRequest } from '@studo/types';
import { profiles, users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../types/auth';
import { Role } from './roles';

@Injectable()
export class AuthService {
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
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
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

  //google users
  async validateGoogleUser(googleUser: {
    email: string;
    firstName: string;
    lastName: string;
    picture?: string;
  }): Promise<string> {
    // Check of user bestaat op basis van email
    let user = await this.db.query.users.findFirst({
      where: eq(users.email, googleUser.email),
    });

    if (!user) {
      // Maak nieuwe user aan voor Google OAuth
      const date = new Date();
      const uid = uuidv4();

      const newUser = {
        id: uid,
        email: googleUser.email,
        passwordHash: '',
        displayName: `${googleUser.firstName} ${googleUser.lastName}`,
        imgUrl: googleUser.picture ?? '',
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
      };

      // Profile
      const newProfile = {
        userId: uid,
        displayName: `${googleUser.firstName} ${googleUser.lastName}`,
        imgUrl: googleUser.picture ?? '',
        bannerUrl: '',
        joinDate: date,
        streak: 0,
        verified: false,
        studoProfile: false,
        tags: [`${googleUser.firstName} ${googleUser.lastName}`],
      };

      // Insert all records
      await this.db.insert(users).values(newUser);
      await this.db.insert(profiles).values(newProfile);

      // Fetch de nieuwe user
      user = await this.db.query.users.findFirst({
        where: eq(users.id, uid),
      });
    } else {
      // Update last_login voor bestaande user
      await this.db
        .update(users)
        .set({ lastLogin: new Date() })
        .where(eq(users.id, user.id));
    }

    // Genereer en return JWT token
    return this.signJwt(user!);
  }

  //microsoft users
  async validateMicrosoftUser(microsoftUser: {
    email: string;
    firstName: string;
    lastName: string;
    displayName: string;
    picture?: string;
  }): Promise<string> {
    // Check of user bestaat op basis van email
    let user = await this.db.query.users.findFirst({
      where: eq(users.email, microsoftUser.email),
    });

    if (!user) {
      // Maak nieuwe user aan voor Microsoft OAuth
      const date = new Date();
      const uid = uuidv4();

      const newUser = {
        id: uid,
        email: microsoftUser.email,
        passwordHash: '',
        displayName: `${microsoftUser.firstName} ${microsoftUser.lastName}`,
        imgUrl: microsoftUser.picture || 'default',
        joinDate: date,
        totalSets: 0,
        streakStarted: null,
        streakCount: 0,
        streakLastUpdate: null,
        lastLogin: date,
        roles: [Role.USER],
        publicRole: 'student',
        verified: true, // Microsoft users zijn al geverifieerd
        banned: false,
      };

      // Profile
      const newProfile = {
        userId: uid,
        displayName: `${microsoftUser.firstName} ${microsoftUser.lastName}`,
        imgUrl: microsoftUser.picture || '',
        bannerUrl: '',
        joinDate: date,
        streak: 0,
        verified: false,
        studoProfile: false,
        tags: [microsoftUser.displayName],
      };

      // Insert all records
      await this.db.insert(users).values(newUser);
      await this.db.insert(profiles).values(newProfile);

      // Fetch de nieuwe user
      user = await this.db.query.users.findFirst({
        where: eq(users.id, uid),
      });
    } else {
      // Update last_login voor bestaande user
      await this.db
        .update(users)
        .set({ lastLogin: new Date() })
        .where(eq(users.id, user.id));
    }

    // Genereer en return JWT token
    return this.signJwt(user!);
  }

  //smartschool users
  async validateSmartschoolUser(smartschoolUser: {
    email: string;
    firstName: string;
    lastName: string;
    displayName: string;
    picture?: string;
  }): Promise<string> {
    // Check of user bestaat op basis van email
    let user = await this.db.query.users.findFirst({
      where: eq(users.email, smartschoolUser.email),
    });

    if (!user) {
      // Maak nieuwe user aan voor Microsoft OAuth
      const date = new Date();
      const uid = uuidv4();

      const newUser = {
        id: uid,
        email: smartschoolUser.email,
        passwordHash: '',
        displayName: `${smartschoolUser.firstName} ${smartschoolUser.lastName}`,
        imgUrl: smartschoolUser.picture || 'default',
        joinDate: date,
        totalSets: 0,
        streakStarted: null,
        streakCount: 0,
        streakLastUpdate: null,
        lastLogin: date,
        roles: [Role.USER],
        publicRole: 'student',
        verified: true, // Microsoft users zijn al geverifieerd
        banned: false,
      };

      // Profile
      const newProfile = {
        userId: uid,
        displayName: `${smartschoolUser.firstName} ${smartschoolUser.lastName}`,
        imgUrl: smartschoolUser.picture || '',
        bannerUrl: '',
        joinDate: date,
        streak: 0,
        verified: false,
        studoProfile: false,
        tags: [smartschoolUser.displayName],
      };

      // Insert all records
      await this.db.insert(users).values(newUser);
      await this.db.insert(profiles).values(newProfile);

      // Fetch de nieuwe user
      user = await this.db.query.users.findFirst({
        where: eq(users.id, uid),
      });
    } else {
      // Update last_login voor bestaande user
      await this.db
        .update(users)
        .set({ lastLogin: new Date() })
        .where(eq(users.id, user.id));
    }

    // Genereer en return JWT token
    return this.signJwt(user!);
  }
  //registreer functie
  async register({
    displayName,
    email,
    password,
    role,
  }: RegisterUserRequest): Promise<string> {
    const date = new Date();
    const uid = uuidv4(); // ✅ Functie uitvoeren
    const passwordHash = await this.hashPassword(password);

    const existingUser = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      throw new ConflictException(
        'There is already a user with this email address',
      );
    }

    // User
    const newUser = {
      id: uid,
      email: email,
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
    };

    // Profile
    const newProfile = {
      userId: uid,
      displayName: displayName,
      imgUrl: '',
      bannerUrl: '',
      joinDate: date,
      streak: 0,
      verified: false,
      studoProfile: false,
      tags: [displayName],
    };

    // Insert all records
    await this.db.insert(users).values(newUser);
    await this.db.insert(profiles).values(newProfile);

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
      const uid = uuidv4();

      const newUser = {
        id: uid,
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
      };

      const newProfile = {
        userId: uid,
        displayName: socialUser.displayName,
        imgUrl: socialUser.imgUrl || '',
        bannerUrl: '',
        joinDate: date,
        streak: 0,
        verified: false,
        studoProfile: false,
        tags: [socialUser.displayName],
      };

      await this.db.insert(users).values(newUser);
      await this.db.insert(profiles).values(newProfile);

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
}
