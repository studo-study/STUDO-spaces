import { Injectable } from '@nestjs/common';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';

@Injectable()
export class AdminService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}
}
