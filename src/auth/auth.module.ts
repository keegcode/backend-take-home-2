import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { AuthService } from './domain/auth.service';
import { PrismaSessionsRepository } from './infrastructure/prisma.sessions.repository';
import { PrismaUsersRepository } from './infrastructure/prisma.users.repository';

const sessionsRepositoryProvider = {
        provide: 'SessionsRepository',
        useClass: PrismaSessionsRepository,
};

const usersRepositoryProvider = {
        provide: 'UsersRepository',
        useClass: PrismaUsersRepository,
};
@Module({
        providers: [
                AuthService,
                sessionsRepositoryProvider,
                usersRepositoryProvider,
        ],
        controllers: [AuthController],
        exports: [AuthService],
})
export class AuthModule {}
