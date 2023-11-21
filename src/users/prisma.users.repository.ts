import { PrismaClient } from '@prisma/client';
import { UserEntity } from './users.entity';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { encodePassword } from '../../utils/encode-password';
import { comparePasswords } from '../../utils/compare-passwords';

@Injectable()
export class PrismaUsersRepository
        extends PrismaClient
        implements OnModuleInit, UsersRepository
{
        async onModuleInit(): Promise<void> {
                await this.$connect();
        }

        async createUser(name: string, password: string): Promise<UserEntity> {
                const { hash, salt } = await encodePassword(password);
                return this.user.create({
                        select: { id: true, name: true },
                        data: { name, password: hash, salt },
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
                const where = { name };

                const user = await this.user.findFirst({
                        where,
                        select: { password: true, salt: true },
                });

                if (user && password) {
                        return comparePasswords(password, {
                                hash: user.password,
                                salt: user.salt,
                        });
                }

                return Boolean(user);
        }
}
