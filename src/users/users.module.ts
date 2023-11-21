import { Module } from '@nestjs/common';
import { PrismaUsersRepository } from './prisma.users.repository';
import { UsersService } from './users.service';

const UsersRepositoryProvider = {
        provide: 'UsersRepository',
        useClass: PrismaUsersRepository,
};

@Module({
        providers: [UsersRepositoryProvider, UsersService],
        exports: [UsersRepositoryProvider, UsersService],
})
export class UsersModule {}
