import { SessionsRepository } from './sessions.repository';
import { Inject, Injectable } from '@nestjs/common';
import { InvalidCredentialsException } from './invalid-credentials.exception';
import { SessionEntity } from './session.entity';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from './user.entity';
import { UsersRepository } from './users.repository';
import { UserAlreadyExistsException } from './user-already-exists.exception';

@Injectable()
export class AuthService {
        constructor(
                @Inject('SessionsRepository')
                private readonly sessionsRepository: SessionsRepository,
                @Inject('UsersRepository')
                private readonly usersRepository: UsersRepository,
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
                const { id } = await this.createUser(name, password);

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
                const user = await this.usersRepository.getUser(name, password);

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

        private async createUser(
                name: string,
                password: string,
        ): Promise<UserEntity> {
                const duplicate = await this.usersRepository.getUser(name);

                if (duplicate) {
                        throw new UserAlreadyExistsException();
                }

                return this.usersRepository.createUser(name, password);
        }

        private getSessionExpirationDate(): Date {
                const sessionTTLMS =
                        Number(this.config.get('SESSION_TTL_SEC')) * 1000;
                return new Date(Date.now() + sessionTTLMS);
        }
}
