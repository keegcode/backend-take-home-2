import { PrismaClient } from '@prisma/client';
import { SessionsRepository } from '../domain/sessions.repository';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { SessionEntity } from '../domain/session.entity';
import { createHash, randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaSessionsRepository
        extends PrismaClient
        implements SessionsRepository, OnModuleInit
{
        constructor(private readonly config: ConfigService) {
                super();
        }
        async getValidSessionById(id: string): Promise<SessionEntity | null> {
                return this.session.findFirst({
                        where: { id, expiresAt: { gt: new Date() } },
                });
        }
        async createSession(userId: string, expiresAt: Date): Promise<string> {
                const id = this.getSessionId(userId);
                await this.session.create({ data: { id, userId, expiresAt } });
                return id;
        }
        async onModuleInit(): Promise<void> {
                await this.$connect();
        }
        async getValidSessionIdForUserId(
                userId: string,
        ): Promise<{ sessionId?: string }> {
                const session = await this.session.findFirst({
                        where: { userId, expiresAt: { gt: new Date() } },
                });
                return { sessionId: session?.id };
        }

        async refreshSessionById(id: string, expiresAt: Date): Promise<void> {
                await this.session.update({
                        where: { id },
                        data: { expiresAt },
                });
        }

        async removeSessionById(sessionId: string): Promise<void> {
                await this.session.delete({ where: { id: sessionId } });
        }

        private getSessionId(userId: string): string {
                return createHash('sha-256')
                        .update(randomBytes(32))
                        .update(userId)
                        .update(this.config.get('SESSION_SECRET'))
                        .digest('base64');
        }
}
