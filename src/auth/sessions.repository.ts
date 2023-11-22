import { SessionEntity } from './session.entity';

export interface SessionsRepository {
        refreshSessionById(id: string, expiresAt: Date): Promise<void>;
        getValidSessionIdForUserId(
                userId: string,
        ): Promise<{ sessionId?: string }>;
        removeSessionById(sessionId: string): Promise<void>;
        createSession(userId: string, expiresAt: Date): Promise<string>;
        getValidSessionById(id: string): Promise<SessionEntity | null>;
}
