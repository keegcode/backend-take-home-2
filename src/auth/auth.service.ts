import { SessionsRepository } from './sessions.repository';
import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/users.entity';
import { InvalidCredentialsException } from './invalid-credentials.exception';
import { SessionEntity } from './session.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
        constructor(
                @Inject('SessionsRepository')
                private readonly sessionsRepository: SessionsRepository,
                private readonly usersService: UsersService,
                private readonly config: ConfigService,
        ) {}

        refreshSessionById(id: string): Promise<void> {
                const expiresAt = this.getSessionExpirationDate();
                return this.sessionsRepository.refreshSessionById(
                        id,
                        expiresAt,
                );
        }

        async signUp(
                name: string,
                password: string,
        ): Promise<{ id: string; sessionId: string }> {
                const { id } = await this.usersService.createUser(
                        name,
                        password,
                );
                const sessionId = await this.sessionsRepository.createSession(
                        id,
                        this.getSessionExpirationDate(),
                );

                return { id, sessionId };
        }

        async signIn(
                name: string,
                password: string,
        ): Promise<{ user: UserEntity; sessionId: string }> {
                const user = await this.usersService.getUser(name, password);

                if (!user) {
                        throw new InvalidCredentialsException();
                }

                const session =
                        await this.sessionsRepository.getValidSessionIdForUserId(
                                user.id,
                        );

                if (session.sessionId) {
                        return { user, sessionId: session.sessionId };
                }

                const sessionId = await this.sessionsRepository.createSession(
                        user.id,
                        this.getSessionExpirationDate(),
                );

                return { user, sessionId };
        }

        signOut(sessionId: string): Promise<void> {
                return this.sessionsRepository.removeSessionById(sessionId);
        }

        async getValidSessionById(id: string): Promise<SessionEntity | null> {
                return this.sessionsRepository.getValidSessionById(id);
        }

        private getSessionExpirationDate(): Date {
                const sessionTTLMS =
                        Number(this.config.get('SESSION_TTL_SEC')) * 1000;
                return new Date(Date.now() + sessionTTLMS);
        }
}
