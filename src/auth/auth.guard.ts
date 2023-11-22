import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { SessionEntity } from './session.entity';

@Injectable()
export class AuthGuard implements CanActivate {
        constructor(private readonly authService: AuthService) {}
        async canActivate(context: ExecutionContext): Promise<boolean> {
                const request: Request & { session?: SessionEntity } = context
                        .switchToHttp()
                        .getRequest();
                const authorization = request.header('authorization');

                if (!authorization?.length) {
                        return false;
                }

                const sessionId = authorization.split('Bearer ')?.[1]?.trim();

                if (!sessionId?.length) {
                        return false;
                }

                const session =
                        await this.authService.getValidSessionById(sessionId);

                if (!session) {
                        return false;
                }

                await this.authService.refreshSessionById(sessionId);

                request.session = session;

                return true;
        }
}
