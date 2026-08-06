// src/auth/guards/blockImpersonation.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

/**
 * Weigert de request wanneer het huidige token een impersonatie-token is
 * (`impersonated: true`). Zet op gevoelige endpoints die een admin níét in
 * naam van een user mag uitvoeren: wachtwoord/e-mail wijzigen, account
 * verwijderen, betalingen, ...
 *
 * Gebruik: `@UseGuards(BlockImpersonationGuard)` op de handler/controller.
 */
@Injectable()
export class BlockImpersonationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (request.user?.impersonated) {
      throw new ForbiddenException(
        'This action is not allowed while impersonating a user',
      );
    }
    return true;
  }
}
