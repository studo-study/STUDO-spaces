import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user/users.service';
import { Role } from '../roles';

@Injectable()
export class DeleteUserGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authUser = req.user;
    const targetUserId = req.params.user_id;

    if (!authUser) {
      throw new UnauthorizedException();
    }

    // 1️⃣ existence check
    const exists = await this.userService.existsById(targetUserId);
    if (!exists) {
      throw new NotFoundException('No user with this id exists');
    }

    // 2️⃣ authorization check
    if (authUser.id !== targetUserId && authUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Not allowed to delete this user');
    }

    return true;
  }
}
