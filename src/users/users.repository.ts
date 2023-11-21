import { PrismaClient } from '@prisma/client';
import { UserEntity } from './users.entity';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class UsersRepository extends PrismaClient implements OnModuleInit {
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

        getUserByNameAndPassword(
                name: string,
                password: string,
        ): Promise<UserEntity> {
                return this.user.findFirstOrThrow({
                        select: { id: true, name: true },
                        where: { name, password },
                });
        }
}
