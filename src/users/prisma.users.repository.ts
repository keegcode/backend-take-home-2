import { PrismaClient } from '@prisma/client';
import { UserEntity } from './users.entity';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class PrismaUsersRepository
        extends PrismaClient
        implements OnModuleInit, UsersRepository
{
        async onModuleInit(): Promise<void> {
                await this.$connect();
        }

        async createUser(name: string, password: string): Promise<UserEntity> {
                const { hash, salt } = await this.encodePassword(password);
                return this.user.create({
                        select: { id: true, name: true },
                        data: { name, password: hash, salt },
                });
        }

        async getUser(
                name: string,
                password?: string,
        ): Promise<UserEntity | null> {
                const user = await this.user.findFirst({
                        where: { name },
                        select: {
                                id: true,
                                name: true,
                                password: true,
                                salt: true,
                        },
                });

                if (!user) {
                        return null;
                }

                if (password?.length) {
                        const passwordsEqual = await this.comparePasswords(
                                password,
                                {
                                        hash: user.password,
                                        salt: user.salt,
                                },
                        );
                        return passwordsEqual
                                ? { id: user.id, name: user.name }
                                : null;
                }

                return { id: user.id, name: user.name };
        }

        private async comparePasswords(
                plain: string,
                encoded: { salt: string; hash: string },
        ): Promise<boolean> {
                const { hash } = await this.encodePassword(plain, encoded.salt);
                return encoded.hash === hash;
        }

        private async encodePassword(
                password: string,
                customSalt?: string,
        ): Promise<{
                hash: string;
                salt: string;
        }> {
                const salt = customSalt || randomBytes(16).toString('base64');
                const hash = await promisify(scrypt)(password, salt, 64);
                return {
                        hash: (hash as Buffer).toString('base64'),
                        salt: salt,
                };
        }
}
