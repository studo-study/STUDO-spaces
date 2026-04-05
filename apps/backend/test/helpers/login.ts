import { INestApplication } from '@nestjs/common';
import { AuthService } from '../../src/auth/auth.service';

export async function login(app: INestApplication): Promise<string> {
  const authService = app.get(AuthService);

  const token = await authService.login({
    email: 'paulallen@example.com',
    password: '123',
  });

  if (!token) {
    throw new Error('Login failed - no token received');
  }

  return token;
}

export async function loginAdmin(app: INestApplication): Promise<string> {
  const authService = app.get(AuthService);

  const token = await authService.login({
    email: 'charles@test.com',
    password: '123',
  });

  if (!token) {
    throw new Error('Admin login failed - no token received');
  }

  return token;
}

export async function loginAsUser(app: INestApplication): Promise<string> {
  const authService = app.get(AuthService);

  const token = await authService.login({
    email: 'paulallen@example.com', // User 2
    password: '123',
  });

  if (!token) {
    throw new Error('Login failed - no token received');
  }

  return token;
}
