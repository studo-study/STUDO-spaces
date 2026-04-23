// src/auth/pipes/parseUserId.pipe.ts
import {
  PipeTransform,
  Injectable,
  BadRequestException,
  Inject,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class ParseUserIdPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) private readonly request: Request & { user?: any },
  ) {}

  transform(value: string): string {
    if (value === 'me') {
      const user = this.request.user;

      if (!user || !user.id) {
        throw new BadRequestException('User not authenticated');
      }

      return String(user.id); // 👈 Zet "me" om naar het echte user ID
    }

    if (!value || value.trim() === '') {
      throw new BadRequestException('User ID must be a valid string or "me"');
    }

    return value;
  }
}
