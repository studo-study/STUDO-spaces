import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class CheckUserAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new UnauthorizedException('You need to be signed in');
    }

    const id =
      request.params.user_id || request.params.profile_id || request.params.id;

    // "me" mag altijd (pipe handelt dit af)
    if (id === 'me') {
      return true;
    }

    // ❗ Geen ownership- of existence-checks hier
    return true;
  }
}
