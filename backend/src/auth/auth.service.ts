import * as argon2 from 'argon2';
import { AuthConfig, ServerConfig } from '../config/configuration';
import { User } from '../types/user';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginRequestDto } from '../session/session.dto';
import { folders, profiles, users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../types/auth';
import { RegisterUserRequestDto } from '../user/users.dto';
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
    const authConfig = this.configService.get<AuthConfig>('auth')!; // 👈 2
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
  async login({ email, password }: LoginRequestDto): Promise<string> {
    // 👇 1
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // 👇 2
    if (!user) {
      throw new UnauthorizedException(
        'The given email and password do not match',
      );
    }

    // 👇 3
    const passwordValid = await this.verifyPassword(
      password,
      user.passwordHash,
    );

    // 👇 4
    if (!passwordValid) {
      throw new UnauthorizedException(
        'The given email and password do not match',
      );
    }

    return this.signJwt(user); // 👈 5
  }

  //google users
  async validateGoogleUser(googleUser: any): Promise<string> {
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
        img_url: googleUser.picture || 'default',
        join_date: date.toISOString(),
        totalSets: 0,
        streak_started: null,
        streak_count: 0,
        streak_last_update: null,
        last_login: date.toISOString(),
        roles: [Role.USER],
        publicRole: 'student',
        verified: false,
      };

      // Profile
      const newProfile = {
        user_id: uid,
        displayName: `${googleUser.firstName} ${googleUser.lastName}`,
        img_url: googleUser.picture || '',
        banner_url: '',
        join_date: date.toISOString(),
        streak: 0,
        verified: true,
      };

      // Root folder
      const rootFolder = {
        id: uuidv4(),
        name: `${googleUser.firstName}'s folder`,
        owner_id: uid,
      };

      // Insert all records
      await this.db.insert(users).values(newUser);
      await this.db.insert(profiles).values(newProfile);
      await this.db.insert(folders).values(rootFolder);

      // Fetch de nieuwe user
      user = await this.db.query.users.findFirst({
        where: eq(users.id, uid),
      });
    } else {
      // Update last_login voor bestaande user
      await this.db
        .update(users)
        .set({ last_login: new Date().toISOString() })
        .where(eq(users.id, user.id));
    }

    // Genereer en return JWT token
    return this.signJwt(user!);
  }

  //microsoft users
  async validateMicrosoftUser(microsoftUser: any): Promise<string> {
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
        img_url: microsoftUser.picture || 'default',
        join_date: date.toISOString(),
        totalSets: 0,
        streak_started: null,
        streak_count: 0,
        streak_last_update: null,
        last_login: date.toISOString(),
        roles: [Role.USER],
        publicRole: 'student',
        verified: true, // Microsoft users zijn al geverifieerd
      };

      // Profile
      const newProfile = {
        user_id: uid,
        displayName: `${microsoftUser.firstName} ${microsoftUser.lastName}`,
        img_url: microsoftUser.picture || '',
        banner_url: '',
        join_date: date.toISOString(),
        streak: 0,
        verified: true,
      };

      // Root folder
      const rootFolder = {
        id: uuidv4(),
        name: `${microsoftUser.firstName}'s folder`,
        owner_id: uid,
      };

      // Insert all records
      await this.db.insert(users).values(newUser);
      await this.db.insert(profiles).values(newProfile);
      await this.db.insert(folders).values(rootFolder);

      // Fetch de nieuwe user
      user = await this.db.query.users.findFirst({
        where: eq(users.id, uid),
      });
    } else {
      // Update last_login voor bestaande user
      await this.db
        .update(users)
        .set({ last_login: new Date().toISOString() })
        .where(eq(users.id, user.id));
    }

    // Genereer en return JWT token
    return this.signJwt(user!);
  }

  //smartschool users
  async validateSmartschoolUser(smartschoolUser: any): Promise<string> {
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
        img_url: smartschoolUser.picture || 'default',
        join_date: date.toISOString(),
        totalSets: 0,
        streak_started: null,
        streak_count: 0,
        streak_last_update: null,
        last_login: date.toISOString(),
        roles: [Role.USER],
        publicRole: 'student',
        verified: true, // Microsoft users zijn al geverifieerd
      };

      // Profile
      const newProfile = {
        user_id: uid,
        displayName: `${smartschoolUser.firstName} ${smartschoolUser.lastName}`,
        img_url: smartschoolUser.picture || '',
        banner_url: '',
        join_date: date.toISOString(),
        streak: 0,
        verified: true,
      };

      // Root folder
      const rootFolder = {
        id: uuidv4(),
        name: `${smartschoolUser.firstName}'s folder`,
        owner_id: uid,
      };

      // Insert all records
      await this.db.insert(users).values(newUser);
      await this.db.insert(profiles).values(newProfile);
      await this.db.insert(folders).values(rootFolder);

      // Fetch de nieuwe user
      user = await this.db.query.users.findFirst({
        where: eq(users.id, uid),
      });
    } else {
      // Update last_login voor bestaande user
      await this.db
        .update(users)
        .set({ last_login: new Date().toISOString() })
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
  }: RegisterUserRequestDto): Promise<string> {
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
      img_url: 'default',
      join_date: date.toISOString(),
      totalSets: 0,
      streak_started: date.toISOString(),
      streak_count: 0,
      streak_last_update: date.toISOString(),
      last_login: date.toISOString(),
      roles: [Role.USER],
      publicRole: role,
      verified: false,
    };

    // Profile
    const newProfile = {
      user_id: uid,
      displayName: displayName,
      img_url: '',
      banner_url: '',
      join_date: date.toISOString(),
      streak: 0,
      verified: false,
    };

    // Root folder
    const rootFolder = {
      id: uuidv4(), // ✅ Functie uitvoeren
      name: `${displayName}'s folder`,
      owner_id: uid,
    };

    // Insert all records
    await this.db.insert(users).values(newUser);
    await this.db.insert(profiles).values(newProfile);
    await this.db.insert(folders).values(rootFolder);

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
    img_url?: string;
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
        img_url: socialUser.img_url || 'default',
        join_date: date.toISOString(),
        totalSets: 0,
        streak_started: null,
        streak_count: 0,
        streak_last_update: null,
        last_login: date.toISOString(),
        roles: [Role.USER],
        publicRole: 'student',
        verified: false,
      };

      const newProfile = {
        user_id: uid,
        displayName: socialUser.displayName,
        img_url: socialUser.img_url || '',
        banner_url: '',
        join_date: date.toISOString(),
        streak: 0,
        verified: true,
      };

      const rootFolder = {
        id: uuidv4(),
        name: `${socialUser.displayName}'s folder`,
        owner_id: uid,
      };

      await this.db.insert(users).values(newUser);
      await this.db.insert(profiles).values(newProfile);
      await this.db.insert(folders).values(rootFolder);

      user = await this.db.query.users.findFirst({
        where: eq(users.id, uid),
      });
    } else {
      await this.db
        .update(users)
        .set({
          last_login: new Date().toISOString(),
          img_url: socialUser.img_url || user.img_url, // update foto
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
