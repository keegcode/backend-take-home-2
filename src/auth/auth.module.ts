import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { PrismaSessionsRepository } from './prisma.sessions.repository';

const sessionsRepositoryProvider = {
        provide: 'SessionsRepository',
        useClass: PrismaSessionsRepository,
};
@Module({
        imports: [UsersModule, PassportModule],
        providers: [AuthService, sessionsRepositoryProvider],
        controllers: [AuthController],
        exports: [AuthService],
})
export class AuthModule {}
