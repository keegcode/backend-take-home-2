import { PrismaClient } from '@prisma/client';
import { UserEntity } from './users.entity';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class PrismaUsersRepository
        extends PrismaClient
        implements OnModuleInit, UsersRepository
{
        async onModuleInit(): Promise<void> {
                await this.$connect();
        }

        createUser(name: string, password: string): Promise<UserEntity> {
                return this.user.create({
                        select: { id: true, name: true },
                        data: { name, password },
                });
        }

        getUserById(id: string): Promise<UserEntity> {
                return this.user.findFirstOrThrow({
                        select: { id: true, name: true },
                        where: { id },
                });
        }

        async checkIfUserExists(
                name: string,
                password?: string,
        ): Promise<boolean> {
                const user = await this.user.findFirst({
                        where: { name, password },
                });
                return Boolean(user);
        }
}
